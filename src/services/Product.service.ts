import { HttpException } from '@/exceptions/httpException';
import Category from '@/models/categoryModel';
import Discount from '@/models/discount.model';
import DiscountCategory from '@/models/discountCategory.model';
import DiscountProduct from '@/models/discountProduct.model';
import DiscountSubCategory from '@/models/discountSubCategory.model';
import { ProductAttributes } from '@/models/Product.Model';
import Product from '@/models/Product.Model';
import ProductVariant from '@/models/productVariant.Model';
import SubCategory from '@/models/subCategoryModel';
import { Op } from 'sequelize';
import { Service } from 'typedi';

@Service()
export class ProductService {
  public async createProduct(productData: ProductAttributes): Promise<Product> {
    const existingProduct = await Product.findOne({ where: { name: productData.name } });

    if (existingProduct) {
      throw new HttpException(400, `Product with name "${productData.name}" already exists`);
    }

    const product = await Product.create(productData);
    return product;
  }

  public async getAllProducts(
    page: number = 1,
    limit: number = 5,
    search: string = '',
  ): Promise<{ productData: any[]; total: number; currentPage: number; totalPages: number }> {
    const offset = (page - 1) * limit;
  
    const whereCondition = search ? { name: { [Op.like]: `%${search}%` } } : {};
  
    const total = await Product.count({ where: whereCondition });
  
    const products = await Product.findAll({
      where: whereCondition,
      limit,
      offset,
      include: [
        { model: Category, as: 'category', attributes: ['id', 'name'] },
        { model: SubCategory, as: 'subcategory', attributes: ['id', 'name'] },
        { model: ProductVariant, as: 'variants' },
        {
          model: DiscountProduct,
          as: 'discountProduct',
          include: [
            { model: Discount, as: 'discount', attributes: ['id', 'name', 'discount_type', 'value','unit'] },
          ],
        },
      ],
    });
  
    const categories = await Category.findAll({
      include: [
        {
          model: DiscountCategory,
          as: 'discountCategories',
          include: [{ model: Discount, as: 'discount', attributes: ['id', 'name', 'discount_type', 'value','unit'] }],
        },
      ],
    });
  
    const subCategories = await SubCategory.findAll({
      include: [
        {
          model: DiscountSubCategory,
          as: 'discountSubCategories',
          include: [{ model: Discount, as: 'discount', attributes: ['id', 'name', 'discount_type', 'value','unit'] }],
        },
      ],
    });
  
    const groupedData: { [categoryName: string]: { [subCategoryName: string]: any[] } } = {};
  
    products.forEach(product => {
      const categoryName = product.category?.name || 'Uncategorized';
      const subCategoryName = product.subcategory?.name || 'Unsubcategorized';
  
      if (!groupedData[categoryName]) {
        groupedData[categoryName] = {};
      }
  
      if (!groupedData[categoryName][subCategoryName]) {
        groupedData[categoryName][subCategoryName] = [];
      }
  
      const productImage = product.variants?.[0].image || null;
  
      const productDetails = {
        id: product.id,
        name: product.name,
        Image: productImage,
        variants: product.variants.map((variant: any) => ({
          variantName: variant.variantName,
          image: variant.image,
          size: variant.size,
          price: variant.price,
          stock_sold: variant.stock_sold,
          stock_left: variant.stock_left,
        })),
      };
  
      if (product.discountProduct?.length > 0) {
        productDetails['discount'] = product.discountProduct.map(dp => dp.discount);
      }
  
      groupedData[categoryName][subCategoryName].push(productDetails);
    });
  
    const productData = Object.keys(groupedData).map(categoryName => {
      const category = categories.find(cat => cat.name === categoryName);
      const categoryData: any = {
        categoryName,
      };
  
      if (category?.discountCategories?.length > 0) {
        categoryData.discount = category.discountCategories.map(dc => dc.discount);
      }
  
      categoryData.subcategories = Object.keys(groupedData[categoryName]).map(subCategoryName => {
        const subCategory = subCategories.find(sub => sub.name === subCategoryName);
        const subCategoryData: any = {
          subCategoryName,
          products: groupedData[categoryName][subCategoryName],
        };
  
        if (subCategory?.discountSubCategories?.length > 0) {
          subCategoryData.discount = subCategory.discountSubCategories.map(dsc => dsc.discount);
        }
  
        return subCategoryData;
      });
  
      return categoryData;
    });
  
    const totalPages = Math.ceil(total / limit);
  
    return {
      productData,
      total,
      currentPage: page,
      totalPages,
    };
  }
  
  public async getProductById(id: number): Promise<any> {
    const product = await Product.findOne({
      where: { id },
      include: [{
        model: Category,
        as: 'category',
        attributes: ['id', 'name']
      }, {
        model: SubCategory,
        as: 'subcategory',
        attributes: ['id', 'name']
      }, {
        model: ProductVariant,
        as: 'variants',
      }, {
        model: DiscountProduct,
        as: 'discountProduct',
        include: [{
          model: Discount,
          as: 'discount',
          attributes: ['id', 'name', 'discount_type', 'value', 'unit']
        }]
      }]
    });
  
    if (!product) {
      throw new HttpException(404, 'Product not found');
    }
  
    const category = await Category.findByPk(product.Category_id, {
      include: [{
        model: DiscountCategory,
        as: 'discountCategories',
        include: [{
          model: Discount,
          as: 'discount',
          attributes: ['id', 'name', 'discount_type', 'value', 'unit']
        }]
      }]
    });
  
    const subCategory = await SubCategory.findByPk(product.SubCategory_id, {
      include: [{
        model: DiscountSubCategory,
        as: 'discountSubCategories',
        include: [{
          model: Discount,
          as: 'discount',
          attributes: ['id', 'name', 'discount_type', 'value', 'unit']
        }]
      }]
    });
  
    const productImage = product.variants?.[0]?.image || null;
    
    const formattedResponse = {
      categoryName: product.category?.name || 'Uncategorized',
      ...(category?.discountCategories?.length > 0 && {
        discount: category.discountCategories.map(dc => dc.discount)
      }),
      subcategories: [{
        subCategoryName: product.subcategory?.name || 'Unsubcategorized',
        products: [{
          id: product.id,
          name: product.name,
          Image: productImage,
          variants: product.variants.map(variant => ({
            variantName: variant.variantName,
            image: variant.image,
            size: variant.size,
            price: variant.price,
            stock_sold: variant.stock_sold,
            stock_left: variant.stock_left,
          })),
          ...(product.discountProduct?.length > 0 && {
            discount: product.discountProduct.map(dp => dp.discount)
          })
        }],
        ...(subCategory?.discountSubCategories?.length > 0 && {
          discount: subCategory.discountSubCategories.map(dsc => dsc.discount)
        })
      }]
    };
  
    return formattedResponse;
  }
  







  public async updateProduct(id: number, updateData: Partial<ProductAttributes>): Promise<Product> {
    const product = await this.getProductById(id);

    if (!product) {
      throw new HttpException(404, 'Product not found');
    }

    await product.update(updateData);
    return product;
  }

  public async deleteProduct(id: number): Promise<string> {
    const product = await this.getProductById(id);

    if (!product) {
      throw new HttpException(404, 'Product not found');
    }

    await product.destroy();
    return 'Product successfully deleted';
  }
}
