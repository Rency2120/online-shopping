import { DataTypes, Model, Optional, Sequelize } from 'sequelize';
import { IProduct } from '@interfaces/product.interface';
import Category from './categoryModel';
import SubCategory from './subCategoryModel';
import ProductVariant from './productVariant.Model';
import Discount from './discount.model';
import DiscountProduct from './discountProduct.model';

export interface ProductAttributes extends Optional<IProduct, 'id' | 'createdAt' | 'updatedAt'> { }
class Product extends Model<IProduct, ProductAttributes> {
  public id!: number;
  public name!: string;
  public Category_id!: number;
  public SubCategory_id!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public category?: Category;
  public subcategory?: SubCategory;
  public variants?: ProductVariant[];
  public variant?: ProductVariant;
  public discounts?: Discount[];
  public discountProduct?: DiscountProduct[];

  public static associate(models: any) {
    Product.belongsTo(models.Category, {
      foreignKey: 'Category_id',
      as: 'category',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    Product.belongsTo(models.SubCategory, {
      foreignKey: 'SubCategory_id',
      as: 'subcategory',
    });

    Product.hasMany(models.ProductVariant, {
      foreignKey: 'Product_id',
      as: 'variants',
    });
    Product.hasMany(models.DiscountProduct, {
      foreignKey: 'product_id',
      as: 'discountProduct',

    });

    Product.belongsToMany(models.Discount, {
      through: models.DiscountProduct,
      foreignKey: 'product_id',
      as: 'discounts',
    });

    Product.hasMany(models.CartItem,{
      foreignKey:'Product_id'
    })


    Product.hasMany(models.Wishlist, {
      foreignKey: 'product_id',
    });
    Product.hasMany(models.Review,{
      foreignKey:"product_id",
      as:"reviews"
    })
  }
}

export const initializeProduct = (sequelize: Sequelize) => {
  Product.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      Category_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Categories',
          key: 'id',
        },
      },
      SubCategory_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'subCategories',
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
      modelName: 'Product',
      tableName: 'Products',
      timestamps: true,
    },
  );
};
export default Product;
