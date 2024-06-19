import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import Template from "./template.model.js";
import Category from "./category.model.js";
import SubCategory from "./subCategory.model.js";

const Blog = sequelize.define(
  "Blog",
  {
    titleTag: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    metaTag: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    blogName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    blogDescription: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    blogTitle: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    blogImage: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    titleDescription: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    status: {
      type: DataTypes.ENUM,
      values: ["draft", "approved", "rejected"],
      allowNull: false,
    },
    sections: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
    },

    templateId: {
      type: DataTypes.INTEGER,
      references: {
        model: Template,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    categoryId: {
      type: DataTypes.INTEGER,
      references: {
        model: Category,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    subcategoryId: {
      type: DataTypes.INTEGER,
      references: {
        model: SubCategory,
        key: "id",
      },
      onDelete: "CASCADE",
    },
  },
  {
    tableName: "Blog",
  }
);

Template.hasMany(Blog, {
  foreignKey: "templateId",
  onDelete: "CASCADE",
});
Blog.belongsTo(Template, {
  foreignKey: "templateId",
});

Category.hasMany(Blog, {
  foreignKey: "categoryId",
  onDelete: "CASCADE",
});
Blog.belongsTo(Category, { foreignKey: "categoryId", allowNull: true });

SubCategory.hasMany(Blog, {
  foreignKey: "subcategoryId",
  onDelete: "CASCADE",
});
Blog.belongsTo(SubCategory, { foreignKey: "subcategoryId" });

export default Blog;
