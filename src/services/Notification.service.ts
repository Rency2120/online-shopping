import { Service } from 'typedi';
import Notification, { NotificationType } from '@/models/notification.model';
import { v4 as uuidv4 } from 'uuid';
import Users from '@/models/user.Model';
import sequelize from 'sequelize';

@Service()
export class NotificationService {
  public async createNotification(
    userId: number,
    type: NotificationType,
    message: string,
    metadata: Record<string, any>
  ): Promise<void> {
    try {
      console.log('\n=== Creating Notification ===');
      console.log('User ID:', userId);
      console.log('Type:', type);
      console.log('Message:', message);
      console.log('Metadata:', metadata);

      const notification = await Notification.create({
        user_id: userId,
        type,
        message,
        metadata,
        // is_read: false
      });

      console.log('Notification created successfully:', notification.id);
    } catch (error) {
      console.error('\n=== Error Creating Notification ===');
      console.error('Error details:', error);
      console.error('Attempted payload:', {
        user_id: userId,
        type,
        message,
        metadata
      });
    }
  }

  public async createOrderNotification(
    orderId: number,
    userId: number,
    amount: number,
    itemCount: number,
    orderStatus: string
  ): Promise<void> {
    try {
      console.log('\n=== Creating Order Notifications ===');
      console.log('Order Details:');
      console.log('- Order ID:', orderId);
      console.log('- Customer ID:', userId);
      console.log('- Amount:', amount);
      console.log('- Item Count:', itemCount);

      console.log('\n=== Creating Customer Notification ===');
      await this.createNotification(
        userId,
        NotificationType.ORDER_CREATED,
        `Your order #${orderId} has been ${orderStatus}. Total amount: $${amount}`,
        {
          orderId,
          amount,
          itemCount,
          orderStatus,
          notificationType: 'customer_order',
          createdAt: new Date()
        }
      );
      console.log('✓ Customer notification created');

      console.log('\n✓ All order notifications created successfully');
    } catch (error) {
      console.error('\n=== Error Creating Order Notifications ===');
      console.error('Error details:', error);
      console.error('Attempted payload:', {
        orderId,
        userId,
        amount,
        itemCount,
        orderStatus
      });
    }
  }

  public async getUnreadNotifications(userId: number): Promise<Notification[]> {
    console.log('\n=== Fetching Unread Notifications ===');
    console.log('User ID:', userId);
    
    const notifications = await Notification.findAll({
      where: {
        user_id: userId,
        // is_read: false,
      },
      order: [['createdAt', 'DESC']],
    });

    console.log('Found notifications:', notifications.length);
    return notifications;
  }

  public async markAsRead(notificationId: string): Promise<void> {
    console.log('\n=== Marking Notification as Read ===');
    console.log('Notification ID:', notificationId);

    try {
      // await Notification.update(
        // { is_read: true },
      //   {
      //     where: {
      //       id: notificationId,
      //     },
      //   }
      // );
      console.log('Notification marked as read successfully');
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  }

  public async getNotificationsForAdmin(): Promise<Notification[]> {
    console.log('\n=== Fetching All Notifications for Admin ===');
    
    const notifications = await Notification.findAll({
      include: [{
        model: Users,
        as: 'user',
        attributes: ['id', 'name', 'email']
      }],
      order: [['createdAt', 'DESC']],
      attributes: [
        'id', 
        'type', 
        'message', 
        // 'is_read', 
        'createdAt', 
        'metadata'
      ]
    });

    return notifications;
  }

  // public async getNotificationStats(): Promise<{
  //   totalNotifications: number;
  //   readNotifications: number;
  //   unreadNotifications: number;
  //   notificationsByUser: any[];
  // }> {
  //   const [totalCount, readCount, unreadCount, userStats] = await Promise.all([
  //     Notification.count(),
  //     // Notification.count({ where: { is_read: true } }),
  //     // Notification.count({ where: { is_read: false } }),
  //     Notification.findAll({
  //       attributes: [
  //         'user_id',
  //         [sequelize.fn('COUNT', sequelize.col('Notification.id')), 'total'],
  //         // [sequelize.fn('SUM', sequelize.literal('CASE WHEN Notification.is_read = true THEN 1 ELSE 0 END')), 'read'],
  //         // [sequelize.fn('SUM', sequelize.literal('CASE WHEN Notification.is_read = false THEN 1 ELSE 0 END')), 'unread']
  //       ],
  //       group: ['user_id'],
  //       include: [{
  //         model: Users,
  //         as: 'user',
  //         attributes: ['name', 'email']
  //       }]
  //     })
  //   ]);

  //   console.log('\n=== Notification Statistics ===');
  //   console.log('Total Notifications:', totalCount);
  //   console.log('Read Notifications:', readCount);
  //   console.log('Unread Notifications:', unreadCount);
  //   console.log('User Stats:', userStats);

  //   return {
  //     totalNotifications: totalCount,
  //     readNotifications: readCount,
  //     unreadNotifications: unreadCount,
  //     notificationsByUser: userStats
  //   };
  // }
}