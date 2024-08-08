
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Blog', {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  },
  titleTag: {
    type: Sequelize.STRING,
    allowNull: true,
    autoIncrement: false,
    primaryKey: false
  },
  metaTag: {
    type: Sequelize.STRING,
    allowNull: true,
    autoIncrement: false,
    primaryKey: false
  },
  blogName: {
    type: Sequelize.STRING,
    allowNull: false,
    autoIncrement: false,
    primaryKey: false
  },
  blogDescription: {
    type: Sequelize.STRING,
    allowNull: false,
    autoIncrement: false,
    primaryKey: false
  },
  blogTitle: {
    type: Sequelize.STRING,
    allowNull: false,
    autoIncrement: false,
    primaryKey: false
  },
  blogImage: {
    type: Sequelize.TEXT,
    allowNull: false,
    autoIncrement: false,
    primaryKey: false
  },
  titleDescription: {
    type: Sequelize.TEXT,
    allowNull: false,
    autoIncrement: false,
    primaryKey: false
  },
  slug: {
    type: Sequelize.STRING,
    allowNull: false,
    autoIncrement: false,
    primaryKey: false
  },
  status: {
    type: Sequelize.STRING,
    allowNull: false,
    autoIncrement: false,
    primaryKey: false
  },
  sections: {
    type: Sequelize.STRING,
    allowNull: false,
    autoIncrement: false,
    primaryKey: false
  },
  templateId: {
    type: Sequelize.INTEGER,
    allowNull: true,
    autoIncrement: false,
    primaryKey: false
  },
  categoryId: {
    type: Sequelize.INTEGER,
    allowNull: true,
    autoIncrement: false,
    primaryKey: false
  },
  subcategoryId: {
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
  },
  canonicalTag: {
    type: Sequelize.TEXT,
    allowNull: true,
    autoIncrement: false,
    primaryKey: false
  },
  blogImageAltText: {
    type: Sequelize.TEXT,
    allowNull: false,
    autoIncrement: false,
    primaryKey: false
  },
  blogImageDescription: {
    type: Sequelize.TEXT,
    allowNull: false,
    autoIncrement: false,
    primaryKey: false
  },
  blogImageCaption: {
    type: Sequelize.TEXT,
    allowNull: false,
    autoIncrement: false,
    primaryKey: false
  }
});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Blog');
  }
};
