import { Request, Response, NextFunction } from 'express';
import { WishlistService } from '@/services/wishlist.service';
import { Container } from 'typedi';

export class WishlistController {
  public wishlistService = Container.get(WishlistService);
  
  public addProductToWishlist = async (req: Request, res: Response, next: NextFunction) => {
    const { userId, productId } = req.body;

    try {
      const wishlistItem = await this.wishlistService.addProductToWishlist(userId, productId);
      res.status(201).json(wishlistItem);
    } catch (error) {
      next(error);
    }
  };

  public removeProductFromWishlist = async (req: Request, res: Response, next: NextFunction) => {
    const { userId, productId } = req.params;

    try {
      const message = await this.wishlistService.removeProductFromWishlist(Number(userId), Number(productId));
      res.status(200).json(message);
    } catch (error) {
      next(error);
    }
  };

  public getWishlist = async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;

    try {
      const wishlist = await this.wishlistService.getWishlist(Number(userId));
      res.status(200).json(wishlist);
    } catch (error) {
      next(error);
    }
  };
}
