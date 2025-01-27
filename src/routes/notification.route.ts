import { Routes } from "@interfaces/routes.interface";
import { Router } from "express";
import { NotificationController } from "@/controllers/notification.controller";
import { isAdmin } from "@/middlewares/auth.middleware";


export class NotificationRoute implements Routes {
  public path = '/notification';
  public router = Router();
  public notificationController = new NotificationController();
s
  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/admin/notifications`,isAdmin, this.notificationController.getAdminNotifications);
    // this.router.get(`${this.path}/admin/notifications/stats`, this.notificationController.getNotificationStats);
  }
}
