import { DataTypes, Model, Optional, Sequelize } from 'sequelize';
import { IShipping } from '@/interfaces/shipping.interface';

export interface ShippingAttributes extends Optional<IShipping, 'id' | 'createdAt' | 'updatedAt'> { }

class ShippingCost extends Model<IShipping,ShippingAttributes> {
  public id!: number;
  public name!: string;
  public quantity!: number;
  public order_price!: number;
  public cost!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public static associate(models: any) {
    ShippingCost.hasMany(models.Order, {
      foreignKey: 'shipping_cost',
      as: 'orders',
    });
  }
}

export const initializeShippingCost = (sequelize: Sequelize) => {
  ShippingCost.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      order_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },
      cost: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
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
      modelName: 'ShippingCost',
      tableName: 'ShippingCosts',
      timestamps: true,
    },
  );
};

export default ShippingCost;
