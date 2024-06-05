import { DataTypes } from 'sequelize';
import { sequelize } from '../database/database.js';
import Template from './template.model.js';


const Category = sequelize.define(
  "Category",
  {
    categoryName: {
      type: DataTypes.STRING,
      allowNull: false,
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
    tableName: "Category",
  }
);

Template.hasMany(Category, {
    foreignKey: "templateId",
    onDelete: "CASCADE"
})

Category.belongsTo(Template, {foreignKey: "templateId"})

export default Category;