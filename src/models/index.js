const sequelize = require('../config/db');
const defineUser = require('./user');

const User = defineUser(sequelize);

async function syncDB() {
  await sequelize.sync({ force: process.env.NODE_ENV === 'test' ? true : false });
}

module.exports = {
  sequelize,
  User,
  syncDB
};
