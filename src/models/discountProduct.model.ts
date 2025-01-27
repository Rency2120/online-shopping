import { Model, DataTypes, Sequelize, Association } from 'sequelize';
import Discount from './discount.model';

interface DiscountProductAttributes {
    discount_id: number;
    product_id: number;
    createdAt?: Date;
    updatedAt?: Date;
}

class DiscountProduct extends Model<DiscountProductAttributes>
    implements DiscountProductAttributes {
    public discount_id!: number;
    public product_id!: number;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    public discount!: Discount;

    public static associate(models: any) {
        DiscountProduct.belongsTo(models.Discount, {
            foreignKey: "discount_id",
            as: 'discount', 
        })
        DiscountProduct.belongsTo(models.Product, {
            foreignKey: 'product_id',
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE',
            as: 'product',
        });
    }
}
export const initializeDiscountProduct = (sequelize: Sequelize) => {

    DiscountProduct.init(
        {
            discount_id: {
                type: DataTypes.INTEGER,

                references: {
                    model: 'Discount',
                    key: 'id',
                },
                allowNull: false,
            },
            product_id: {
                type: DataTypes.INTEGER,

                references: {
                    model: 'Products',
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
            tableName: 'discount_products',
            timestamps: true,
            indexes: [
                {
                    unique: true,
                    fields: ['discount_id', 'product_id'],
                },
            ],
            // hasPrimaryKey: true,
        }
    );

};
export default DiscountProduct