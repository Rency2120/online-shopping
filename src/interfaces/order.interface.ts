export interface IOrder {
    id: number;
    user_id: number;
    cartId:number;
    total_price: number;
    status: 'Pending' | 'Order Confirmed' | 'Dispatched' | 'Shipped' | 'Delivered' | 'Cancelled';
    shipping_address: Record<string, any>; 
    discount_id: number;
    shipping_cost: number;
    tracking_number: string;
    createdAt: Date;
    updatedAt: Date;
}
