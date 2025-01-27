import { Service } from 'typedi';
import ProductVariant from '@models/productVariant.Model';
import Product from '@/models/Product.Model';
import { HttpException } from '@/exceptions/httpException';
import { Op } from 'sequelize';
import Category from '@/models/categoryModel';
import SubCategory from '@/models/subCategoryModel';

@Service()
export class ProductVariantService {
  public async createProductVariant(variantData: Partial<ProductVariant>): Promise<ProductVariant> {
    const existingVariant = await ProductVariant.findOne({
      where: {
        Product_id: variantData.Product_id,
        variantName: variantData.variantName,
      },
    });

    if (existingVariant) {
      throw new HttpException(400, `Variant with name "${variantData.variantName}" already exists for this product.`);
    }

    const productVariant = await ProductVariant.create(variantData);
    return productVariant;
  }

  public async getAllProductVariants(page: number = 1, limit: number = 10, search: string = ''): Promise<{ data: ProductVariant[]; total: number; totalPages: number; currentPage: number }> {
    const offset = (page - 1) * limit;

    const whereCondition = search ? { variantName: { [Op.like]: `%${search}%` } } : {};

    const { rows: variants, count: total } = await ProductVariant.findAndCountAll({
      where: whereCondition,
      limit,
      offset,
    });

    const totalPages = Math.ceil(total / limit);

    return { data: variants, total, totalPages, currentPage: page };
  }

  public async getProductVariantById(variantId: number): Promise<ProductVariant> {
    const productVariant = await ProductVariant.findByPk(variantId, {
      include: [{ model: Product, as: 'productId' }],
    });

    if (!productVariant) {
      throw new HttpException(404, `Product Variant with ID "${variantId}" not found.`);
    }

    return productVariant;
  }

  public async updateProductVariant(variantId: number, updateData: Partial<ProductVariant>): Promise<ProductVariant> {
    const productVariant = await ProductVariant.findByPk(variantId);

    if (!productVariant) {
      throw new HttpException(404, `Product Variant with ID "${variantId}" not found.`);
    }

    await productVariant.update(updateData);

    return productVariant;
  }

  public async deleteProductVariant(variantId: number): Promise<void> {
    const productVariant = await ProductVariant.findByPk(variantId);

    if (!productVariant) {
      throw new HttpException(404, `Product Variant with ID "${variantId}" not found.`);
    }

    await productVariant.destroy();
  }
}
