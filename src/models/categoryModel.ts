import { ICategory } from '@/interfaces/category.interface';
import { DataTypes, Model, Optional, Sequelize } from 'sequelize';
import SubCategory from './subCategoryModel';
import DiscountCategory from './discountCategory.model';


export interface CategoryAttributes extends Optional<ICategory, 'id' | 'createdAt' | 'updatedAt'> { }

class Category extends Model<ICategory, CategoryAttributes> {
  public id!: number;
  public name!: string;
  public description!: string;
  public image!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public subcategories?: SubCategory[];
  public discountCategories?: DiscountCategory[];

  public static associate(models: any) {
    Category.hasMany(models.Product, {
      foreignKey: 'Category_id',
      as: 'products',
    });

    Category.belongsToMany(models.Discount, {
      through: models.DiscountCategory,
      foreignKey: 'Category_id',
      otherKey: 'discount_id',
      as: 'discounts',
    })

    Category.hasMany(models.DiscountCategory, {
      foreignKey: 'Category_id',
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
      as: 'discountCategories',

    })
    Category.hasMany(models.SubCategory,{
      foreignKey: 'Category_id',
      as: 'subcategories',
    })
  }
}

export const initializeCategory = (sequelize: Sequelize) => {

  Category.init(
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
      description: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      image: {
        type: DataTypes.STRING,
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
      modelName: 'Category',
      tableName: 'Categories',
      timestamps: true,
    },
  );
}
export default Category;
