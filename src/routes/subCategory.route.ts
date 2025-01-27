import { Router } from 'express';
import { SubCategoryController } from '@/controllers/subCategory.controller';
import { Routes } from '@/interfaces/routes.interface';
import { isAdmin } from '@/middlewares/auth.middleware';

export class SubCategoryRoute implements Routes {
  public path = '/sub-category';
  public router = Router();
  public subCategoryController = new SubCategoryController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/add`, isAdmin, this.subCategoryController.createSubCategory);
    this.router.get(`${this.path}`, this.subCategoryController.getAllSubCategories);
    this.router.get(`${this.path}/:id`, this.subCategoryController.getSubCategoryById);
    this.router.put(`${this.path}/:id`, isAdmin, this.subCategoryController.updateSubCategory);
    this.router.delete(`${this.path}/:id`, isAdmin, this.subCategoryController.deleteSubCategory);
  }
}
