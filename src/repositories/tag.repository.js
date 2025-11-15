const { Tag } = require('../models');

async function createTag(payload) {
  return Tag.create(payload);
}

async function findAllTags() {
  return Tag.findAll();
}

async function findById(id) {
  return Tag.findByPk(id);
}

async function updateTag(id, payload) {
  const tag = await Tag.findByPk(id);
  if (!tag) return null;
  await tag.update(payload);
  return findById(id);
}

async function deleteTag(id) {
  const tag = await Tag.findByPk(id);
  if (!tag) return false;
  await tag.destroy();
  return true;
}

module.exports = { createTag, findAllTags, findById, updateTag, deleteTag };
