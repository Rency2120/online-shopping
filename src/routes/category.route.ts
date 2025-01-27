import { Router } from "express";
import { CategoryController } from "@/controllers/category.controller";
import { Routes } from "@/interfaces/routes.interface";
import { CreateCategoryDto, UpdateCategoryDto } from "@/dtos/category.dto";
import { ValidationMiddleware } from "@/middlewares/validation.middleware";
import { isAdmin } from "@/middlewares/auth.middleware";

export class CategoryRoute implements Routes {
  public path = '/category';
  public router = Router();
  public categoryController = new CategoryController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/add`, ValidationMiddleware(CreateCategoryDto), isAdmin, this.categoryController.createCategory);
    this.router.get(`${this.path}`, this.categoryController.getAllCategories);
    this.router.get(`${this.path}/:id`, this.categoryController.getCategoryById);
    this.router.put(`${this.path}/:id`, ValidationMiddleware(UpdateCategoryDto),isAdmin, this.categoryController.updateCategory);
    this.router.delete(`${this.path}/:id`, isAdmin, this.categoryController.deleteCategory);
  }
}
