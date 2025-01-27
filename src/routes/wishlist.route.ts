import { Router } from 'express';
import { Routes } from '@/interfaces/routes.interface';
import { WishlistController } from '@/controllers/wishlist.controller';

export class WishlistRoute implements Routes {
    public path = '/wishlist';
    public router = Router();
    public wishlistController = new WishlistController();
  
    constructor() {
      this.initializeRoutes();
    }
  
    private initializeRoutes() {
      this.router.post(`${this.path}/add`,this.wishlistController.addProductToWishlist);
      this.router.get(`${this.path}`, this.wishlistController.getWishlist);
      this.router.delete(`${this.path}/:id`, this.wishlistController.removeProductFromWishlist);
    }
  }
  