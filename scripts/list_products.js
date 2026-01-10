process.env.NODE_ENV = 'development';

(async () => {
  try {
    const { sequelize, Product, syncDB } = require('../src/models');
    await syncDB();
    const products = await Product.findAll();
    console.log('Products:', products.map(p => ({ id: p.id, name: p.name, slug: p.slug, stock: p.stock, price: p.price })));
  } catch (e) {
    console.error('Error:', e);
  } finally {
    try { await sequelize.close(); } catch (e) {}
  }
})();