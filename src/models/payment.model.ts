import { Model, DataTypes, Sequelize, Optional, Association } from 'sequelize';
import { IPayment } from '@/interfaces/payment.interface';

export interface PaymentAttributes extends Optional<IPayment, 'id' | 'createdAt' | 'updatedAt'> {}

class Payment extends Model<IPayment, PaymentAttributes> {
  public id!: number;
  public order_id!: number;
  public payment_status!: 'Successful' | 'Failed' | 'Pending';
  public payment_method!: 'Card' | 'Stripe';
  public transaction_id!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public static associate(models: any) {
    Payment.belongsTo(models.Order, {
      foreignKey: 'order_id',
    });
  }
}

export const initializePayment = (sequelize: Sequelize) => {
  Payment.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      order_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Orders',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      payment_status: {
        type: DataTypes.ENUM('Successful', 'Failed', 'Pending'),
        allowNull: false,
        defaultValue: 'Pending',
      },
      payment_method: {
        type: DataTypes.ENUM('Card', 'Stripe'),
        allowNull: false,
      },
      transaction_id: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
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
      tableName: 'Payments',
      timestamps: true,
    },
  );
};

export default Payment;
