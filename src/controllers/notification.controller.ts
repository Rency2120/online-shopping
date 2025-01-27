import { NextFunction, Request, Response } from 'express';
import { NotificationService } from '../services/Notification.service';
import Container, { Service } from 'typedi';

@Service()
export class NotificationController {
  constructor(
    private readonly notificationService: NotificationService = Container.get(NotificationService)
  ) {}

  public getAdminNotifications = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const notifications = await this.notificationService.getNotificationsForAdmin();
      return res.status(200).json({
        success: true,
        data: notifications
      });
    } catch (error) {
      next(error);
    }
  }

//   public getNotificationStats = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const stats = await this.notificationService.getNotificationStats();
//       return res.status(200).json({
//         success: true,
//         data: stats
//       });
//     } catch (error) {
//       next(error);
//     }
//   }
} 