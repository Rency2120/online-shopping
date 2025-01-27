import { ICartItem } from '@/interfaces/cartItem.interface';
import { DataTypes, Model, Optional, Sequelize } from 'sequelize';
import Product from './Product.Model';
import ProductVariant from './productVariant.Model';

export interface CartItemAttributes extends Optional<ICartItem, 'id' | 'createdAt' | 'updatedAt'> {}

class CartItem extends Model<ICartItem, CartItemAttributes> {
  public id!: number;
  public cart_id!: number;
  public Product_id!: number;
  public ProductVariant_id!: number;
  public quantity!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public Product?: Product;
  public variant?: ProductVariant;

  public static associate(models: any) {
    CartItem.belongsTo(models.Cart, {
      foreignKey: 'cart_id',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
    CartItem.belongsTo(models.Product, {
      foreignKey: 'Product_id',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
    CartItem.belongsTo(models.ProductVariant, {
      foreignKey: 'ProductVariant_id',
      as: 'variant',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  }
}

export const initializeCartItem = (sequelize: Sequelize) => {
  CartItem.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      cart_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Carts',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      Product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Products',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      ProductVariant_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'ProductVariants',
          key: 'Variant_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        validate: {
          min: 1,
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
      modelName: 'CartItem',
      tableName: 'CartItems',
      timestamps: true,
    },
  );
};

export default CartItem;
