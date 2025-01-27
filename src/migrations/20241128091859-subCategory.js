'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('subCategories',{
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique:true
      },
      category_id:{
        type:Sequelize.INTEGER,
        allowNull:false,
        references:{
          model:"Categories",
          key:'id',
        },
        onUpdate:'CASCADE',
        onDelete:'CASCADE'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      }
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('subCategories')
  }
};
