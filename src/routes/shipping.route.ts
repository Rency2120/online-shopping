import { Router } from 'express';
import { Routes } from '@/interfaces/routes.interface';
import { ShippingCostController } from '@/controllers/shipping.controller';

export class ShippingRoute implements Routes {
  public path = '/shipping';
  public router = Router();
  public shippingController = new ShippingCostController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}`, this.shippingController.createShippingCost);
    this.router.get(`${this.path}`, this.shippingController.getAllShippingCosts);
    this.router.get(`${this.path}/:id`, this.shippingController.getShippingCostById);
    this.router.put(`${this.path}/:id`, this.shippingController.updateShippingCost);
    this.router.delete(`${this.path}/:id`, this.shippingController.deleteShippingCost);
  }
}