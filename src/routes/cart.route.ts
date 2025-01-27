import { Router } from 'express';
import { CartController } from '@/controllers/cart.controller';
import { Routes } from '@interfaces/routes.interface';
import { AuthMiddleware } from '@/middlewares/auth.middleware';

export class CartRoute implements Routes {
  public path = '/cart';
  public router = Router();
  public cartController = new CartController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/add`, AuthMiddleware,this.cartController.addToCart); // Add item to cart
    this.router.get(`${this.path}`, AuthMiddleware,this.cartController.getCart); // Get user's cart
    this.router.put(`${this.path}/update`,AuthMiddleware, this.cartController.updateCartItemQuantity); // Update cart item quantity
    this.router.delete(`${this.path}/remove/:cartItemId`,AuthMiddleware, this.cartController.removeCartItem); // Remove item from cart
    this.router.delete(`${this.path}/empty`,AuthMiddleware, this.cartController.emptyCart); // Empty the cart
  }
}
