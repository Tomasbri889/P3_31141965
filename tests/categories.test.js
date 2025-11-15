const request = require('supertest');
const app = require('../src/app');
const { sequelize, syncDB } = require('../src/models');

let token;
let createdId;

beforeAll(async () => {
  process.env.NODE_ENV = 'test';
  await sequelize.authenticate();
  await syncDB();
  // create a user and obtain token
  await request(app).post('/auth/register').send({ nombreCompleto: 'Tester', email: 'catadmin@example.com', password: 'pwd' });
  const res = await request(app).post('/auth/login').send({ email: 'catadmin@example.com', password: 'pwd' });
  token = res.body.data.token;
});

afterAll(async () => {
  await sequelize.close();
});

describe('Protected categories routes', () => {
  test('GET /categories without token -> 401', async () => {
    const res = await request(app).get('/categories');
    expect(res.statusCode).toBe(401);
  });

  test('POST /categories create category (protected) -> 201', async () => {
    const res = await request(app).post('/categories')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Motherboards', description: 'PC motherboards' });
    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe('success');
    createdId = res.body.data.id;
  });

  test('GET /categories (protected) -> list', async () => {
    const res = await request(app).get('/categories').set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('success');
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  test('GET /categories/:id -> 200', async () => {
    const res = await request(app).get(`/categories/${createdId}`).set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.data).toHaveProperty('name');
  });

  test('PUT /categories/:id -> update', async () => {
    const res = await request(app).put(`/categories/${createdId}`).set('Authorization', `Bearer ${token}`)
      .send({ description: 'Updated description' });
    expect(res.statusCode).toBe(200);
    expect(res.body.data.description).toBe('Updated description');
  });

  test('DELETE /categories/:id -> 200', async () => {
    const res = await request(app).delete(`/categories/${createdId}`).set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
  });
});
