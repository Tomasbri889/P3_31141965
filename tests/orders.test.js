const request = require('supertest');
const app = require('../src/app');
const { syncDB, Product, User, sequelize } = require('../src/models');

describe('Orders API (transactional)', () => {
  let token;
  beforeAll(async () => {
    process.env.NODE_ENV = 'test';
    await syncDB();
    // create test user via API (ensures hooks and validation run as in production)
    await request(app).post('/auth/register').send({ nombreCompleto: 'Order Tester', email: 'order@test.com', password: 'pass123' });
    const res = await request(app).post('/auth/login').send({ email: 'order@test.com', password: 'pass123' });
    token = res.body && res.body.data && res.body.data.token;
  });

  afterAll(async () => {
    await sequelize.close();
  });

  test('POST /orders requires auth', async () => {
    const res = await request(app).post('/orders').send({ items: [] });
    expect(res.status).toBe(401);
  });

test('Order not found', async()=>{
  const res= await request(app).get('/orders/9999').set('Authorization', `Bearer ${token}`);
  expect(res.status).toBe(404);
  expect(res.body.status).toBe('fail');


})




  test('successful checkout reduces stock and creates order', async () => {
    // create product with stock
    const p = await Product.create({ name: 'BuyMe', price: 10.0, stock: 5 });
    const payload = { items: [{ productId: p.id, quantity: 2 }], paymentMethod: 'CreditCard', paymentDetails: { cardToken: 'tok_visa', currency: 'USD' } };
    const res = await request(app).post('/orders').set('Authorization', `Bearer ${token}`).send(payload);
    expect([200,201]).toContain(res.status);
    const refreshed = await Product.findByPk(p.id);
    expect(refreshed.stock).toBe(3);
  });

  test('checkout fails on insufficient stock and rollbacks', async () => {
    const p = await Product.create({ name: 'Scarce', price: 20.0, stock: 1 });
    const payload = { items: [{ productId: p.id, quantity: 2 }], paymentMethod: 'CreditCard', paymentDetails: { cardToken: 'tok_fail', currency: 'USD' } };
    const res = await request(app).post('/orders').set('Authorization', `Bearer ${token}`).send(payload);
    expect(res.status).toBe(400);
    const refreshed = await Product.findByPk(p.id);
    expect(refreshed.stock).toBe(1);
  });
  
});

