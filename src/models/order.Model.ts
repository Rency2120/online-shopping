import { IOrder } from '@interfaces/order.interface';
import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

export interface OrderAttributes extends Optional<IOrder, 'id' | 'createdAt' | 'updatedAt'> {}

class Order extends Model<IOrder, OrderAttributes> {
  public id!: number;
  public user_id!: number;
  public cartId!: number;
  public total_price!: number;
  public status!: 'Pending' | 'Order Confirmed' | 'Dispatched' | 'Shipped' | 'Delivered' | 'Cancelled';
  public shipping_address!: Record<string, any>;
  public discount_id!: number;
  public shipping_cost!: number;
  public tracking_number!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public static associate(models: any) {
    Order.belongsTo(models.Users, {
      foreignKey: 'user_id',
      as: 'user',
    });

    Order.belongsTo(models.Discount, {
      foreignKey: 'discount_id',
      as: 'discount',
    });

    Order.belongsTo(models.ShippingCost, {
      foreignKey: 'shipping_cost',
      as: 'shippingDetails',
    });
    Order.hasMany(models.Payment, {
      foreignKey: 'order_id',
    });
  
  }
}

export const initializeOrder = (sequelize: Sequelize) => {
  Order.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      cartId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'CartItem',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      total_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('Pending', 'Order Confirmed', 'Dispatched', 'Shipped', 'Delivered', 'Cancelled'),
        defaultValue: 'Pending',
      },
      shipping_address: {
        type: DataTypes.JSON,
        allowNull: false,
        
      },
      discount_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'Discounts',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      shipping_cost: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'ShippingCosts',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      tracking_number: {
        type: DataTypes.STRING,
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
      modelName: 'Order',
      tableName: 'Orders',
      timestamps: true,
    },
  );
};

export default Order;
