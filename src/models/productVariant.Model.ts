import { IProductVariant } from '@/interfaces/productVariant.interface';
import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

export interface ProductVariantAttributes extends Optional<IProductVariant, 'Variant_id' | 'updatedAt' | 'createdAt'> { }

class ProductVariant extends Model<IProductVariant, ProductVariantAttributes> {
  public Variant_id!: number;
  public Product_id!: number;
  public variantName!: string;
  public image!: string;
  public size!: string;
  public price!: number;
  public stock_sold!: number;
  public stock_left!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public static associate(models:any) {
    ProductVariant.belongsTo(models.Product, {
      foreignKey: 'Product_id',
      as: 'productId',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
    ProductVariant.hasMany(models.CartItem,{
      foreignKey: 'ProductVariant_id'
    })
  }
}

export const initializeProductVariant = (sequelize: Sequelize) => {
  ProductVariant.init(
    {
      Variant_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
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
      variantName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      image: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      size: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      price: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      stock_sold: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      stock_left: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      modelName: 'ProductVariant',
      tableName: 'ProductVariants',
    },
  );
};

export default ProductVariant;
