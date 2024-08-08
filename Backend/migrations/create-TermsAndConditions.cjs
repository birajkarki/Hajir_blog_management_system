
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('TermsAndConditions', {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  },
  html: {
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
  }
});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('TermsAndConditions');
  }
};
