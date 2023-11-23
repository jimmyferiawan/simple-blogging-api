const { Sequelize } = require("sequelize");
require("dotenv").config();

const mysqlConnection = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT || "mysql",
    logging: (...msg) => console.log("Database query : ", msg[0]),
    logQueryParameters: true,
    benchmark: true,
    timezone: "+07:00",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

module.exports = mysqlConnection;
