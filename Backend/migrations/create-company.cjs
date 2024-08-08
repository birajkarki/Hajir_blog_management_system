
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('company', {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  },
  companyLogo: {
    type: Sequelize.STRING,
    allowNull: false,
    autoIncrement: false,
    primaryKey: false
  },
  companyCount: {
    type: Sequelize.INTEGER,
    allowNull: true,
    autoIncrement: false,
    primaryKey: false
  },
  createdAt: {
    allowNull: false,
    type: Sequelize.DATE
  },
  updatedAt: {
    allowNull: false,
    type: Sequelize.DATE
  }
});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('company');
  }
};
