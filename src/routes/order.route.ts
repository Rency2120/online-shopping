import { Router } from 'express';
import { Routes } from '@/interfaces/routes.interface';
import { OrderController } from '@/controllers/Order.controller';

export class OrderRoute implements Routes {
  public path = '/order';
  public router = Router();
  public orderController = new OrderController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}`, this.orderController.createOrderFromCart);
    this.router.get(`${this.path}/users/:userId`, this.orderController.getOrdersByUser);
    this.router.get(`${this.path}/:orderId`, this.orderController.getOrderById);
    this.router.put(`${this.path}/:orderId/status`, this.orderController.updateOrderStatus);
    this.router.delete(`${this.path}/:orderId`, this.orderController.deleteOrderById);
  }
}
