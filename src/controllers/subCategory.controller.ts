import { Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';
import { SubCategoryService } from '@/services/subCategory.service';
import { CategoryService } from '@/services/category.service';
import { HttpException } from '@/exceptions/httpException';

export class SubCategoryController {
  public subCategoryService = Container.get(SubCategoryService);
  private categoryService = Container.get(CategoryService);

  public createSubCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;

      if (data.category_id) {
        const category = await this.categoryService.getCategoryById(data.category_id);

        if (!category) {
          throw new HttpException(404, `Industry not found with id: ${data.category_id}`);
        }
      }

      const newSubData = await this.subCategoryService.createSubCategory(data);

      return res.status(200).json({ status: true, message: 'Sub-category added successfully', data: newSubData });
    } catch (error) {
      next(error);
    }
  };

  public getSubCategoryById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const subCategory = await this.subCategoryService.getSubCategoryById(id);

      res.status(200).json({ status: true, message: 'Sub-category fetched successfully', data: subCategory });
    } catch (error) {
      next(error);
    }
  };

  public getAllSubCategories = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 5;
      const search = (req.query.search as string) || '';

      const subCategories = await this.subCategoryService.getAllSubCategories(page, limit,search);

      res.status(200).json({ status: true, message: 'Sub-categories fetched successfully', data:subCategories });
    } catch (error) {
      next(error);
    }
  };

  public updateSubCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const data = req.body;

      const updatedSubCategory = await this.subCategoryService.updateSubCategory(id, data);

      res.status(200).json({ status: true, message: 'Sub-category updated successfully', data: updatedSubCategory });
    } catch (error) {
      next(error);
    }
  };

  public deleteSubCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = parseInt(req.params.id);

      await this.subCategoryService.deleteSubCategory(id);

      res.status(200).json({ status: true, message: 'Sub-category deleted successfully' });
    } catch (error) {
      next(error);
    }
  };
}
