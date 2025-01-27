import { Model, DataTypes, Sequelize } from 'sequelize';
import Discount from './discount.model';

interface DiscountSubCategoryAttributes {
    discount_id: number;
    subCategory_id: number;
    createdAt?: Date;
    updatedAt?: Date;
}

class DiscountSubCategory extends Model<DiscountSubCategoryAttributes>
    implements DiscountSubCategoryAttributes {
    public discount_id!: number;
    public subCategory_id!: number;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    public discount!: Discount;
    public static associate(models: any) {
        DiscountSubCategory.belongsTo(models.Discount, {
            foreignKey: "discount_id",
            as: 'discount',
            
        }
        )
        DiscountSubCategory.belongsTo(models.SubCategory, {
            foreignKey: "subCategory_id",
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE',
            as: 'subcategory',
        }
        )
    }
}
export const initializeDiscountsubCategory = (sequelize: Sequelize) => {

    DiscountSubCategory.init(
        {
            discount_id: {
                type: DataTypes.INTEGER,
                references: {
                    model: 'discounts',
                    key: 'id',
                },
                allowNull: false,
            },
            subCategory_id: {
                type: DataTypes.INTEGER,
                references: {
                    model: 'subCategories',
                    key: 'id',
                },
                allowNull: true,
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
            tableName: 'discount_subCategories',
            timestamps: true,
            indexes: [{
                unique: false,
                fields: ['discount_id', 'subCategory_id']
            }]
        }
    );

};

export default DiscountSubCategory;