'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('users', 'role', {
      type: Sequelize.ENUM('ADMIN', 'CUSTOMER'),
      allowNull: false,
      defaultValue: 'CUSTOMER',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('users', 'role', {
      type: Sequelize.ENUM('Admin', 'Customer'),
      allowNull: false,
      defaultValue: 'Customer',
    });
  },
};
