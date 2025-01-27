import { Request, Response, NextFunction } from 'express';
import { CartService } from '@services/cart.service';
import { Container } from 'typedi';

export class CartController {
  public cartService = Container.get(CartService);

public addToCart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user.id;
    const products = Array.isArray(req.body.products)
      ? req.body.products
      : [{ productId: req.body.productId, variantId: req.body.variantId, quantity: req.body.quantity }];
      
    const cart = await this.cartService.addToCart(userId, products);

    return res.status(200).json({
      status: true,
      message: 'Product added to cart successfully',
      data: cart,
    });
  } catch (error) {
    next(error);
  }
};


  public getCart = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user.id;
      const cart = await this.cartService.getCart(userId);

      return res.status(200).json({
        status: true,
        message: 'Cart fetched successfully',
        data: cart,
      });
    } catch (error) {
      next(error);
    }
  };

  public updateCartItemQuantity = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { cartItemId, newQuantity } = req.body;
      const updatedCartItem = await this.cartService.updateCartItemQuantity(cartItemId, newQuantity);

      return res.status(200).json({
        status: true,
        message: 'Cart item quantity updated successfully',
        data: updatedCartItem,
      });
    } catch (error) {
      next(error);
    }
  };

  public removeCartItem = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { cartItemId } = req.params;
      const response = await this.cartService.removeCartItem(Number(cartItemId));

      return res.status(200).json({
        status: true,
        message: response.message,
      });
    } catch (error) {
      next(error);
    }
  };

  public emptyCart = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user.id;
      const response = await this.cartService.emptyCart(userId);

      return res.status(200).json({
        status: true,
        message: response.message,
      });
    } catch (error) {
      next(error);
    }
  };
}

export const cartController = new CartController();
