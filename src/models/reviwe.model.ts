import { Model, DataTypes, Sequelize } from 'sequelize';
import Users from './user.Model';
import Product from './Product.Model';
import { IReview, IReviewCreation } from '@/interfaces/review.interface';

class Review extends Model<IReview, IReviewCreation> {
  declare id: number;
  declare user_id: number;
  declare product_id: number;
  declare rating: number;
  declare comment: string;
  declare images: string[];
  declare createdAt: Date;
  declare updatedAt: Date;

  public static associate(models: any) {
    Review.belongsTo(models.Users, {
      foreignKey: 'user_id',
      as: 'user'
    });

    Review.belongsTo(models.Product, {
      foreignKey: 'product_id',
      as: 'product'
    });
  }
}

export const initializeReview = (sequelize: Sequelize) => {
  Review.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Products',
        key: 'id'
      }
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    comment: {
      type: DataTypes.STRING,
      allowNull: true
    },
    images: {
      type: DataTypes.STRING,
      allowNull: true,
      get() {
        const rawValue = this.getDataValue('images' as keyof IReview) as string | null;
        return rawValue ? JSON.parse(rawValue) : [];
      },
      set(value: string[] | null) {
        this.setDataValue('images' as keyof IReview, value ? JSON.stringify(value) : null);
      }
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    tableName: 'reviews',
    timestamps: true
  });
};

export default Review;