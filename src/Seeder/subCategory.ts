import sequelize from "@/database/sequelize";
import Category from "@/models/categoryModel";
import SubCategory from "@/models/subCategoryModel";
import { QueryInterface } from "sequelize";

const subCategories: Array<{ name: string; category_id: string | number; }> = [


    { name: "Fresh Fruits", category_id: "Fruits and Vegetables" },
    { name: "Fresh Fruits 1", category_id: "Fruits and Vegetables" },
    { name: "Leafy Vegetables", category_id: "Fruits and Vegetables" },
    { name: "Milk", category_id: "Dairy and Eggs" },
    { name: "Cheese", category_id: "Dairy and Eggs" },
    { name: "Soft Drinks", category_id: "Beverages" },
    { name: "Packaged Juices", category_id: "Beverages" },
    { name: "Chips", category_id: "Snacks and Sweets" },
    { name: "Biscuits", category_id: "Snacks and Sweets" },
    { name: "Rice", category_id: "Staples" },
    { name: "Pulses", category_id: "Staples" },

];

const seedersubCategory = async () => {
    const queryInterface: QueryInterface = sequelize.getQueryInterface();


    try {
        console.log('Adding subCategories...');

        for (const subCategory of subCategories) {

            const checksubCategoryId = await Category.findOne({ where: { name: subCategory.category_id } })
            if (checksubCategoryId) {
                subCategory.category_id = checksubCategoryId.id
            } else {
                console.log(`Category ${subCategory.category_id} does not exist`)
                continue
            }
            const checkName = await SubCategory.findOne({ where: { name: subCategory.name } });

            if (checkName) {
                console.log(`SubCategory with name '${subCategory.name}' already exists. Skipping...`);
                continue;
            }
            await SubCategory.create({ name: subCategory.name, category_id: subCategory.category_id }, { validate: true })
            console.log(`SubCategory processed: ${subCategory.name}`);

        }
        console.log('SubCategories added successfully!');
    } catch (error) {
        console.log('Error adding subCategories:', error);
    } finally {
        await sequelize.close();
    }
};

seedersubCategory();
