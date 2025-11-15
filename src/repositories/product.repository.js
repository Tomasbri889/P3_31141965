const { Product, Category, Tag } = require('../models');

async function createProduct(payload) {
  const { tags, categoryId, ...rest } = payload;
  const product = await Product.create({ ...rest, categoryId });
  if (Array.isArray(tags) && tags.length > 0) {
    await product.setTags(tags);
  }
  return findById(product.id);
}

async function findById(id) {
  return Product.findByPk(id, { include: [ { model: Category, as: 'category' }, { model: Tag, as: 'tags' } ] });
}

async function updateProduct(id, payload) {
  const product = await Product.findByPk(id);
  if (!product) return null;
  const { tags, categoryId, ...rest } = payload;
  await product.update({ ...rest, categoryId });
  if (Array.isArray(tags)) {
    await product.setTags(tags);
  }
  return findById(id);
}

async function deleteProduct(id) {
  const product = await Product.findByPk(id);
  if (!product) return false;
  await product.destroy();
  return true;
}

async function findAndCountAll(options) {
  // options expected to be a Sequelize findAndCountAll options object
  return Product.findAndCountAll(options);
}

module.exports = { createProduct, findById, updateProduct, deleteProduct, findAndCountAll };
