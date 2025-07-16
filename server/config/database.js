const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DATABASE_URL,
  
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: false, // disable SQL logging; set true for debug
  }
);

module.exports = sequelize;
