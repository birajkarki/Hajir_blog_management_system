import { Sequelize } from "sequelize";

export const sequelize = new Sequelize(
  "hajir_blog",
  "staging_hajir",
  "velox@123",
  {
    host: "92.60.36.17",
    dialect: "mysql",
    logging: console.log,
  }
);

export const connectToDb = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected ...");

    await sequelize.sync();
    console.log("Database schema updated");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};
