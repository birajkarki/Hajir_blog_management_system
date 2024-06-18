import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";

const TermsAndConditions = sequelize.define(
  "TermsAndConditions",
  {
    html: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    tableName: "TermsAndConditions",
  }
);

export default TermsAndConditions;
