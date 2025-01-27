import DiscountController from "@/controllers/discount.controller";
import { Routes } from "@/interfaces/routes.interface";
import { AuthMiddleware, isAdmin } from "@/middlewares/auth.middleware";
import { Router } from "express";

export class DiscountRouter implements Routes {
    public path = '/discounts';
    public router = Router();
    public discount = new DiscountController()
    constructor() {
        this.intializeRoutes()
    }
    private intializeRoutes() {
        this.router.post(`${this.path}/add`, this.discount.createDiscount)
        this.router.get(`${this.path}/getDiscounts`, this.discount.getAllDiscounts)
        this.router.get(`${this.path}/getDiscounts/:id`, this.discount.getDiscountById)
        this.router.put(`${this.path}/update/:id`, this.discount.updateDiscount)
        this.router.delete(`${this.path}/delete/:id`, this.discount.deleteDiscount)

    }
}
