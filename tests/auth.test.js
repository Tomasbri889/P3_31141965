const request = require('supertest');
const app = require('../src/app');
const { sequelize, syncDB } = require('../src/models');

beforeAll(async () => {
  process.env.NODE_ENV = 'test';
  await sequelize.authenticate();
  await syncDB();
});

afterAll(async () => {
  await sequelize.close();
});

describe('Auth flows', () => {
  test('Register new user (success)', async () => {
    const res = await request(app).post('/auth/register').send({
      nombreCompleto: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    });
    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe('success');
    expect(res.body.data).toHaveProperty('id');
    expect(res.body.data).not.toHaveProperty('password');
  });

  test('Register duplicate email (fail)', async () => {
    const res = await request(app).post('/auth/register').send({
      nombreCompleto: 'Test User 2',
      email: 'test@example.com',
      password: 'another'
    });
    expect(res.statusCode).toBe(409);
    expect(res.body.status).toBe('fail');
  });

  test('Login with correct credentials (success)', async () => {
    const res = await request(app).post('/auth/login').send({
      email: 'test@example.com',
      password: 'password123'
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('success');
    expect(res.body.data).toHaveProperty('token');
  });

  test('Login with wrong password (fail)', async () => {
    const res = await request(app).post('/auth/login').send({
      email: 'test@example.com',
      password: 'wrong'
    });
    expect(res.statusCode).toBe(401);
    expect(res.body.status).toBe('fail');
  });
});
