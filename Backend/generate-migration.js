import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { Sequelize, DataTypes } from "sequelize";

// Define __dirname using import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sequelize = new Sequelize("hajir_blog", "staging_hajir", "velox@123", {
  host: "92.60.36.17",
  dialect: "mysql",
});

const mapDataType = (type) => {
  const typeMapping = {
    varchar: DataTypes.STRING,
    text: DataTypes.TEXT,
    tinyint: DataTypes.BOOLEAN,
    int: DataTypes.INTEGER,
    bigint: DataTypes.BIGINT,
    float: DataTypes.FLOAT,
    double: DataTypes.DOUBLE,
    decimal: DataTypes.DECIMAL,
    date: DataTypes.DATE,
    datetime: DataTypes.DATE,
    timestamp: DataTypes.DATE,
    time: DataTypes.TIME,
    blob: DataTypes.BLOB,
    json: DataTypes.JSON,
    jsonb: DataTypes.JSONB,
  };

  // Extract the base type from type definition
  const baseType = type.split("(")[0].toLowerCase();
  return typeMapping[baseType] || DataTypes.STRING;
};

const generateMigration = async () => {
  try {
    const [tables] = await sequelize.query("SHOW TABLES");
    console.log("Tables:", tables); // Log tables to verify

    for (const table of tables) {
      const tableName = table[`Tables_in_${sequelize.config.database}`];
      if (!tableName) {
        console.error("No table name found for:", table);
        continue;
      }

      console.log("Processing table:", tableName); // Log table names

      const [columns] = await sequelize.query(`DESCRIBE ${tableName}`);

      const attributes = {};
      columns.forEach((column) => {
        attributes[column.Field] = {
          type: mapDataType(column.Type),
          allowNull: column.Null === "YES",
          autoIncrement: column.Extra === "auto_increment",
          primaryKey: column.Key === "PRI",
        };
      });

      // Ensure that createdAt and updatedAt fields are included
      attributes.createdAt = {
        allowNull: false,
        type: DataTypes.DATE,
      };
      attributes.updatedAt = {
        allowNull: false,
        type: DataTypes.DATE,
      };

      // Generate migration content
      const migrationContent = `
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('${tableName}', ${JSON.stringify(
        attributes,
        (key, value) =>
          typeof value === "object" && value.type
            ? { ...value, type: `Sequelize.${value.type.key.toUpperCase()}` }
            : value,
        2
      )
        .replace(/"Sequelize\.(\w+)"/g, "Sequelize.$1")
        .replace(/"(\w+)":/g, "$1:")});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('${tableName}');
  }
};
`;

      fs.writeFileSync(
        path.join(__dirname, "migrations", `create-${tableName}.cjs`),
        migrationContent
      );
    }
  } catch (error) {
    console.error("Error generating migration:", error);
  }
};

generateMigration().catch(console.error);
