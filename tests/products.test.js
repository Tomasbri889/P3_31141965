const request = require('supertest');
const app = require('../src/app');
const { sequelize, syncDB } = require('../src/models');

let token;
let categoryId;
let tagId;
let productId;

beforeAll(async () => {
  process.env.NODE_ENV = 'test';
  await sequelize.authenticate();
  await syncDB();
  // create a user and obtain token
  await request(app).post('/auth/register').send({ nombreCompleto: 'Tester', email: 'prodadmin@example.com', password: 'pwd' });
  const res = await request(app).post('/auth/login').send({ email: 'prodadmin@example.com', password: 'pwd' });
  token = res.body.data.token;
  // create a category and a tag to attach to product
  const c = await request(app).post('/categories').set('Authorization', `Bearer ${token}`).send({ name: 'Components' });
  categoryId = c.body.data.id;
  const t = await request(app).post('/tags').set('Authorization', `Bearer ${token}`).send({ name: 'Featured' });
  tagId = t.body.data.id;
});

afterAll(async () => {
  await sequelize.close();
});

describe('Products routes (public & protected)', () => {
  test('GET /products public list -> 200', async () => {
    const res = await request(app).get('/products');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('success');
    expect(res.body.data).toHaveProperty('items');
    expect(Array.isArray(res.body.data.items)).toBe(true);
  });

  test('POST /products create product (protected) -> 201', async () => {
    const payload = { name: 'GTX 999', price: 199.99, stock: 10, categoryId, tags: [tagId] };
    const res = await request(app).post('/products').set('Authorization', `Bearer ${token}`).send(payload);
    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe('success');
    productId = res.body.data.id;
  });

  test('GET /products (after create) includes item', async () => {
    const res = await request(app).get('/products');
    expect(res.statusCode).toBe(200);
    const items = res.body.data.items;
    expect(items.some(i => i.id === productId)).toBe(true);
  });

  test('GET /products/:id (protected) -> 200', async () => {
    const res = await request(app).get(`/products/${productId}`).set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.data).toHaveProperty('name');
  });

  test('PUT /products/:id -> update', async () => {
    const res = await request(app).put(`/products/${productId}`).set('Authorization', `Bearer ${token}`)
      .send({ name: 'GTX 999 Ti' });
    expect(res.statusCode).toBe(200);
    expect(res.body.data.name).toBe('GTX 999 Ti');
  });

  test('DELETE /products/:id -> 200', async () => {
    const res = await request(app).delete(`/products/${productId}`).set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
  });

  test('GET /p/:id/:slug correct slug -> 200', async () => {
    // First create a product to test
    const payload = { name: 'Test Product', price: 100.00, stock: 5 };
    const createRes = await request(app).post('/products').set('Authorization', `Bearer ${token}`).send(payload);
    const testProductId = createRes.body.data.id;
    const expectedSlug = 'test-product'; // based on slugify

    const res = await request(app).get(`/p/${testProductId}/${expectedSlug}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.data.slug).toBe(expectedSlug);
  });

  test('GET /p/:id/:slug wrong slug -> 301 redirect', async () => {
    const res = await request(app).get(`/p/1/wrong-slug`).redirects(0); // Don't follow redirects
    expect(res.statusCode).toBe(301);
    expect(res.headers.location).toBe('/p/1/test-product'); // Assuming product 1 has slug 'test-product'
  });
});
