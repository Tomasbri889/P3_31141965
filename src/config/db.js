const { Sequelize } = require('sequelize');
const path = require('path');

const env = process.env.NODE_ENV || 'development';

let storage = process.env.DATABASE_STORAGE || path.join(__dirname, '../../database.sqlite');

if (env === 'test') {
  // In-memory for tests
  storage = ':memory:';
}

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage,
  logging: false
});

module.exports = sequelize;
