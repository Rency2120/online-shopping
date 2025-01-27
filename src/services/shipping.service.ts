import ShippingCost from '@/models/shipping.Model';
import { HttpException } from '@/exceptions/httpException'; 
import { ShippingAttributes } from '@/models/shipping.Model';
import {Service} from 'typedi';

@Service()
export class ShippingCostService {
  
  public async createShippingCost(data: ShippingAttributes): Promise<ShippingCost> {
    try {
      const checkName=await ShippingCost.findOne({where:{name:data.name}})
      if(checkName){
        throw new HttpException(400,'Shipping cost name already exists');
      }
      const shippingCost = await ShippingCost.create(data);
      return shippingCost;
    } catch (error) {
      console.error('Error details:', error);
      throw new HttpException(500, 'Error creating shipping cost');
    }
  }

  public async getAllShippingCosts(): Promise<ShippingCost[]> {
    try {
      return await ShippingCost.findAll();
    } catch (error) {
      throw new HttpException(500, 'Error fetching shipping costs');
    }
  }

  public async getShippingCostById(id: number): Promise<ShippingCost | null> {
    try {
      return await ShippingCost.findByPk(id);
    } catch (error) {
      throw new HttpException(404, 'Shipping cost not found');
    }
  }

  public async updateShippingCost(id: number, data: ShippingAttributes): Promise<ShippingCost> {
    try {
      const shippingCost = await ShippingCost.findByPk(id);
      if (!shippingCost) {
        throw new HttpException(404, 'Shipping cost not found');
      }
      return await shippingCost.update(data);
    } catch (error) {
      throw new HttpException(500, 'Error updating shipping cost');
    }
  }

  public async deleteShippingCost(id: number): Promise<void> {
    try {
      const shippingCost = await ShippingCost.findByPk(id);
      if (!shippingCost) {
        throw new HttpException(404, 'Shipping cost not found');
      }
      await shippingCost.destroy();
    } catch (error) {
      throw new HttpException(500, 'Error deleting shipping cost');
    }
  }
}

export default new ShippingCostService();
