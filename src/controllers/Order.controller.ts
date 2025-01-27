import { Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';
import { OrderService } from '@/services/Order.service';
import { HttpException } from '@/exceptions/httpException';

export class OrderController {
  public orderService = Container.get(OrderService);

  public createOrderFromCart = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
    try {
      const { userId, cartId,shippingAddress,shippingCost } = req.body;
      const order = await this.orderService.createOrderFromCart(userId, cartId,shippingAddress);
      return res.status(201).json(order);
    } catch (error) {
      next(error);
    }
  };

  public getOrderById = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
    try {
      const orderId = parseInt(req.params.orderId, 10);
      const order = await this.orderService.getOrderById(orderId);
      if (!order) {
        throw new HttpException(404, 'Order not found');
      }
      return res.status(200).json(order);
    } catch (error) {
      next(error);
    }
  };

  public getOrdersByUser = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
    try {
      const userId = parseInt(req.params.userId, 10);
      const orders = await this.orderService.getOrdersByUser(userId);
      return res.status(200).json(orders);
    } catch (error) {
      next(error);
    }
  };

  public updateOrderStatus = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
    try {
      const orderId = parseInt(req.params.orderId, 10);
      const { status } = req.body;
      const order = await this.orderService.updateOrderStatus(orderId, status);
      return res.status(200).json(order);
    } catch (error) {
      next(error);
    }
  };

  public deleteOrderById = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
    try {
      const orderId = parseInt(req.params.orderId, 10);
      await this.orderService.deleteOrderById(orderId);
      return res.status(204).json();
    } catch (error) {
      next(error);
    }
  };

  public calculateOrderTotal = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
    try {
      const { cartId } = req.body;
      const total = await this.orderService.calculateOrderTotal(cartId);
      return res.status(200).json({ total });
    } catch (error) {
      next(error);
    }
  };
}

export default OrderController;
