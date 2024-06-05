import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";

const Template = sequelize.define(
  "Template",
  {
    templateName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "Template"
  }
);

export default Template;