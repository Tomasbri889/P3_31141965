const sequelize = require('../config/db');
const defineUser = require('./user');
const defineCategory = require('./category');
const defineTag = require('./tag');
const defineProduct = require('./product');
const { Sequelize } = require('sequelize');

// Model definitions
const User = defineUser(sequelize);
const Category = defineCategory(sequelize);
const Tag = defineTag(sequelize);
const Product = defineProduct(sequelize);

// Associations
Category.hasMany(Product, { foreignKey: 'categoryId', as: 'products' });
Product.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });

Product.belongsToMany(Tag, { through: 'ProductTags', as: 'tags', foreignKey: 'productId' });
Tag.belongsToMany(Product, { through: 'ProductTags', as: 'products', foreignKey: 'tagId' });

async function syncDB() {
  // In tests we recreate DB (force). In dev we try to alter to match models.
  const options = process.env.NODE_ENV === 'test' ? { force: true } : { alter: true };
  await sequelize.sync(options);
}

module.exports = {
  sequelize,
  Sequelize,
  User,
  Category,
  Tag,
  Product,
  syncDB
};
