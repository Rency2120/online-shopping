import sequelize from "@/database/sequelize";
import Category from "@/models/categoryModel";
import Product from "@/models/Product.Model";
import SubCategory from "@/models/subCategoryModel";




const Products: Array<{ name: string; Category_id: string | number; SubCategory_id: string | number }> = [
    { name: "Banana", Category_id: "Fruits and Vegetables", SubCategory_id: "Fresh Fruits" },
    { name: "Banana 3", Category_id: "Fruits and Vegetables", SubCategory_id: "Fresh Fruits 1" },



    { name: "Spinach", Category_id: "Fruits and Vegetables", SubCategory_id: "Leafy Vegetables" },
    { name: "Full Cream Milk", Category_id: "Dairy and Eggs", SubCategory_id: "Milk" },
    { name: "Mozzarella Cheese", Category_id: "Dairy and Eggs", SubCategory_id: "Cheese" },
    { name: "Coca Cola", Category_id: "Beverages", SubCategory_id: "Soft Drinks" },
    { name: "Tropicana Orange Juice", Category_id: "Beverages", SubCategory_id: "Packaged Juices" },
    { name: "Lay's Classic Salted", Category_id: "Snacks and Sweets", SubCategory_id: "Chips" },
    { name: "Oreo Biscuits", Category_id: "Snacks and Sweets", SubCategory_id: "Biscuits" },
    { name: "Basmati Rice", Category_id: "Staples", SubCategory_id: "Rice" },
    { name: "Chana Dal", Category_id: "Staples", SubCategory_id: "Pulses" },


];

const seederProduct = async () => {
    try {
        console.log("Adding Product....")
        for (const product of Products) {
            const checkName = await Product.findOne({ where: { name: product.name } })
            if (checkName) {
                console.log(`${checkName.name} already Exits`)
                continue
            }
            const checkCategoryId = await Category.findOne({ where: { name: product.Category_id } })
            if (checkCategoryId) {

                product.Category_id = checkCategoryId.id
            } else {
                console.log(`Category ${product.Category_id} does not exist`)
                continue
            }
            const checkSubCategory = await SubCategory.findOne({ where: { name: product.SubCategory_id } })
            if (checkSubCategory) {

                product.SubCategory_id = checkSubCategory.id
            } else {
                console.log(`subCategory ${product.SubCategory_id} does not exist`)
                continue
            }
            await Product.create({ name: product.name, Category_id: product.Category_id, SubCategory_id: product.SubCategory_id }, { validate: true })
            console.log(`Product Procced: ${product.name}`)

        }
        console.log('Product added successfully!');

    } catch (error) {
        console.log('Error adding Product:', error);
    } finally {
        sequelize.close()
    }
}
seederProduct()

