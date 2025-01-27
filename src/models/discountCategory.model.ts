import { Model, DataTypes, Sequelize } from 'sequelize';
import Discount from './discount.model';

interface DiscountCategoryAttributes {
    discount_id: number;
    Category_id: number;
    createdAt?: Date;
    updatedAt?: Date;
}

class DiscountCategory extends Model<DiscountCategoryAttributes>
    implements DiscountCategoryAttributes {
    public discount_id!: number;
    public Category_id!: number;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    public discount!: Discount;
    
    public static associate(models: any) {
        DiscountCategory.belongsTo(models.Discount, {
            foreignKey: "discount_id",
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE',
            as: 'discount',
        }
        )
        DiscountCategory.belongsTo(models.Category, {
            foreignKey: "Category_id",
            as: 'category',

        }
        )
    }
}
export const initializeDiscountCategory = (sequelize: Sequelize) => {

    DiscountCategory.init(
        {
            discount_id: {
                type: DataTypes.INTEGER,
                references: {
                    model: 'discounts',
                    key: 'id',
                },
                allowNull: false,
            },
            Category_id: {
                type: DataTypes.INTEGER,
                references: {
                    model: 'Categories',
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
            tableName: 'discount_categories',
            timestamps: true,
            indexes: [
                {
                    unique: true,
                    fields: ['discount_id', 'Category_id'],
                },
            ],
        }
    );

};

export default DiscountCategory;