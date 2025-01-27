import { Request, Response, NextFunction } from 'express';
import { Service } from 'typedi';
import { PaymentService } from '@/services/payment.service';
import { Container } from 'typedi';

@Service()
export class PaymentController {
  public paymentService = Container.get(PaymentService);

  public createPayment = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { orderId, paymentMethod, paymentMethodId } = req.body;

      if (!orderId || !paymentMethod || !paymentMethodId ) {
        throw new Error('Order ID and payment method and paymentMethodId are required');
      }

      const payment = await this.paymentService.createPayment(orderId, paymentMethod, paymentMethodId);
      res.status(201).json({ success: true, payment });
    } catch (error) {
      next(error);
    }
  };

  public confirmPayment = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { paymentId, transactionId, paymentMethodId } = req.body;

      if (!paymentId || !transactionId || !paymentMethodId) {
        throw new Error('Payment ID and Payment transactionId and paymentMethodId  are required');
      }

      const payment = await this.paymentService.confirmPayment(paymentId, transactionId, paymentMethodId);
      res.status(200).json({ success: true, payment });
    } catch (error) {
      next(error);
    }
  };
}
