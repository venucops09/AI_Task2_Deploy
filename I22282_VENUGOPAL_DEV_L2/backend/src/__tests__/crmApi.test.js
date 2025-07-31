const request = require('supertest');
const app = require('../app');
const sequelize = require('../config/database');
const User = require('../models/user');
const Customer = require('../models/customer');
const Lead = require('../models/lead');
const Task = require('../models/task');
const Interaction = require('../models/interaction');
let token;

beforeAll(async () => {
  await sequelize.sync({ force: true });
  // Register and login a user to get JWT
  await request(app).post('/api/auth/register').send({
    username: 'testuser',
    email: 'test@crm.com',
    password: 'password123',
    full_name: 'Test User',
    role: 'admin'
  });
  const res = await request(app).post('/api/auth/login').send({
    email: 'test@crm.com',
    password: 'password123'
  });
  token = res.body.token;
});

describe('Customer API', () => {
  let customerId;
  test('Create customer (valid)', async () => {
    const res = await request(app)
      .post('/api/customers')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Acme', email: 'acme@corp.com' });
    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe('Acme');
    customerId = res.body.id;
  });
  test('Create customer (missing name)', async () => {
    const res = await request(app)
      .post('/api/customers')
      .set('Authorization', `Bearer ${token}`)
      .send({ email: 'fail@corp.com' });
    expect(res.statusCode).toBe(400);
  });
  test('Get customer (valid)', async () => {
    const res = await request(app)
      .get(`/api/customers/${customerId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.id).toBe(customerId);
  });
  test('Get customer (not found)', async () => {
    const res = await request(app)
      .get('/api/customers/9999')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(404);
  });
  test('Update customer', async () => {
    const res = await request(app)
      .put(`/api/customers/${customerId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Acme Updated' });
    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe('Acme Updated');
  });
  test('Delete customer', async () => {
    const res = await request(app)
      .delete(`/api/customers/${customerId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
  });
});

describe('Lead API', () => {
  let customerId, leadId;
  beforeAll(async () => {
    const customer = await Customer.create({ name: 'LeadCustomer', email: 'lead@crm.com' });
    customerId = customer.id;
  });
  test('Create lead (valid)', async () => {
    const res = await request(app)
      .post('/api/leads')
      .set('Authorization', `Bearer ${token}`)
      .send({ customer_id: customerId, status: 'New' });
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('New');
    leadId = res.body.id;
  });
  test('Create lead (missing customer_id)', async () => {
    const res = await request(app)
      .post('/api/leads')
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'New' });
    expect(res.statusCode).toBe(400);
  });
  test('Get lead (valid)', async () => {
    const res = await request(app)
      .get(`/api/leads/${leadId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.id).toBe(leadId);
  });
  test('Update lead', async () => {
    const res = await request(app)
      .put(`/api/leads/${leadId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'Contacted' });
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('Contacted');
  });
  test('Delete lead', async () => {
    const res = await request(app)
      .delete(`/api/leads/${leadId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
  });
});

describe('Task API', () => {
  let taskId;
  test('Create task (valid)', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Test Task', status: 'Open' });
    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe('Test Task');
    taskId = res.body.id;
  });
  test('Create task (missing title)', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'Open' });
    expect(res.statusCode).toBe(400);
  });
  test('Get task (valid)', async () => {
    const res = await request(app)
      .get(`/api/tasks/${taskId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.id).toBe(taskId);
  });
  test('Update task', async () => {
    const res = await request(app)
      .put(`/api/tasks/${taskId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'Completed' });
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('Completed');
  });
  test('Delete task', async () => {
    const res = await request(app)
      .delete(`/api/tasks/${taskId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
  });
});

describe('Interaction API', () => {
  let customerId, interactionId;
  beforeAll(async () => {
    const customer = await Customer.create({ name: 'InteractionCustomer', email: 'interaction@crm.com' });
    customerId = customer.id;
  });
  test('Create interaction (valid)', async () => {
    const res = await request(app)
      .post('/api/interactions')
      .set('Authorization', `Bearer ${token}`)
      .send({ customer_id: customerId, type: 'call' });
    expect(res.statusCode).toBe(200);
    expect(res.body.type).toBe('call');
    interactionId = res.body.id;
  });
  test('Create interaction (missing type)', async () => {
    const res = await request(app)
      .post('/api/interactions')
      .set('Authorization', `Bearer ${token}`)
      .send({ customer_id: customerId });
    expect(res.statusCode).toBe(400);
  });
  test('Get interaction (valid)', async () => {
    const res = await request(app)
      .get(`/api/interactions/${interactionId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.id).toBe(interactionId);
  });
  test('Update interaction', async () => {
    const res = await request(app)
      .put(`/api/interactions/${interactionId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ type: 'email' });
    expect(res.statusCode).toBe(200);
    expect(res.body.type).toBe('email');
  });
  test('Delete interaction', async () => {
    const res = await request(app)
      .delete(`/api/interactions/${interactionId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
  });
});

afterAll(async () => {
  await sequelize.close();
}); 