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
  await request(app).post('/auth/register').send({ nombreCompleto: 'Tester', email: 'tagadmin@example.com', password: 'pwd' });
  const res = await request(app).post('/auth/login').send({ email: 'tagadmin@example.com', password: 'pwd' });
  token = res.body.data.token;
});

afterAll(async () => {
  await sequelize.close();
});

describe('Protected tags routes', () => {
  test('GET /tags without token -> 401', async () => {
    const res = await request(app).get('/tags');
    expect(res.statusCode).toBe(401);
  });

   test('POST /tags create category missing fields -> 400', async () => {
    const res = await request(app).post('/tags')
      .set('Authorization', `Bearer ${token}`).send({ name: '' });
    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe('fail');
  });

  test('POST /tags create tag (protected) -> 201', async () => {
    const res = await request(app).post('/tags')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Gaming' });
    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe('success');
    createdId = res.body.data.id;
  });

  test('GET /tags (protected) -> list', async () => {
    const res = await request(app).get('/tags').set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('success');
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  test('GET /tags/:id -> 200', async () => {
    const res = await request(app).get(`/tags/${createdId}`).set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.data).toHaveProperty('name');
  });

  test('GET /tags/:id fail', async ()=> {
 const res= await request(app).get('/tags/9900').set('Authorization', `Bearer ${token}`);
 expect(res.statusCode).toBe(404);
 expect(res.body.status).toBe('fail');

})


  test('PUT /tags/:id -> update', async () => {
    const res = await request(app).put(`/tags/${createdId}`).set('Authorization', `Bearer ${token}`)
      .send({ name: 'Gaming Updated' });
    expect(res.statusCode).toBe(200);
    expect(res.body.data.name).toBe('Gaming Updated');
  });
test('PUT /tags/:id fail', async ()=> {
 const res= await request(app).put('/tags/9900').set('Authorization', `Bearer ${token}`)
      .send({ name: 'Non-existent Tag' });
 expect(res.statusCode).toBe(404);
 expect(res.body.status).toBe('fail');
})  

 




  test('DELETE /tags/:id -> 200', async () => {
    const res = await request(app).delete(`/tags/${createdId}`).set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('success');

  });

  test('DELETE /tags/:id fail', async ()=> {
 const res= await request(app).delete('/tags/9900').set('Authorization', `Bearer ${token}`);
 expect(res.statusCode).toBe(404);
 expect(res.body.status).toBe('fail');})

});


