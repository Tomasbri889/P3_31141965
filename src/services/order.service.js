const { sequelize, Product } = require('../models');
const OrderRepository = require('../repositories/order.repository');
const CreditCardPaymentStrategy = require('./creditCardPaymentStrategy');

class OrderService {
  constructor() {
    // maps paymentMethod to strategy
    this.strategies = {
      CreditCard: new CreditCardPaymentStrategy()
    };
  }

  getStrategy(name) {
    return this.strategies[name];
  }

  async checkout(userId, items, paymentMethod, paymentDetails) {
    // items: [{ productId, quantity }]
    return await sequelize.transaction(async (t) => {
      // 1. verify stock and collect unit prices
      const products = {};
      let total = 0;
      for (const it of items) {
        const p = await Product.findByPk(it.productId, { transaction: t });
        if (!p) throw { status: 400, message: `Product ${it.productId} not found` };
        if (p.stock < it.quantity) throw { status: 400, message: `Insufficient stock for product ${p.id}` };
        products[it.productId] = p;
        total += parseFloat(p.price) * it.quantity;
      }

      // 2. payment
      const strategy = this.getStrategy(paymentMethod);
      if (!strategy) throw { status: 400, message: `Unsupported payment method ${paymentMethod}` };

      const payResult = await strategy.processPayment({ ...paymentDetails, amount: total });
      if (!payResult || !payResult.success) {
        throw { status: 402, message: 'Payment failed', detail: payResult && payResult.data };
      }

      // 3. update stock
      for (const it of items) {
        const p = products[it.productId];
        p.stock = p.stock - it.quantity;
        await p.save({ transaction: t });
      }

      // 4. create order and items
      const order = await OrderRepository.createOrder({ userId, totalAmount: total, status: 'COMPLETED' }, items.map(i => ({ productId: i.productId, quantity: i.quantity, unitPrice: products[i.productId].price })), t);
      return order;
    });
  }
}

module.exports = new OrderService();
