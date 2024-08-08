import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });
export const sequelize = new Sequelize(
  process.env.DATABASE_NAME,
  process.env.DATABASE_USERNAME,
  process.env.DATABASE_PASSWORD,
  {
    host: process.env.DATABASE_HOST,
    dialect: process.env.DATABASE_DIALECT,
    logging: false,
  }
);

export const connectToDb = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected ...");

    await sequelize.sync({ alter: false });
    // await sequelize.query('ALTER TABLE `User` ADD UNIQUE (`email`);');
    console.log("Database schema updated");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};
