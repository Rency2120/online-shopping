import { Optional } from "sequelize";

export interface UserAttributes {
  id: string;
  name: string;
  email: string;
  password: string;
  mobileNumber: string;
  role: 'ADMIN' | 'CUSTOMER';
  address?: string;
  city?: string;
  country?: string;
  profilePicture?: string;
  isVerified: boolean;
  resetPasswordToken?: string;
  resetPasswordTokenExpiresAt?: Date;
  verificationToken?: string;
  verificationTokenExpiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserCreationAttributes
  extends Optional<UserAttributes, 'id' | 'createdAt' | 'updatedAt'> { }

