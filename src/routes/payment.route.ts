import { Router } from 'express';
import { Routes } from '@/interfaces/routes.interface';
import { PaymentController } from '@/controllers/payment.controller';

export class PaymentRoute implements Routes {
  public path = '/payment';
  public router = Router();
  public paymentController = new PaymentController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/create`, this.paymentController.createPayment);
    this.router.post(`${this.path}/confirm`, this.paymentController.confirmPayment);
  }
}