import { DataTypes, Model, Sequelize } from 'sequelize';
import { DiscountAttributes, DiscountCreation } from '../interfaces/discount.interface';
import DiscountCategory from './discountCategory.model';
import DiscountSubCategory from './discountSubCategory.model';
import DiscountProduct from './discountProduct.model';

class Discount extends Model<DiscountAttributes, DiscountCreation> {
  public id!: number;
  public name!: string;
  public discount_type!: 'percentage' | 'fixed';
  public start_date!: Date | null;
  public end_date!: Date | null;
  public value!: number;
  public unit!: number | null;
  public is_active!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public categories!: DiscountCategory[];
  public subCategories!: DiscountSubCategory[];
  public products!: DiscountProduct[];

  public static associate(models: any) {
    Discount.hasMany(models.DiscountProduct, {
      foreignKey: 'discount_id',
      as: 'products',
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });

    Discount.hasMany(models.DiscountCategory, {
      foreignKey: 'discount_id',
      as: 'categories',
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });

    Discount.hasMany(models.DiscountSubCategory, {
      foreignKey: 'discount_id',
      as: 'subCategories',
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });

    Discount.belongsToMany(models.SubCategory, {
      through: models.DiscountSubCategory,
      foreignKey: 'discount_id',
      otherKey: 'subCategory_id',
      as: 'subCategory',
    });
    Discount.belongsToMany(models.Category, {
      through: models.DiscountCategory,
      foreignKey: 'discount_id',
      otherKey: 'Category_id',
      as: 'category',
    });
    Discount.belongsToMany(models.Product, {
      through: models.DiscountProduct,
      foreignKey: 'discount_id',
      otherKey: 'product_id',
      as: 'product',
    });

    Discount.hasMany(models.Order, {
      foreignKey: 'discount_id',
      as: 'orders',
    });
  }
}

export const initializeDiscount = (sequelize: Sequelize) => {
  Discount.init(
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
      },
      discount_type: {
        type: DataTypes.ENUM('percentage', 'fixed'),
        allowNull: false,
        defaultValue: 'percentage',
      },
      start_date: {
        type: DataTypes.DATE,
      },
      end_date: {
        type: DataTypes.DATE,
      },
      value: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      unit: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },

      is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: 'Discount',
      tableName: 'discounts',
      timestamps: true,
    },
  );
};

export default Discount;
