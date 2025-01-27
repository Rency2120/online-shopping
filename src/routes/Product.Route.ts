import { Router } from 'express';
import { ProductController } from '@/controllers/product.controller';
import { Routes } from '@/interfaces/routes.interface';
import { isAdmin } from '@/middlewares/auth.middleware';

export class ProductRouter implements Routes {
  public path = '/product';
  public router = Router();
  public productController = new ProductController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/add`, isAdmin, this.productController.createProduct);
    this.router.get(`${this.path}`, this.productController.getAllProducts);
    this.router.get(`${this.path}/id/:id`, this.productController.getProductById);
    this.router.put(`${this.path}/:id`, isAdmin, this.productController.updateProduct);
    this.router.delete(`${this.path}/:id`, isAdmin, this.productController.deleteProduct);
  }
}
