const productRepo = require('../repositories/product.repository');
const { buildOptions } = require('../services/productQueryBuilder');

// Protected: create product
async function createProduct(req, res) {
  const payload = req.body;
  if (!payload.name || !payload.price) return res.status(400).json({ status: 'fail', data: { message: 'Missing name or price' } });
  try {
    const p = await productRepo.createProduct(payload);
    return res.status(201).json({ status: 'success', data: p });
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ status: 'fail', data: { message: 'SKU or slug conflict' } });
    }
    throw err;
  }
}

// Protected: admin get by id
async function getProductById(req, res) {
  const id = req.params.id;
  const p = await productRepo.findById(id);
  if (!p) return res.status(404).json({ status: 'fail', data: { message: 'Product not found' } });
  return res.json({ status: 'success', data: p });
}

// Protected: update product
async function updateProduct(req, res) {
  const id = req.params.id;
  const payload = req.body;
  const updated = await productRepo.updateProduct(id, payload);
  if (!updated) return res.status(404).json({ status: 'fail', data: { message: 'Product not found' } });
  return res.json({ status: 'success', data: updated });
}

// Protected: delete product
async function deleteProduct(req, res) {
  const id = req.params.id;
  const ok = await productRepo.deleteProduct(id);
  if (!ok) return res.status(404).json({ status: 'fail', data: { message: 'Product not found' } });
  return res.json({ status: 'success', data: { message: 'Product deleted' } });
}

// Public: product canonical URL with self-healing slug
async function publicByIdSlug(req, res) {
  const { id, slug } = req.params;
  const p = await productRepo.findById(id);
  if (!p) return res.status(404).json({ status: 'fail', data: { message: 'Product not found' } });
  if (p.slug !== slug) {
    // redirect permanently to canonical
    const url = `/p/${p.id}-${p.slug}`;
    return res.redirect(301, url);
  }
  return res.json({ status: 'success', data: p });
}

/**
 * @openapi
 * /p/{id}-{slug}:
 *   get:
 *     summary: Public product by id and slug (self-healing)
 *     tags:
 *       - Public - Products
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *       - name: slug
 *         in: path
 *         required: true
 *     responses:
 *       200:
 *         description: Product object
 *       301:
 *         description: Redirect to canonical URL when slug mismatches
 */

// Public: list with advanced filters
async function publicList(req, res) {
  const { options, pagination } = buildOptions(req.query);
  const result = await productRepo.findAndCountAll(options);
  const total = result.count;
  const pages = Math.ceil(total / pagination.limit);
  return res.json({ status: 'success', data: { items: result.rows, total, page: pagination.page, pages } });
}

module.exports = { createProduct, getProductById, updateProduct, deleteProduct, publicByIdSlug, publicList };
