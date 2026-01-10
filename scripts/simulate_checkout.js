process.env.NODE_ENV = 'development';

(async () => {
  try {
    const { sequelize, Product, syncDB } = require('../src/models');
    const orderService = require('../src/services/order.service');

    console.log('Syncing DB...');
    await syncDB();

    // ensure product
    let p = await Product.findOne({ where: { name: 'NVIDIA GeForce RTX 2070' } });
    if (!p) {
      p = await Product.create({ name: 'NVIDIA GeForce RTX 2070', description: 'Tarjeta gráfica de alto rendimiento', price: 500.00, stock: 10 });
      console.log('Created product id', p.id);
    } else {
      // Reset stock if needed
      if (p.stock < 5) {
        p.stock = 10;
        await p.save();
        console.log('Reset stock to 10 for product id', p.id);
      }
      console.log('Found product id', p.id, 'stock:', p.stock);
    }

    // attempt checkout
    const items = [{ productId: 2, quantity: 1 }];
    const paymentMethod = 'card';
    const paymentDetails = {};

    const order = await orderService.checkout(null, items, paymentMethod, paymentDetails);
    console.log('Order created:', JSON.stringify(order, null, 2));
  } catch (e) {
    console.error('Error during simulated checkout:', e);
  } finally {
    try { const { sequelize } = require('../src/models'); await sequelize.close(); } catch (e) {}
  }
})();
