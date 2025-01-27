// discount.controller.ts
import { NextFunction, Request, Response } from 'express';
import DiscountService from '../services/discount.service';
import { DiscountCreation, CreateDiscountDTO } from '../interfaces/discount.interface';
import Container from 'typedi';

class DiscountController {
    public discountService = Container.get(DiscountService)
    public createDiscount = async (req: Request, res: Response) => {
        try {
            const discountData = req.body;
            const discount = await this.discountService.createDiscount(discountData);
            res.status(201).json({
                message: 'Discount created successfully',
                discount,
            });
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }


    public getAllDiscounts = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const discounts = await this.discountService.getAllDiscounts();
            return res.status(200).json(discounts);
        } catch (error) {
            next(error)
        }
    }

    public getDiscountById = async (req: Request, res: Response, next: NextFunction) => {
        const discountId = parseInt(req.params.id);
        console.log("discountId", discountId)
        try {
            const discount = await this.discountService.getDiscountById(discountId);
            if (!discount) {
                return res.status(404).json({ message: 'Discount not found' });
            }
            return res.status(200).json(discount);
        } catch (error) {
            next(error)
        }
    }

    public updateDiscount = async (req: Request, res: Response, next: NextFunction) => {
        const discountId = parseInt(req.params.id);
        const discountData: CreateDiscountDTO = req.body;
        try {
            const updatedDiscount = await this.discountService.updateDiscount(discountId, discountData);
            return res.status(200).json(updatedDiscount);
        } catch (error) {
            next(error)
        }
    }

    public deactivateDiscount = async (req: Request, res: Response) => {
        const discountId = parseInt(req.params.id);
        try {
            const success = await this.discountService.deactivateDiscount(discountId);
            if (success) {
                return res.status(200).json({ message: 'Discount deactivated successfully' });
            }
            return res.status(404).json({ message: 'Discount not found' });
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }
    public deleteDiscount = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const discountId = req.params.id;
            const deletedDiscount = await this.discountService.deleteDiscount(discountId);
            res.status(200).json({ data: deletedDiscount, message: 'Discount Deleted' });
        } catch (error) {
            next(error);
        }
    };
}


export default DiscountController;

