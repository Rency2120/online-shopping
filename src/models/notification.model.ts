import { Model, DataTypes, Sequelize } from 'sequelize';
import Users from '@/models/user.Model';

export enum NotificationType {
  ORDER_CREATED = 'ORDER_CREATED',
  ORDER_STATUS_UPDATE = 'ORDER_STATUS_UPDATE',
  PASSWORD_RESET = 'PASSWORD_RESET'
}

class Notification extends Model {
  public id!: number;
  public user_id!: number;
  public type!: NotificationType;
  public message!: string;
  public metadata!: Record<string, any>;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public static associate(models: any) {
    Notification.belongsTo(models.Users, {
      foreignKey: 'user_id',
      as: 'user'
    });
  }
}

export const initializeNotification = (sequelize: Sequelize) => {
  Notification.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      // is_read: {
      //   type: DataTypes.BOOLEAN,
      //   defaultValue: false,
      // },
    },
    {
      sequelize,
      modelName: 'Notification',
      tableName: 'notifications',
    }
  );
};

export default Notification; 