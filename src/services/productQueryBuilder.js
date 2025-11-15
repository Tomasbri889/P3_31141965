const { Op } = require('sequelize');
const { Category, Tag } = require('../models');

/**
 * Build Sequelize options for products listing based on query params.
 * Supports pagination, filtering by category (id or name), tags (array of ids), price range,
 * search term (name or description) and extra vinyl-specific filters: artist, label, year.
 */
function buildOptions(query) {
  const page = Math.max(1, parseInt(query.page || '1', 10));
  const limit = Math.max(1, Math.min(100, parseInt(query.limit || '10', 10)));
  const offset = (page - 1) * limit;

  const where = {};
  const include = [ { model: Category, as: 'category' }, { model: Tag, as: 'tags' } ];

  // price range
  if (query.price_min || query.price_max) {
    where.price = {};
    if (query.price_min) where.price[Op.gte] = Number(query.price_min);
    if (query.price_max) where.price[Op.lte] = Number(query.price_max);
  }

  // search in name or description
  if (query.search) {
    where[Op.or] = [
      { name: { [Op.like]: `%${query.search}%` } },
      { description: { [Op.like]: `%${query.search}%` } }
    ];
  }

  // category filter by id or name
  if (query.category) {
    const cat = query.category;
    if (/^\d+$/.test(cat)) {
      where.categoryId = Number(cat);
    } else {
      include[0].where = { name: cat };
    }
  }

  // tags: comma-separated ids
  if (query.tags) {
    const tagIds = String(query.tags).split(',').map((t) => Number(t)).filter(Boolean);
    if (tagIds.length > 0) {
      include[1].where = { id: { [Op.in]: tagIds } };
      include[1].required = true; // ensure join acts as filter
    }
  }

  // extra PC-specific filters: brand, model, generation
  if (query.brand) where.brand = { [Op.like]: `%${query.brand}%` };
  if (query.model) where.model = { [Op.like]: `%${query.model}%` };
  if (query.generation) where.generation = query.generation;

  // sorting
  const order = [['createdAt', 'DESC']];

  const options = { where, include, limit, offset, order, distinct: true };
  return { options, pagination: { page, limit } };
}

module.exports = { buildOptions };
