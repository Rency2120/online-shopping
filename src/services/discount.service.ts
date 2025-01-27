import { Service } from 'typedi';
import { DiscountAttributes, DiscountCreation, CreateDiscountDTO } from '../interfaces/discount.interface';
import Discount from '../models/discount.model';

import DiscountProduct from '@/models/discountProduct.model';
import DiscountCategory from '@/models/discountCategory.model';
import DiscountSubCategory from '@/models/discountSubCategory.model';
import { Http2ServerResponse } from 'http2';
import { HttpException } from '@/exceptions/httpException';
import Category from '@/models/categoryModel';
import Product from '@/models/Product.Model';
import SubCategory from '@/models/subCategoryModel';






@Service()
class DiscountService {


    public async createDiscount(data: CreateDiscountDTO) {
        const { productIds, categoryIds, subCategoryIds, ...discountData } = data;

        console.log("data", data);

        if (discountData.value === undefined || discountData.value === null) {
            throw new HttpException(400, "Value is required");
        }

        if (productIds && productIds.length > 0) {
            const checkProductIds = await Product.findAll({
                where: { id: productIds },
                attributes: ['id'],
            }).then((products) => products.map((product) => product.id));

            const invalidProductIds = productIds.filter((id) => !checkProductIds.includes(id));
            if (invalidProductIds.length > 0) {
                throw new HttpException(400, `Invalid Product IDs: ${invalidProductIds.join(', ')}`);
            }
        }

        if (categoryIds && categoryIds.length > 0) {
            const checkCategoryIds = await Category.findAll({
                where: { id: categoryIds },
                attributes: ['id'],
            }).then((categories) => categories.map((category) => category.id));

            const invalidCategoryid = categoryIds.filter((id) => !checkCategoryIds.includes(id));
            if (invalidCategoryid.length > 0) {
                throw new HttpException(400, `Invalid Category IDs: ${invalidCategoryid.join(', ')}`);
            }
        }

        if (subCategoryIds && subCategoryIds.length > 0) {
            const checkSubCategoryIds = await SubCategory.findAll({
                where: { id: subCategoryIds },
                attributes: ['id'],
            }).then((subCategories) => subCategories.map((subCategory) => subCategory.id));

            const invalidSubCategoryid = subCategoryIds.filter((id) => !checkSubCategoryIds.includes(id));
            if (invalidSubCategoryid.length > 0) {
                throw new HttpException(400, `Invalid SubCategory IDs: ${invalidSubCategoryid.join(', ')}`);
            }
        }

        const discount = await Discount.create(discountData);
        console.log("Created Discount:", discount);

        if (productIds && productIds.length > 0) {
            const discountProducts = productIds.map((productId) => ({
                discount_id: discount.id,
                product_id: productId,
            }));
            console.log("Discount Products to Insert:", discountProducts);
            await DiscountProduct.bulkCreate(discountProducts);
        }

        if (categoryIds && categoryIds.length > 0) {
            const discountCategories = categoryIds.map((categoryId) => ({
                discount_id: discount.id,
                Category_id: categoryId,
            }));
            console.log("Discount Categories to Insert:", discountCategories);
            await DiscountCategory.bulkCreate(discountCategories);
        }

        if (subCategoryIds && subCategoryIds.length > 0) {
            const discountSubCategories = subCategoryIds.map((subCategoryId) => ({
                discount_id: discount.id,
                subCategory_id: subCategoryId,
            }));
            console.log("Discount SubCategories to Insert:", discountSubCategories);
            await DiscountSubCategory.bulkCreate(discountSubCategories);
        }

        return discount;
    }



    public async getAllDiscounts(): Promise<DiscountAttributes[]> {
        try {
            const discounts = await Discount.findAll({
                include: [
                    {
                        model: DiscountCategory,
                        as: 'categories',
                        include: [
                            {
                                model: Category,
                                as: 'category',
                            },
                        ],
                    },
                    {
                        model: DiscountSubCategory,
                        as: 'subCategories',
                        include: [
                            {
                                model: SubCategory,
                                as: 'subcategory',
                            },
                        ],
                    },
                    {
                        model: DiscountProduct,
                        as: 'products',
                        include: [
                            {
                                model: Product,
                                as: 'product',
                            },
                        ],
                    },
                ]
            });




            console.log("discountData", discounts)



            return discounts;
        } catch (error) {
            console.log("error", error)
            throw new Error(`Error fetching discounts: ${error.message}`);
        }
    }

