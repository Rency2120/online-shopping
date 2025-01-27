export interface IProductVariant {
    Variant_id: number;
    Product_id: number;
    variantName: string;
    image: string;
    size: string;
    price: number;
    stock_sold: number;
    stock_left: number;
    createdAt: Date;
    updatedAt: Date;
}