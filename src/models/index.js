const sequelize = require('../config/db');
const defineUser = require('./user');
const defineCategory = require('./category');
const defineTag = require('./tag');
const defineProduct = require('./product');
const DefineOrderItem = require('./OrderItem');
const defineOrder = require('./Order');
const { Sequelize } = require('sequelize');

// Model definitions
const User = defineUser(sequelize);
const Category = defineCategory(sequelize);
const Tag = defineTag(sequelize);
const Product = defineProduct(sequelize);
const OrderItem = DefineOrderItem(sequelize)
const Order = defineOrder(sequelize)

// Associations
Category.hasMany(Product, { foreignKey: 'categoryId', as: 'products' });
Product.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });

Product.belongsToMany(Tag, { through: 'ProductTags', as: 'tags', foreignKey: 'productId' });
Tag.belongsToMany(Product, { through: 'ProductTags', as: 'products', foreignKey: 'tagId' });

// Orders and items
Order.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasMany(Order, { foreignKey: 'userId', as: 'orders' });

Order.hasMany(OrderItem, { foreignKey: 'orderId', as: 'items' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });

OrderItem.belongsTo(Product, { foreignKey: 'productId', as: 'product' });
Product.hasMany(OrderItem, { foreignKey: 'productId', as: 'orderItems' });






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
  OrderItem,
  Order,
  syncDB
};
