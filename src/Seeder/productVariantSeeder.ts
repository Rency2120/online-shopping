import sequelize from "@/database/sequelize";
import Product from "@/models/Product.Model";
import ProductVariant from "@/models/productVariant.Model";

const productVariants: Array<{ Product_id: string | number, variantName: string, image: string, size: string, price: number, stock_left: number }> = [
    { Product_id: "Banana", variantName: "Banana - 1 Dozen", image: "banana.jpg", size: "1 Dozen", price: 50, stock_left: 300 },
    { Product_id: "Banana", variantName: "Banana - 2 Dozen", image: "banana2.jpg", size: "2 Dozen", price: 50, stock_left: 300 },
    { Product_id: "Spinach", variantName: "Spinach - 500g-1", image: "spinach1.jpg", size: "2 Dozen", price: 50, stock_left: 300 },
    { Product_id: "Spinach", variantName: "Spinach - 500g", image: "spinach.jpg", size: "500g", price: 40, stock_left: 100 },
    { Product_id: "Full Cream Milk", variantName: "Milk - 1 Liter", image: "milk.jpg", size: "1 Liter", price: 60, stock_left: 200 },
    { Product_id: "Mozzarella Cheese", variantName: "Mozzarella - 200g", image: "cheese.jpg", size: "200g", price: 150, stock_left: 50 },
    { Product_id: "Coca Cola", variantName: "Coca Cola - 1.25L", image: "coca_cola.jpg", size: "1.25L", price: 65, stock_left: 300 },
    { Product_id: "Tropicana Orange Juice", variantName: "Tropicana - 1L", image: "tropicana.jpg", size: "1L", price: 120, stock_left: 100 },
    { Product_id: "Lay's Classic Salted", variantName: "Lay's - 52g", image: "lays.jpg", size: "52g", price: 20, stock_left: 400 },
    { Product_id: "Oreo Biscuits", variantName: "Oreo - 120g", image: "oreo.jpg", size: "120g", price: 30, stock_left: 200 },
    { Product_id: "Basmati Rice", variantName: "Rice - 5kg", image: "basmati_rice.jpg", size: "5kg", price: 500, stock_left: 20 },
    { Product_id: "Chana Dal", variantName: "Chana Dal - 1kg", image: "chana_dal.jpg", size: "1kg", price: 100, stock_left: 80 },
];



const seederProductVariant = async () => {
    try {
        console.log("Adding ProductVariant.... ")
        for (const productVariant of productVariants) {
            const checkName = await ProductVariant.findOne({ where: { variantName: productVariant.variantName } })
            if (checkName) {
                console.log(`${productVariant.variantName}  already exists`)
                continue
            }

            const checkProductId = await Product.findOne({ where: { name: productVariant.Product_id } })
            if (checkProductId) {
                productVariant.Product_id = checkProductId.id

            } else {
                console.log(`ProductVariant with Name ${productVariant.Product_id} does not exist. Skipping ProductVariant: ${productVariant.variantName}`);
                continue

            }
            await ProductVariant.create({ Product_id: productVariant.Product_id, variantName: productVariant.variantName, price: productVariant.price, image: productVariant.image, size: productVariant.size, stock_left: productVariant.stock_left }, { validate: true })
            console.log(`Product Procced: ${productVariant.variantName}`)
        }
        console.log('ProductVariant added successfully!');

    } catch (error) {
        console.log("Error in ProductVariant Seeder", error)
    } finally {
        sequelize.close()
    }
}

seederProductVariant()