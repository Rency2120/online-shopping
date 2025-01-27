import { NextFunction, Request, Response } from 'express';
import { UserService } from '../services/userService';
import Container from 'typedi';
import Users from '@/models/user.Model';
import jwt from 'jsonwebtoken'
import { HttpException } from '@/exceptions/httpException';



export class UserController {
    private userService = Container.get(UserService);

    public createUser = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { name, email, password, mobileNumber, role } = req.body;
            const { user, token } = await this.userService.createUser({ name, email, password, mobileNumber, role: 'CUSTOMER', isVerified: false });

            return res.status(201).json({
                message: "User created successfully",
                data: { user, token },

                status: true
            });
        } catch (error) {
            next(error)
        }
    };

    public verifyOtp = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { otp } = req.body
            if (!otp) {
                return res.status(400).json({ message: ' OTP are required.' });
            }
            const user = req.user
            console.log('Authenticated User:', user);
            const result = await this.userService.verifyOtp(user.email, otp)
            if (result) {
                res.status(200).json({ message: 'Email verified successfully.', status: true });
            } else {
                res.status(400).json({ message: 'Invalid or expired verification token.' });
            }
        } catch (error) {
            next(error);
        }
    }

    public loginUser = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email, password } = req.body
            const { user, token } = await this.userService.loginUser(email, password)
            return res.status(200).json({ message: "User logged in successfully", data: user, token, status: true })
        } catch (error) {
            next(error)
        }
    }

    public getUserById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = req.params.id;
            const user = await this.userService.getUserById(id);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            return res.status(200).json({ data: user, status: true });
        } catch (error) {
            next(error)
        }
    };

    public updateUser = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.params.id;
            const { address, city, country, profilePicture, oldPassword, newPassword, } = req.body;
            const updateData: Partial<any> = { address, city, country, profilePicture };

            if (newPassword) {
                if (!oldPassword) {
                    return res.status(400).json({ message: 'Old password is required.' });
                }
                const updatedUser = await this.userService.updateUser(userId, oldPassword, newPassword, updateData);

                if (!updatedUser) {
                    return res.status(404).json({ message: "User not found" });
                }
                return res.status(200).json({ message: "User updated successfully", data: updatedUser, status: true });
            } else {
                const updatedUser = await this.userService.updateUser(userId, undefined, undefined, updateData);
                if (!updatedUser) {
                    return res.status(404).json({ message: "User not found" });
                }
                return res.status(200).json({ message: "User updated successfully", data: updatedUser, status: true });

            }
        } catch (error) {
            next(error)
        }
    };
    public delete = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.params.id;
            const deletedUser = await this.userService.deleteUser(userId);
            if (!deletedUser) {
                return res.status(404).json({ message: "User not found", status: false });
            }
            return res.status(200).json({ message: "User deleted successfully", status: true });
        } catch (error) {
            next(error)
        }
    }
    public forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email } = req.body;
            if (!email) {
                return res.status(400).json({ message: 'Email is required.' });
            }
            const user = await Users.findOne({ where: { email } })
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            const response = await this.userService.forgotPassword(email);
            return res.status(200).json({
                message: "Password reset link sent to your email",
                status: true,
                data: response,


            });
        } catch (error) {
            next(error)
        }
    }
    public resetPasswordPage = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { token } = req.params;

            const decoded = jwt.verify(token, process.env.SECRET_KEY) as { email: string };
            const user = await Users.findOne({ where: { email: decoded.email, resetPasswordToken: token } });

            if (!user) {
                return res.status(400).json({ message: 'Invalid or expired token.' });
            }
            return res.status(200).json({ message: 'Token is valid. You can now reset your password.' });
        } catch (error) {
            return res.status(400).json({ message: 'Invalid or expired token.' });
        }
    }

    public resetPassword = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { newPassword, confirmPassword } = req.body;
            const { token } = req.query
            if (!token || !newPassword || !confirmPassword) {
                return res.status(400).json({ message: 'Token and new password are required.' });
            }

            const user = await this.userService.resetPassword(token as string, newPassword, confirmPassword);

            return res.status(200).json({
                message: 'Password updated successfully',
                status: true,
                data: user,
            });
        } catch (error) {
            console.error('Error in resetPassword controller:', error);
            next(error);
        }
    }
    public getAll = async (req: Request, res: Response, next: NextFunction) => {

        try {
            const users = await this.userService.getAllUsers();
            return res.status(200).json({
                message: 'Users retrieved successfully', status: true, data: users
            });
        } catch (error) {
            console.error('Error in getAll controller:', error);
            next(error);
        }


    }
    public assignAdminRole = async (req: Request, res: Response, next: NextFunction) => {
        try {
            console.log('Request Body:', req.body);
            const { userId } = req.body;
            console.log("Received userId:", userId)
            if (!userId) {
                return res.status(400).json({ message: 'userId is required' });
            }
            const user = await Users.findByPk(userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            console.log(user)

            user.role = 'ADMIN';
            await user.save();

            res.status(200).json({
                message: 'User has been promoted to admin.',
                data: { id: user.id, name: user.name, email: user.email, role: user.role },
            });
        } catch (error) {
            throw new HttpException(500, "Error in Admin")
        }
    };

}






// public verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const { token } = req.params;
//         const { email } = req.body
//         if (!email) {
//             return res.status(400).json({ message: 'Email is required.' });
//         }
//         const result = await this.userService.verifyEmail(token, email);

//         if (result) {
//             res.status(200).json({ message: 'Email verified successfully.', status: true });
//         } else {
//             res.status(400).json({ message: 'Invalid or expired verification token.' });
//         }
//     } catch (error) {
//         next(error);
//     }
// };

