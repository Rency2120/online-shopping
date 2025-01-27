import { IWishlist } from '@/interfaces/wishlist.interface';
import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

export interface WishlistAttributes extends Optional<IWishlist, 'id' | 'createdAt' | 'updatedAt'> {}

class Wishlist extends Model<IWishlist, WishlistAttributes> {
  public id!: number;
  public user_id!: number;
  public product_id!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public static associate(models: any) {
    Wishlist.belongsTo(models.Users, { foreignKey: 'user_id' });
    Wishlist.belongsTo(models.Product, { foreignKey: 'product_id', as:'products' });
  }
}

export const initializeWishlist = (sequelize: Sequelize) => {
  Wishlist.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
      },
      product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Products',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
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
      modelName: 'Wishlist',
      tableName: 'Wishlists',
      timestamps: true,
    },
  );
};

export default Wishlist;
