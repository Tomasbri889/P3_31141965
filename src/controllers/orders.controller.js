const orderService = require('../services/order.service');
const OrderRepository = require('../repositories/order.repository');

async function createOrder(req, res) {
  const userId = req.user && req.user.id;
  const { items, paymentMethod, paymentDetails } = req.body;
  if (!Array.isArray(items) || items.length === 0) return res.status(400).json({ status: 'fail', data: { message: 'No items provided' } });
  try {
    const order = await orderService.checkout(userId, items, paymentMethod, paymentDetails);
    return res.status(201).json({ status: 'success', data: order });
  } catch (err) {
    const code = err && err.status ? err.status : 500;
    const msg = err && err.message ? err.message : 'Internal Server Error';
    return res.status(code).json({ status: 'fail', data: { message: msg, detail: err && err.detail } });
  }
}

async function listOrders(req, res) {
  const userId = req.user && req.user.id;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const result = await OrderRepository.findByUser(userId, page, limit);
  return res.json({ status: 'success', data: { items: result.rows, total: result.count, page, pages: Math.ceil(result.count / limit) } });
}

async function getOrder(req, res) {
  const userId = req.user && req.user.id;
  const id = req.params.id;
  const order = await OrderRepository.findByIdForUser(id, userId);
  if (!order) return res.status(404).json({ status: 'fail', data: { message: 'Order not found' } });
  return res.json({ status: 'success', data: order });
}

module.exports = { createOrder, listOrders, getOrder };
