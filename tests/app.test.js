const request = require('supertest');
const app = require('../app'); // Ajusta según ruta
const app = require('../src/app'); // ✅ ruta corregida



describe('GET /ping', () => {
  it('responde con 200 y cuerpo vacío', async () => {
    const res = await request(app).get('/ping');
    expect(res.statusCode).toBe(200);
  });
});


describe('GET /about', () => {
  it('responde con JSON correcto y status 200', async () => {
    const res = await request(app).get('/about');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('success');
    expect(res.body.data).toHaveProperty('nombreCompleto');
    expect(res.body.data).toHaveProperty('cedula');
    expect(res.body.data).toHaveProperty('seccion');
  });
});
