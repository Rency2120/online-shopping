export interface IPayment {
    id: number;
    order_id: number;
    payment_status: 'Successful' | 'Failed' | 'Pending';
    payment_method: 'Card' | 'Stripe';
    transaction_id: string;
    createdAt: Date;
    updatedAt: Date;
  }
  