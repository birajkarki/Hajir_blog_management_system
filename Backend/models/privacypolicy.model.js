import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";

const PrivacyAndPolicy = sequelize.define(
  "PrivacyAndPolicy",
  {
    html: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    tableName: "PrivacyAndPolicy",
  }
);

export default PrivacyAndPolicy;
