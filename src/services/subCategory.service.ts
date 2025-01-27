import { HttpException } from '@/exceptions/httpException';
import Category from '@/models/categoryModel';
import { subCategoryAttributes } from '@/models/subCategoryModel';
import SubCategory from '@/models/subCategoryModel';
import { Op } from 'sequelize';
import { Service } from 'typedi';
import DiscountCategory from '@/models/discountCategory.model';
import Discount from '@/models/discount.model';
import DiscountSubCategory from '@/models/discountSubCategory.model';

@Service()
export class SubCategoryService {
  public async createSubCategory(data: subCategoryAttributes): Promise<SubCategory> {
    const existingSubCategory = await SubCategory.findOne({ where: { name: data.name } });

    if (existingSubCategory) {
      throw new HttpException(401, 'Sub-Category already exists');
    }
    const newsubCategory = await SubCategory.create(data);
    return newsubCategory;
  }

  public async getSubCategoryById(id: number): Promise<{category:string;categotyDiscount:Discount | null;subCategories:{
    id:number,
    name:string,
    category_id:number,
    discount:Discount | null
  }[];category_id:number}> {


const subCategory=await SubCategory.findByPk(id,{
  include:[{
    model:DiscountSubCategory,
    as:'discountSubCategories',
    include:[{
      model:Discount,
      as:'discount',
      attributes:['id','discount_type','value','unit']
    }]
  }]
})

if (!subCategory) {
  throw new HttpException(404, 'Sub-Category not found');
}
  const category=await Category.findByPk(subCategory.category_id,{
    include:[{
      model:DiscountCategory,
      as:'discountCategories',
      include:[{
        model:Discount,
        as:'discount',
        attributes:['id','discount_type','value','unit']
      }]
    }]
  })


    // const subCategory = await SubCategory.findByPk(id);
  
    // const category=await Category.findOne({where:{id:subCategory?.category_id}})

    console.log("category",category)




   
    return {
      category: category?.name || '',
      category_id:category?.id,
      categotyDiscount: category?.discountCategories?.[0]?.discount || null,
      subCategories: [
        {
          id: subCategory.id,
          name: subCategory.name,
          category_id: subCategory.category_id,
          discount: subCategory.discountSubCategories?.[0]?.discount || null
        }
      ]
    };
    }

  public async getAllSubCategories(
    page: number = 1,
    limit: number = 5,
    search: string = ''
  ): Promise<{
    data: {
      category: string;
      categoryDiscount: Discount | null;
      subcategories: {
        id: number;
        name: string;
        category_id: number;
        discount: Discount | null;
      }[];
    }[];
    total: number;
    totalPages: number;
  }> {
    const whereCondition = search ? { name: { [Op.like]: `%${search}%` } } : {};

    const { rows: categories, count: total } = await Category.findAndCountAll({
      attributes: ['id', 'name'],
      include: [
        {
          model: SubCategory,
          as: 'subcategories',
          where: whereCondition,
          required: search ? true : false,
          attributes: ['id', 'name', 'category_id'],
          include: [{
            model: DiscountSubCategory,
            as: 'discountSubCategories',
            include: [{
              model: Discount,
              as: 'discount',
              attributes: ['id', 'value', 'discount_type','unit']
            }]
          }]
        },
        {
          model: DiscountCategory,
          as: 'discountCategories',
          include: [{
            model: Discount,
            as: 'discount',
            attributes: ['id', 'value', 'discount_type','unit']
          }]
        }
      ]
    });

    const totalPages = Math.ceil(total / limit);

    const data = categories
      .map((category) => ({
        category: category.name,
        categoryDiscount: category.discountCategories?.[0]?.discount || null,
        subcategories: category.subcategories.map(sub => ({
          id: sub.id,
          name: sub.name,
          category_id: sub.category_id,
          discount: sub.discountSubCategories?.[0]?.discount || null
        }))
      }))
      .filter(item => item.subcategories && item.subcategories.length > 0);

    return { data, total, totalPages };
  }

  public async updateSubCategory(id: number, categoryData: subCategoryAttributes): Promise<SubCategory> {
    const existingCategory = await SubCategory.findByPk(id);
    if (!existingCategory) {
      throw new HttpException(404, 'Sub-Category not found');
    }

    await existingCategory.update(categoryData);
    return existingCategory;
  }

  public async deleteSubCategory(categoryId: number): Promise<void> {
    const category = await SubCategory.findByPk(categoryId);
    if (!category) {
      throw new HttpException(404, 'Sub-Category not found');
    }
    await category.destroy();
  }
}
