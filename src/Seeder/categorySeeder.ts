import sequelize from "@/database/sequelize";
import Category from "@/models/categoryModel";
import { QueryInterface } from "sequelize";
const categories = [
    { name: "Fruits and Vegetables", description: "Fresh produce from farms", image: "fruits_vegetables.jpg" },
    { name: "Dairy and Eggs", description: "Milk, cheese, and fresh eggs", image: "dairy_eggs.jpg" },
    { name: "Beverages", description: "Refreshing drinks and juices", image: "beverages.jpg" },
    { name: "Snacks and Sweets", description: "Delicious treats and munchies", image: "snacks_sweets.jpg" },
    { name: "Staples", description: "Everyday essentials like rice, flour, and pulses", image: "staples.jpg" },

]
const seederCategory = async () => {

    const queryInterface: QueryInterface = sequelize.getQueryInterface();
    try {
        console.log('Adding Category...')



        for (const category of categories) {
            // const [categoryIntence, created] = await Category.findOrCreate({ where: { name: category.name }, defaults: category })
            // if (created) {
            //     console.log(`Category '${category.name}' added.`);

            // } else {
            //     console.log(`Category '${category.name}' already exists.`);

            // }
            const checkName = await Category.findOne({ where: { name: category.name } })
            if (checkName) {
                console.log(`Category '${category.name}' already exists.`)
                continue
            }
            await Category.create(category, { validate: true })
            console.log(`Category Procced: ${category.name}`)
        }


        console.log('Categories added Successfully')
    } catch (error) {
        console.log("Error in Category Seeder", error)
    } finally {
        await sequelize.close()
    }

}

seederCategory();