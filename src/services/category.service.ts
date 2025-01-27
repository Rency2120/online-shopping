import { HttpException } from '@/exceptions/httpException';
import { CategoryAttributes } from '@/models/categoryModel';
import Category from '@/models/categoryModel';
import DiscountCategory from '@/models/discountCategory.model';
import Discount from '@/models/discount.model';
import { Op } from 'sequelize';
import { Service } from 'typedi';
import { CacheService } from './cache.service';

@Service()
export class CategoryService {
  private cacheService: CacheService;

  constructor() {
    this.cacheService = new CacheService();
  }

  public async createCategory(categoryData: CategoryAttributes): Promise<CategoryAttributes> {
    const existingCategory = await Category.findOne({ where: { name: categoryData.name } });
    if (existingCategory) {
      throw new HttpException(401, 'Category already exists');
    }
    const newCategory = await Category.create({ ...categoryData });

    await this.cacheService.delCache('categories');

    return newCategory;
  }

  public async getCategoryById(categoryId: number): Promise<CategoryAttributes | null> {
    const cacheCategory = await this.cacheService.getCache(`category:${categoryId}`);
    if (cacheCategory) {
      console.log('Data from cache');
      return cacheCategory;
    }
    const category = await Category.findByPk(categoryId, {
      include: [
        {
          model: DiscountCategory,
          as: 'discountCategories',
          include: [
            {
              model: Discount,
              as: 'discount',
              attributes: ['id', 'discount_type', 'value', 'unit'],
            },
          ],
          attributes: ['discount_id'],
        },
      ],
    });

    if (!category) {
      throw new HttpException(404, 'Category not found');
    }

    await this.cacheService.setCache(`category:${categoryId}`, category);
    return category;
  }

  public async getAllCategories(
    page: number = 1,
    limit: number = 5,
    search: string = '',
  ): Promise<{ categories: Category[]; total: number; currentPage: number; totalPages: number }> {
    const cacheKey = `categories:${page}:${limit}:${search}`;
    const cachedCategories = await this.cacheService.getCache(cacheKey);
    if (cachedCategories) {
      console.log('data from cache');
      return cachedCategories;
    }

    const offset = (page - 1) * limit;

    const whereCondition = search ? { name: { [Op.like]: `%${search}%` } } : {};

    const total = await Category.count({ where: whereCondition });

    const categories = await Category.findAll({
      where: whereCondition,
      limit,
      offset,
      include: [
        {
          model: DiscountCategory,
          as: 'discountCategories',
          include: [
            {
              model: Discount,
              as: 'discount',
              attributes: ['id', 'discount_type', 'value', 'unit'],
            },
          ],
          attributes: ['discount_id'],
        },
      ],
    });

    const totalPages = Math.ceil(total / limit);

    const result = {
      categories,
      total,
      currentPage: page,
      totalPages,
    };

    await this.cacheService.setCache(cacheKey, result);

    return result;
  }

  public async updateCategory(categoryId: number, categoryData: CategoryAttributes): Promise<Category> {
    const existingCategory = await Category.findByPk(categoryId);
    if (!existingCategory) {
      throw new HttpException(404, 'Category not found');
    }

    await existingCategory.update(categoryData);

    await this.cacheService.delCache(`category:${categoryId}`);
    return existingCategory;
  }

  public async deleteCategory(categoryId: number): Promise<void> {
    const category = await Category.findByPk(categoryId);
    if (!category) {
      throw new HttpException(404, 'Category not found');
    }
    await this.cacheService.delCache(`category:${categoryId}`);
    await category.destroy();
  }
}
