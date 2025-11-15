const tagRepo = require('../repositories/tag.repository');

async function listTags(req, res) {
  const tags = await tagRepo.findAllTags();
  return res.json({ status: 'success', data: tags });
}

async function getTag(req, res) {
  const id = req.params.id;
  const tag = await tagRepo.findById(id);
  if (!tag) return res.status(404).json({ status: 'fail', data: { message: 'Tag not found' } });
  return res.json({ status: 'success', data: tag });
}

async function createTag(req, res) {
  const { name } = req.body;
  if (!name) return res.status(400).json({ status: 'fail', data: { message: 'Name required' } });
  try {
    const tag = await tagRepo.createTag({ name });
    return res.status(201).json({ status: 'success', data: tag });
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ status: 'fail', data: { message: 'Tag already exists' } });
    }
    throw err;
  }
}

async function updateTag(req, res) {
  const id = req.params.id;
  const payload = req.body;
  const updated = await tagRepo.updateTag(id, payload);
  if (!updated) return res.status(404).json({ status: 'fail', data: { message: 'Tag not found' } });
  return res.json({ status: 'success', data: updated });
}

async function deleteTag(req, res) {
  const id = req.params.id;
  const ok = await tagRepo.deleteTag(id);
  if (!ok) return res.status(404).json({ status: 'fail', data: { message: 'Tag not found' } });
  return res.json({ status: 'success', data: { message: 'Tag deleted' } });
}

module.exports = { listTags, getTag, createTag, updateTag, deleteTag };
