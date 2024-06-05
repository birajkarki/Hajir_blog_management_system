import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import Blog from "./blog.model.js";

const Section = sequelize.define("Section", {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  blogId: {
    type: DataTypes.INTEGER,
    references: {
      model: Blog,
      key: "id",
    },
    onDelete: "CASCADE",
  },
});

Blog.hasMany(Section, {
  foreignKey: "blogId",
  onDelete: "CASCADE",
});

Section.belongsTo(Blog, { foreignKey: "blogId" });

export default Section;
