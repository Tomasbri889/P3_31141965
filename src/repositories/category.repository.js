const { Category } = require('../models');

async function createCategory(payload) {
  return Category.create(payload);
}

async function findAllCategories() {
  return Category.findAll();
}

async function findById(id) {
  return Category.findByPk(id);
}

async function updateCategory(id, payload) {
  const cat = await Category.findByPk(id);
  if (!cat) return null;
  await cat.update(payload);
  return findById(id);
}

async function deleteCategory(id) {
  const cat = await Category.findByPk(id);
  if (!cat) return false;
  await cat.destroy();
  return true;
}

module.exports = { createCategory, findAllCategories, findById, updateCategory, deleteCategory };
