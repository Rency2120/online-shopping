import { ICart } from '@/interfaces/cart.interface';
import { DataTypes, Model, Optional, Sequelize } from 'sequelize';
import CartItem from './cartItem.model';

export interface CartAttributes extends Optional<ICart, 'id' | 'createdAt' | 'updatedAt'> {}

class Cart extends Model<ICart, CartAttributes> {
  public id!: number;
  public user_id!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public CartItems?: CartItem[];

  public static associate(models: any) {
    Cart.belongsTo(models.Users, {
      foreignKey: 'user_id',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    Cart.hasMany(models.CartItem, {
      foreignKey: 'cart_id',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  }
}

export const initializeCart = (sequelize: Sequelize) => {
  Cart.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
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
      modelName: 'Cart',
      tableName: 'Carts',
      timestamps: true,
    },
  );
};
export default Cart;
