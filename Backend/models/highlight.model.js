import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import Blog from "./blog.model.js";

const Highlight = sequelize.define("Highlight", {
  highlightTitle: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  highlightDescription: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  highlightSections: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: [],
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

Blog.hasOne(Highlight, {
  foreignKey: "blogId",
  onDelete: "CASCADE",
});
Highlight.belongsTo(Blog, {
  foreignKey: "blogId",
});

export default Highlight;
