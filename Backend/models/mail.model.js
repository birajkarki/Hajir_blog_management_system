import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";

const Mail = sequelize.define(
  "Mail",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    message: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "Mail",
  }
);

export default Mail;
