const request = require('supertest');
const app = require('../src/app');
const { sequelize, syncDB } = require('../src/models');

let token;
let createdId;

beforeAll(async () => {
  process.env.NODE_ENV = 'test';
  await sequelize.authenticate();
  await syncDB();
  // Create a user and get token
  await request(app).post('/auth/register').send({
    nombreCompleto: 'Admin User',
    email: 'admin@example.com',
    password: 'adminpass'
  });
  const res = await request(app).post('/auth/login').send({
    email: 'admin@example.com',
    password: 'adminpass'
  });
  token = res.body.data.token;
});

afterAll(async () => {
  await sequelize.close();
});

describe('Protected users routes', () => {
  test('GET /users without token -> 401', async () => {
    const res = await request(app).get('/users');
    expect(res.statusCode).toBe(401);
  });

  test('POST /users create user (protected) -> 201', async () => {
    const res = await request(app).post('/users')
      .set('Authorization', `Bearer ${token}`)
      .send({ nombreCompleto: 'User A', email: 'a@example.com', password: 'pwd' });
    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe('success');
    createdId = res.body.data.id;
  });

  test('GET /users (protected) -> list', async () => {
    const res = await request(app).get('/users').set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('success');
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  test('GET /users/:id', async () => {
    const res = await request(app).get(`/users/${createdId}`).set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.data).toHaveProperty('email');
  });

  test('PUT /users/:id', async () => {
    const res = await request(app).put(`/users/${createdId}`).set('Authorization', `Bearer ${token}`)
      .send({ nombreCompleto: 'User A Updated' });
    expect(res.statusCode).toBe(200);
    expect(res.body.data.nombreCompleto).toBe('User A Updated');
  });

  test('DELETE /users/:id', async () => {
    const res = await request(app).delete(`/users/${createdId}`).set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
  });
});