    public async getDiscountById(id: number): Promise<DiscountAttributes | null> {
        try {
            const discount = await Discount.findOne({
                where: {
                    id: id,
                },
                include: [
                    {
                        model: DiscountCategory,
                        as: 'categories',
                        include: [
                            {
                                model: Category,
                                as: 'category',
                            },
                        ],
                    },
                    {
                        model: DiscountSubCategory,
                        as: 'subCategories',
                        include: [
                            {
                                model: SubCategory,
                                as: 'subcategory',
                            },
                        ],
                    },
                    {
                        model: DiscountProduct,
                        as: 'products',
                        include: [
                            {
                                model: Product,
                                as: 'product',
                            },
                        ],
                    },
                ],
            });

            if (!discount) {
                throw new Error(`Discount with ID ${id} not found.`);
            }


            console.log("DiscountData", discount)


            const transformedResponse = {
                id: discount.id,
                name: discount.name,
                discount_type: discount.discount_type,
                start_date: discount.start_date,
                end_date: discount.end_date,
                value: discount.value,
                unit: discount.unit,
                is_active: discount.is_active,
                createdAt: discount.createdAt,
                updatedAt: discount.updatedAt,
                categories: discount.categories.map((category) => category.Category_id),
                subCategories: discount.subCategories.map((subCategory) => subCategory.subCategory_id),
                products: discount.products.map((product) => product.product_id),
            };

            return transformedResponse;


            // return discount;
        } catch (error) {
            throw new Error(`Error fetching discount: ${error.message} `);
        }
    }

    public async updateDiscount(id: number, data: CreateDiscountDTO): Promise<DiscountAttributes | null> {
        try {
            const { productIds, categoryIds, subCategoryIds, ...discountData } = data;
            
            const discount = await Discount.findByPk(id);
            if (!discount) {
                throw new Error('Discount not found');
            }

            if (discountData.value === undefined || discountData.value === null) {
                throw new HttpException(400, "Value is required");
            }

            await discount.update(discountData);

            if (productIds && productIds.length > 0) {
                await DiscountProduct.destroy({ where: { discount_id: id } });
                await DiscountProduct.bulkCreate(
                    productIds.map(productId => ({
                        discount_id: id,
                        product_id: productId
                    }))
                );
            }

            if (categoryIds && categoryIds.length > 0) {
                await DiscountCategory.destroy({ where: { discount_id: id } });
                await DiscountCategory.bulkCreate(
                    categoryIds.map(categoryId => ({
                        discount_id: id,
                        Category_id: categoryId
                    }))
                );
            }

            if (subCategoryIds && subCategoryIds.length > 0) {
                await DiscountSubCategory.destroy({ where: { discount_id: id } });
                await DiscountSubCategory.bulkCreate(
                    subCategoryIds.map(subCategoryId => ({
                        discount_id: id,
                        subCategory_id: subCategoryId
                    }))
                );
            }

            return discount;
        } catch (error) {
            throw new Error(`Error updating discount: ${error.message}`);
        }
    }

    public async deactivateDiscount(id: number): Promise<boolean> {
        try {
            const discount = await Discount.findByPk(id);
            if (!discount) {
                throw new Error('Discount not found');
            }
            discount.is_active = false;
            await discount.save();
            return true;
        } catch (error) {
            throw new Error(`Error deactivating discount: ${error.message} `);
        }
    }
    public async deleteDiscount(id: string): Promise<DiscountAttributes | null> {
        const discount = await Discount.findByPk(id);
        if (!discount) {
            throw new Error('Discount not found');
        }
        await discount.destroy();
        return discount;
    }
}


export default DiscountService;

