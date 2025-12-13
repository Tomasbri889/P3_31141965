const { Order, OrderItem, Product, User, sequelize } = require('../models');

async function createOrder(orderData, items, t) {
  // orderData: { userId, totalAmount, status }
  const order = await Order.create(orderData, { transaction: t });
  for (const it of items) {
    await OrderItem.create({ orderId: order.id, productId: it.productId, quantity: it.quantity, unitprice: it.unitPrice }, { transaction: t });
  }
  return Order.findByPk(order.id, { include: [{ model: OrderItem, as: 'items', include: [{ model: Product, as: 'product' }] }] , transaction: t });
}

async function findByUser(userId, page = 1, limit = 20) {
  const offset = (page - 1) * limit;
  return Order.findAndCountAll({ where: { userId }, include: [{ model: OrderItem, as: 'items', include: [{ model: Product, as: 'product' }] }], limit, offset, order: [['createdAt','DESC']] });
}

async function findByIdForUser(id, userId) {
  return Order.findOne({ where: { id, userId }, include: [{ model: OrderItem, as: 'items', include: [{ model: Product, as: 'product' }] }] });
}

module.exports = { createOrder, findByUser, findByIdForUser };
