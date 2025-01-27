import { Service } from 'typedi';
import Stripe from 'stripe';
import Order from '@/models/order.Model';
import Payment from '@/models/payment.model';
import { HttpException } from '@/exceptions/httpException';
import { STRIPE_SECRET_KEY } from '@/config';

@Service()
export class PaymentService {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(STRIPE_SECRET_KEY as string);
  }

  public async createPayment(orderId: number, paymentMethod: 'Card' | 'Stripe', paymentMethodId: string): Promise<Payment> {
    const order = await Order.findByPk(orderId);

    if (!order) {
      throw new HttpException(404, 'Order not found');
    }

    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: Math.round(order.total_price * 100),
      currency: 'usd',
      // payment_method_types: ['card'],
      payment_method: paymentMethodId,
      automatic_payment_methods: {
        enabled: true, // Enable automatic payment methods
        allow_redirects: 'never', // Disable redirects
      },
    });

    const payment = await Payment.create({
      order_id: orderId,
      payment_status: paymentIntent.status === 'succeeded' ? 'Successful' : 'Pending',
      payment_method: paymentMethod,
      transaction_id: paymentIntent.id,
    });
    console.log("createPayment", payment);
    return payment;
  }

  public async confirmPayment(paymentId: number, transactionId: string, paymentMethodId: string): Promise<Payment> {
    const payment = await Payment.findByPk(paymentId);

    if (!payment) {
      throw new HttpException(404, 'Payment not found');
    }

    // Confirm the payment intent
    const paymentIntent = await this.stripe.paymentIntents.confirm(transactionId, {
      payment_method: paymentMethodId,
    });

    // Update the payment status based on the confirmation result
    if (paymentIntent.status === 'succeeded') {
      payment.payment_status = 'Successful';
    } else {
      payment.payment_status = 'Failed';
    }
    console.log("confirmPayment", payment);
    await payment.save();

    return payment;
  }
}
