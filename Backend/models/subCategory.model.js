import { DataTypes } from 'sequelize';
import { sequelize } from '../database/database.js';
import Category from './category.model.js';
import Template from './template.model.js';

const SubCategory = sequelize.define(
  "SubCategory",
  {
    subCategoryName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    categoryId: {
      type: DataTypes.INTEGER,
      references: {
        model: Category,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    templateId: {
      type: DataTypes.INTEGER,
      references: {
        model: Template,
        key: "id",
      },
      onDelete: "CASCADE",
    },
  },
  {
    tableName: "SubCategory",
  }
);

Category.hasMany(SubCategory, {
  foreignKey: "categoryId",
  onDelete: "CASCADE",
});
SubCategory.belongsTo(Category, { foreignKey: "categoryId" });

Template.hasMany(SubCategory, {
  foreignKey: "templateId",
  onDelete: "CASCADE",
});

SubCategory.belongsTo(Template, {
  foreignKey: "templateId",
});

export default SubCategory;
