import request from 'supertest';
import app from '../server.js';
import mongoose from 'mongoose';

describe('POST /api/tasks', () => {
  it('should create a new task if user is logged in', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${token}`) 
      .send({ title: 'Finish AI Task', description: 'Complete the backend' });
    
    expect(res.statusCode).toBe(201);
  });
});