import { Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';
import { CategoryService } from '@/services/category.service';

export class CategoryController {
  public categoryService = Container.get(CategoryService);

  public createCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const categoryData = req.body;
      const newCategoryData = await this.categoryService.createCategory(categoryData);

      return res.status(201).json({
        status: true,
        message: 'Category created successfully',
        data: newCategoryData,
      });
    } catch (error) {
      next(error);
    }
  };

  public getCategoryById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const categoryId = parseInt(req.params.id, 10);
      const category = await this.categoryService.getCategoryById(categoryId);

      return res.status(200).json({
        status: true,
        message: 'Category fetched successfully',
        data: category,
      });
    } catch (error) {
      next(error);
    }
  };

  public getAllCategories = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 5;
      const search = (req.query.search as string) || '';

      const categories = await this.categoryService.getAllCategories(page,
        limit,
        search
      );
      res.status(200).json({ data: categories });
    } catch (error) {
      next(error);
    }
  };

  public updateCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const categoryId = parseInt(req.params.id, 10);
      const categoryData = req.body;

      const updatedCategory = await this.categoryService.updateCategory(categoryId, categoryData);

      return res.status(200).json({
        status: true,
        message: 'Category updated successfully',
        data: updatedCategory,
      });
    } catch (error) {
      next(error);
    }
  };

  public deleteCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const categoryId = parseInt(req.params.id, 10);

      await this.categoryService.deleteCategory(categoryId);

      return res.status(200).json({
        status: true,
        message: 'Category deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  };
}
