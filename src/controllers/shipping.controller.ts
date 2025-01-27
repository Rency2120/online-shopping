import { Request, Response } from 'express';
import { ShippingCostService } from '@/services/shipping.service';
import { Container } from 'typedi';

export class ShippingCostController {
  public shippingService = Container.get(ShippingCostService);

  public  createShippingCost=async(req: Request, res: Response): Promise<void>=> {
    const data = req.body;
    try {
      const shippingCost = await this.shippingService.createShippingCost(data);
      res.status(201).json(shippingCost);
    } catch (error) {
      res.status(error.statusCode || 500).json({ message: error.message });
    }
  }

  public  getAllShippingCosts=async(req: Request, res: Response): Promise<void>=> {
    try {
      const shippingCosts = await this.shippingService.getAllShippingCosts();
      res.status(200).json(shippingCosts);
    } catch (error) {
      res.status(error.statusCode || 500).json({ message: error.message });
    }
  }

  public  getShippingCostById=async(req: Request, res: Response): Promise<void>=> {
    const { id } = req.params;
    try {
      const shippingCost = await this.shippingService.getShippingCostById(Number(id));
      if (!shippingCost) {
        res.status(404).json({ message: 'Shipping cost not found' });
        return;
      }
      res.status(200).json(shippingCost);
    } catch (error) {
      res.status(error.statusCode || 500).json({ message: error.message });
    }
  }

  public  updateShippingCost=async(req: Request, res: Response): Promise<void>=> {
    const { id } = req.params;
    const data = req.body;
    try {
      const updatedShippingCost = await this.shippingService.updateShippingCost(Number(id), data);
      res.status(200).json(updatedShippingCost);
    } catch (error) {
      res.status(error.statusCode || 500).json({ message: error.message });
    }
  }

  public  deleteShippingCost=async(req: Request, res: Response): Promise<void>=> {
    const { id } = req.params;
    try {
      await this.shippingService.deleteShippingCost(Number(id));
      res.status(204).send();
    } catch (error) {
      res.status(error.statusCode || 500).json({ message: error.message });
    }
  }
}

