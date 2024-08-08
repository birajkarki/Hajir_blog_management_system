
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Mail', {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    autoIncrement: false,
    primaryKey: false
  },
  message: {
    type: Sequelize.TEXT,
    allowNull: false,
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
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    autoIncrement: false,
    primaryKey: false
  },
  phone: {
    type: Sequelize.STRING,
    allowNull: true,
    autoIncrement: false,
    primaryKey: false
  }
});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Mail');
  }
};
