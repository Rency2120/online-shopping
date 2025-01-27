import { Association, DataTypes, Model, Optional, Sequelize } from 'sequelize';
import sequelize from '../database/sequelize';
import { UserAttributes, UserCreationAttributes } from '../interfaces/users.interface';

class Users extends Model<UserAttributes, UserCreationAttributes> {
  public id!: string;
  public name!: string;
  public email!: string;
  public password!: string;
  public mobileNumber!: string;
  public role!: 'ADMIN' | 'CUSTOMER';
  public address!: string;
  public city!: string;
  public country!: string;
  public profilePicture!: string;
  public isVerified!: boolean;
  public resetPasswordToken!: string;
  public resetPasswordTokenExpiresAt!: Date;
  public verificationToken!: string;
  public verificationTokenExpiresAt!: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public static associate(models: any) {
    Users.hasMany(models.Cart, {
      foreignKey: 'user_id',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    Users.hasMany(models.Wishlist, {
      foreignKey: 'user_id',
    });

    Users.hasMany(models.Order,{
      foreignKey: 'user_id', 
      as: 'orders'
    });
    Users.hasMany(models.Review,{
      foreignKey:"user_id",
      as:"reviews"
    })
  }
}
export const initializeUsers = (sequelize: Sequelize) => {
  Users.init(
    {
      id: {
        type: DataTypes.NUMBER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      mobileNumber: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM('ADMIN', 'CUSTOMER'),
        allowNull: false,
        defaultValue: 'CUSTOMER',
      },
      address: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      city: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      country: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      profilePicture: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      isVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      resetPasswordToken: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      resetPasswordTokenExpiresAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      verificationToken: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      verificationTokenExpiresAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      tableName: 'users',
      timestamps: true,
    },
  );
};

export default Users;
