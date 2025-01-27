import { IsubCategory } from '@/interfaces/subCategory';
import { DataTypes, Model, Optional, Sequelize } from 'sequelize';
import DiscountSubCategory from './discountSubCategory.model';

export interface subCategoryAttributes extends Optional<IsubCategory, 'id' | 'createdAt' | 'updatedAt'> { }
class SubCategory extends Model<IsubCategory, subCategoryAttributes> {
  public id!: number;
  public name!: string;
  public category_id!: number;
  public discountSubCategories?: DiscountSubCategory[];
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public static associate(models: any) {
    SubCategory.hasMany(models.Product, {
      foreignKey: 'SubCategory_id',
      as: 'products',
    });
    SubCategory.hasMany(models.DiscountSubCategory, {
      foreignKey: 'subCategory_id',
      as: 'discountSubCategories'
    });

    SubCategory.belongsToMany(models.Discount, {
      through: models.DiscountSubCategory,
      foreignKey: 'subCategory_id',
      as: 'discounts',
    });
  }
}
export const initializsubCategory = (sequelize: Sequelize) => {


  SubCategory.init(
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
      category_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Categories',
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
      timestamps: true,
      tableName: 'subCategories',
      modelName: 'SubCategory',
    },
  );
}
export default SubCategory;
