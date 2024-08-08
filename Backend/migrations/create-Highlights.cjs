
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Highlights', {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  },
  highlightTitle: {
    type: Sequelize.STRING,
    allowNull: false,
    autoIncrement: false,
    primaryKey: false
  },
  highlightDescription: {
    type: Sequelize.TEXT,
    allowNull: false,
    autoIncrement: false,
    primaryKey: false
  },
  highlightSections: {
    type: Sequelize.STRING,
    allowNull: false,
    autoIncrement: false,
    primaryKey: false
  },
  blogId: {
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
    await queryInterface.dropTable('Highlights');
  }
};
