import { Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';
import { ProductService } from '@/services/Product.service';
import { CategoryService } from '@/services/category.service';
import { SubCategoryService } from '@/services/subCategory.service';

export class ProductController {
  public productService = Container.get(ProductService);
  private categoryService = Container.get(CategoryService);
  private subCategoryService = Container.get(SubCategoryService);

  public createProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const productData = req.body;
      if (productData.Category_id) {
        const category = await this.categoryService.getCategoryById(productData.Category_id);
      }

      if (productData.SubCategory_id) {
        const subCategory = await this.subCategoryService.getSubCategoryById(productData.SubCategory_id);
      }

      console.log('req.body', req.body);
      const product = await this.productService.createProduct(productData);

      res.status(201).json({
        status: true,
        message: 'Product created successfully',
        data: product,
      });
    } catch (error) {
      next(error);
    }
  };

  public getAllProducts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 5;
      const search = (req.query.search as string) || '';

      const { productData, total, currentPage, totalPages } = await this.productService.getAllProducts(page, limit, search);

      res.status(200).json({
        status: true,
        message: 'Products fetched successfully',
        data: productData,
        total,
        totalPages,
        currentPage,
      });
    } catch (error) {
      next(error);
    }
  };

  public getProductById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const productId = parseInt(req.params.id as string);

      const product = await this.productService.getProductById(productId);

      res.status(200).json({
        status: true,
        message: 'Product fetched successfully',
        data: product,
      });
    } catch (error) {
      next(error);
    }
  };

  public updateProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const productId = parseInt(req.params.id as string);
      const productData = req.body;

      const updatedProduct = await this.productService.updateProduct(productId, productData);

      res.status(200).json({
        status: true,
        message: 'Product updated successfully',
        data: updatedProduct,
      });
    } catch (error) {
      next(error);
    }
  };

  public deleteProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const productId = parseInt(req.params.id as string);

      await this.productService.deleteProduct(productId);

      res.status(200).json({
        status: true,
        message: 'Product deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  };
}
