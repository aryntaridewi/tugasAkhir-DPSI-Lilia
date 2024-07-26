const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  `mysql://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
  {
    dialect: "mysql",
    logging: false, // Set to true if you want to see SQL logs
  }
);

module.exports = sequelize;
