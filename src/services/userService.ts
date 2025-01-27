import Container, { Service } from 'typedi';
import { UserCreationAttributes } from '../interfaces/users.interface';
import Users from '@/models/user.Model';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { sendForgotPasswordEmail, sendOtpEmail, sendWelcomEmail } from '@/utils/mailer';
import { HttpException } from '@/exceptions/httpException';
import crypto from 'crypto';
import { NotificationService } from './Notification.service';
import { NotificationType } from '@/models/notification.model';

@Service()
export class UserService {
  public notificationService = Container.get(NotificationService);
  public async createUser(userData: UserCreationAttributes): Promise<{ user: Users, token: string }> {
    try {
      const checkEmail = await Users.findOne({ where: { email: userData.email } });
      if (checkEmail) {
        throw new Error('Email already exists');
      }

      const checkNumber = await Users.findOne({ where: { mobileNumber: userData.mobileNumber } });
      if (checkNumber) {
        throw new Error('Mobile Number already exists');
      }

      const hashedPassword = await bcrypt.hash(userData.password, 10);

      const otp = crypto.randomInt(100000, 999999).toString();
      const hashedOtp = await bcrypt.hash(otp, 10);
      const otpExpiration = new Date();
      otpExpiration.setMinutes(otpExpiration.getMinutes() + 15);

      const user = await Users.create({
        ...userData,
        password: hashedPassword,
        verificationToken: hashedOtp,
        verificationTokenExpiresAt: otpExpiration,
        isVerified: false,
      });

      await sendOtpEmail(userData.email, otp, userData.name);
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.SECRET_KEY,
        { expiresIn: '1h' }
      ); return { user, token };
    } catch (error) {
      throw new HttpException(400, 'User creation failed: ' + error.message);
    }
  }

  public async verifyOtp(email: string, otp: string) {
    try {
      const user = await Users.findOne({ where: { email: email } });

      if (!user.verificationTokenExpiresAt || new Date() > new Date(user.verificationTokenExpiresAt)) {
        throw new HttpException(400, 'OTP has expired');
      }
      const isOtpVerify = await bcrypt.compare(otp, user.verificationToken);
      if (!isOtpVerify) {
        throw new HttpException(400, 'Invalid OTP');
      }
      user.isVerified = true;
      user.verificationToken = '';
      user.verificationTokenExpiresAt = null;
      await user.save();
      await sendWelcomEmail(user.email, user.name);

      return user;
    } catch (error) {
      throw new HttpException(400, 'Invalid OTP');
    }
  }

  public async loginUser(email: string, password: string) {
    try {
      const user = await Users.findOne({ where: { email } })
      if (!user) {
        throw new Error('Invalid email or password')
      }
      const isValidPassword = await bcrypt.compare(password, user.password)
      if (!isValidPassword) {
        throw new Error('Invalid email or password')
      }
      if (user.verificationToken !== null && user.verificationToken !== '') {
        throw new HttpException(404, 'please Verify Your email')

      }
      const payload = {
        id: user.id,
        email: user.email,
        role: user.role
      }
      const token = jwt.sign(payload, process.env.SECRET_KEY as string, {
        expiresIn: '1h',
      })
      console.log("token", token)
      return { user, token };
    } catch (error) {
      console.log("Error in Login Service", error)
      throw new HttpException(400, 'Login failed: ' + error.message);
    }
  }


  public getUserById = async (id: string) => {
    try {
      const user = await Users.findOne({ where: { id } });
      return user;
    } catch (error) {
      throw new HttpException(500, 'User fetch failed: ' + error.message);
    }
  };

  public updateUser = async (
    userId: string,
    oldPassword: string | undefined,
    newPassword: string | undefined,
    updateData: Partial<UserCreationAttributes>,
  ) => {
    try {
      const user = await Users.findByPk(userId);

      if (!user) {
        throw new HttpException(404, 'User not found');
      }
      if (newPassword) {
        if (!oldPassword) {
          throw new HttpException(404, 'Old password is require');
        }
        const isOldP = await bcrypt.compare(oldPassword, user.password);
        if (!isOldP) {
          throw new HttpException(404, 'Old password is incorrect');
        }
        updateData.password = await bcrypt.hash(newPassword, 10);
      }
      await user.update(updateData);
      const updateUser = await Users.findByPk(userId);
      return updateUser;
    } catch (error) {
      throw new HttpException(500, 'User update failed: ' + error.message);
    }
  };
  public async deleteUser(userId) {
    try {
      const user = await Users.findByPk(userId);
      if (!user) {
        throw new HttpException(404, 'User not found');
      }
      await user.destroy();
      return user;
    } catch (error) {
      throw new HttpException(500, 'User delete failed: ' + error.message);
    }
  }
  public async forgotPassword(email: string) {
    try {
      const user = await Users.findOne({ where: { email } });

      const resetToken = jwt.sign({ email: user.email, type: 'forgotPassword' }, process.env.SECRET_KEY as string, { expiresIn: '1h' });
      user.resetPasswordToken = resetToken;
      console.log('resetToken', resetToken);
      user.resetPasswordTokenExpiresAt = new Date(Date.now() + 3600000);
      await user.save();

      const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
      await sendForgotPasswordEmail(user.email, user.name, resetUrl);
      await this.notificationService.createNotification(
        Number(user.id),
        NotificationType.PASSWORD_RESET,
        'Password reset email sent.',
        { resetUrl }
      );
      return { message: 'Password reset email sent.', resetToken: resetToken };
    } catch (error) {
      console.error('Forgot password error:', error.message);
      throw new HttpException(500, 'An error occurred while processing your request.');
    }
  }

  public async verifyResetToken(token: string) {
    try {
      const decoded = jwt.verify(token, process.env.SECRET_KEY as string) as { email: string };

      const user = await Users.findOne({
        where: { email: decoded.email, resetPasswordToken: token, resetPasswordTokenExpiresAt: { $gt: new Date() } },
      });

      if (!user) {
        throw new HttpException(400, 'Invalid or expired token.');
      }

      return user;
    } catch (error) {
      throw new HttpException(500, 'Failed to verify reset token.');
    }
  }
  public async resetPassword(token: string, newPassword: string, confirmPassword: string) {
    try {
      const decoded = jwt.verify(token, process.env.SECRET_KEY as string) as { email: string };

      const user = await Users.findOne({ where: { email: decoded.email } });

      if (!user) {
        throw new HttpException(400, 'Invalid or expired token.');
      }
      if (newPassword !== confirmPassword) {
        throw new HttpException(400, 'Passwords do not match.');
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      user.password = hashedPassword;
      user.resetPasswordToken = null;
      user.resetPasswordTokenExpiresAt = null;
      await user.save();

      return user;
    } catch (error) {
      console.error('Error in resetPassword service:', error);
      throw new HttpException(500, 'Failed to reset password.');
    }
  }

  public async getAllUsers() {
    try {
      const users = await Users.findAll();
      if (!users || users.length === 0) {
        throw new HttpException(404, 'No users found.');
      }
      return users;
    } catch (error) {
      console.error('Error in getAllUsers service:', error);
      throw new HttpException(500, 'Failed to get all users.');
    }
  }
}

