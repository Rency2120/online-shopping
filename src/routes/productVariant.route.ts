import { Router } from 'express';
import { ProductVariantController } from '@/controllers/productVariant.controller';
import { Routes } from '@/interfaces/routes.interface';
import { isAdmin } from '@/middlewares/auth.middleware';

export class ProductVariantRoute implements Routes {
  public path = '/productVariant';
  public router = Router();
  public productVariantController = new ProductVariantController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/add`, isAdmin,this.productVariantController.createProductVariant);
    this.router.get(`${this.path}`, this.productVariantController.getAllProductVariants);
    this.router.get(`${this.path}/:id`, this.productVariantController.getProductVariantById);
    this.router.put(`${this.path}/:id`, isAdmin, this.productVariantController.updateProductVariant);
    this.router.delete(`${this.path}/:id`, isAdmin, this.productVariantController.deleteProductVariant);
  }
}
