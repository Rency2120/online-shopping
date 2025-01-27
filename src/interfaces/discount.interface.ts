export interface DiscountAttributes {
    id: number;
    name: string;
    discount_type: 'percentage' | 'fixed';
    start_date: Date | null;
    end_date: Date | null;
    value: number;
    unit: number | null;
    Product_id?: object | null;
    Category_id?: object | null;
    subCategory_id?: object | null;
    is_active: boolean;
    createdAt: Date;
    updatedAt: Date;
    discountedAmount?: number;
    discountAmount?: number;
}

export interface DiscountCreation extends Omit<DiscountAttributes, 'id' | 'createdAt' | 'updatedAt' | 'is_active'> {
}

export interface CreateDiscountDTO {
    name: string;
    discount_type: 'percentage' | 'fixed';
    start_date?: Date | null;
    end_date?: Date | null;
    value: number;
    unit?: number | null;
    is_active: boolean;
    productIds?: number[];
    categoryIds?: number[];
    subCategoryIds?: number[];
}