// private async sendVerificationEmail(toEmail: string, verificationUrl: string) {
//     try {
//         const subject = 'Verify Your Email Address';
//         const templateName = 'emailVerification';
//         const additionalData = {
//             mainLink: verificationUrl,
//             domainName: process.env.DOMAIN_NAME,
//         };

//         await sendEmail(toEmail, subject, templateName, additionalData);
//         console.log(`Verification email sent to ${toEmail}`);
//     } catch (error) {
//         console.error(`Failed to send verification email to ${toEmail}:`, error.message);
//         throw new HttpException(500, 'Could not send verification email');
//     }
// }

// public async verifyEmail(token: string, email: string): Promise<User> {
//     console.log("Received token:", token);
//     console.log("Received email:", email)
//     try {
//         let decoded: { email: string };
//         try {
//             decoded = jwt.verify(token, process.env.JWT_SECRET) as { email: string };
//         } catch (error) {
//             if (error.name === 'TokenExpiredError') {
//                 throw new HttpException(400, 'Verification token has expired.');
//             }
//             throw new HttpException(400, 'Invalid verification token.');
//         }

//         if (decoded.email !== email) {
//             throw new HttpException(404, 'Email does not match the token.');
//         }

//         const user = await User.findOne({ where: { email: decoded.email, verificationToken: token } });
//         if (!user) {
//             throw new HttpException(404, 'User not found or token is invalid.');
//         }

//         if (user.isVerified) {
//             throw new HttpException(400, 'User has already been verified.');
//         }

//         if (user.verificationTokenExpiresAt && user.verificationTokenExpiresAt < new Date()) {
//             throw new HttpException(400, 'Verification token has expired.');
//         }
//         user.isVerified = true;
//         user.verificationToken = null;
//         user.verificationTokenExpiresAt = null;
//         await user.save();

//         await sendWelcomEmail(user.email, user.name);

//         return user;
//     } catch (error) {
//         console.error(error);
//         throw new HttpException(500, 'Invalid or expired verification token.');
//     }
// }
