const categoryRepo = require('../repositories/category.repository');

async function listCategories(req, res) {
  const cats = await categoryRepo.findAllCategories();
  return res.json({ status: 'success', data: cats });
}

async function getCategory(req, res) {
  const id = req.params.id;
  const cat = await categoryRepo.findById(id);
  if (!cat) return res.status(404).json({ status: 'fail', data: { message: 'Category not found' } });
  return res.json({ status: 'success', data: cat });
}

async function createCategory(req, res) {
  const { name, description } = req.body;
  if (!name) return res.status(400).json({ status: 'fail', data: { message: 'Name required' } });
  try {
    const cat = await categoryRepo.createCategory({ name, description });
    return res.status(201).json({ status: 'success', data: cat });
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ status: 'fail', data: { message: 'Category already exists' } });
    }
    throw err;
  }
}

async function updateCategory(req, res) {
  const id = req.params.id;
  const payload = req.body;
  const updated = await categoryRepo.updateCategory(id, payload);
  if (!updated) return res.status(404).json({ status: 'fail', data: { message: 'Category not found' } });
  return res.json({ status: 'success', data: updated });
}

async function deleteCategory(req, res) {
  const id = req.params.id;
  const ok = await categoryRepo.deleteCategory(id);
  if (!ok) return res.status(404).json({ status: 'fail', data: { message: 'Category not found' } });
  return res.json({ status: 'success', data: { message: 'Category deleted' } });
}

module.exports = { listCategories, getCategory, createCategory, updateCategory, deleteCategory };
