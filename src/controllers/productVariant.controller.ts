import { Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';
import { ProductVariantService } from '@/services/productVariant.service';

export class ProductVariantController {
  public productVariantService = Container.get(ProductVariantService);

  public createProductVariant = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const productVariantData = req.body;
      const newProductVariant = await this.productVariantService.createProductVariant(productVariantData);

      res.status(201).json({
        status: true,
        message: 'Product Variant created successfully',
        data: newProductVariant,
      });
    } catch (error) {
      next(error);
    }
  };

  public getAllProductVariants = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = (req.query.search as string) || '';

      const productVariants = await this.productVariantService.getAllProductVariants(page, limit, search);

      res.status(200).json({
        status: true,
        message: 'Product Variants fetched successfully',
        data: productVariants.data,
        total: productVariants.total,
        totalPages: productVariants.totalPages,
        currentPage: productVariants.currentPage,
      });
    } catch (error) {
      next(error);
    }
  };


  public getProductVariantById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const productVariant = await this.productVariantService.getProductVariantById(parseInt(id));

      res.status(200).json({
        status: true,
        message: 'Product Variant fetched successfully',
        data: productVariant,
      });
    } catch (error) {
      next(error);
    }
  };


  public updateProductVariant = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const productVariantData = req.body;

      const updatedProductVariant = await this.productVariantService.updateProductVariant(parseInt(id), productVariantData);

      res.status(200).json({
        status: true,
        message: 'Product Variant updated successfully',
        data: updatedProductVariant,
      });
    } catch (error) {
      next(error);
    }
  };

  public deleteProductVariant = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;

      await this.productVariantService.deleteProductVariant(parseInt(id));

      res.status(200).json({
        status: true,
        message: 'Product Variant deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  };
}