import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";

const Reviews = sequelize.define(
  "Reviews",
  {
    reviewText: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    region: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ratings: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "Reviews",
  }
);

export default Reviews;
