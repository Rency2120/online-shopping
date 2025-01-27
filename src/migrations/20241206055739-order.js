'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Orders',{
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users', 
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      cartId:{
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'CartItems', 
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      total_price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM('Pending', 'Order Confirmed', 'Dispatched', 'Shipped', 'Delivered', 'Cancelled'),
        defaultValue: 'Pending',
      },
      shipping_address: {
        type: Sequelize.JSON,
        allowNull: false, 
      },
      discount_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'discounts', 
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      shipping_cost: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references:{
          model:'ShippingCosts',
          key:'id'
        }
      },
      tracking_number: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Orders')
  }
};
