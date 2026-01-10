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
  // Drop any leftover backup tables created by Sequelize's alter implementation
  // (sqlite creates `*_backup` temporary tables when altering columns).
  const qi = sequelize.getQueryInterface();
  try {
    const tables = await qi.showAllTables();
    for (const t of tables) {
      const name = typeof t === 'string' ? t : (t.tableName || t.name || t.tbl_name || null);
      if (name && name.endsWith('_backup')) {
        // ignore errors when dropping
        try {
          // Some dialects expect an object, but dropTable accepts a string name
          // so this works across dialects.
          // eslint-disable-next-line no-await-in-loop
          await qi.dropTable(name);
          console.log(`Dropped leftover backup table: ${name}`);
        } catch (e) {
          // continue if cannot drop
          console.warn(`Could not drop backup table ${name}:`, e.message || e);
        }
      }
    }
  } catch (e) {
    // if showAllTables isn't supported, ignore and continue to sync
    console.warn('Could not list tables before sync:', e.message || e);
  }

  // In tests we recreate DB (force). In dev we try to alter to match models.
  const options = process.env.NODE_ENV === 'test' ? { force: true } : { alter: true };

  // For sqlite, temporarily disable foreign key checks so ALTER emulation can
  // drop and recreate tables without failing on FK constraints.
  const isSqlite = sequelize.getDialect && sequelize.getDialect() === 'sqlite';
  if (isSqlite) {
    try {
      await sequelize.query('PRAGMA foreign_keys = OFF');
    } catch (e) {
      console.warn('Could not disable foreign_keys PRAGMA:', e.message || e);
    }
  }

  try {
    await sequelize.sync(options);
  } finally {
    if (isSqlite) {
      try {
        await sequelize.query('PRAGMA foreign_keys = ON');
      } catch (e) {
        console.warn('Could not re-enable foreign_keys PRAGMA:', e.message || e);
      }
    }
  }
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
