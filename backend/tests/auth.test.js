import request from 'supertest';
import app from '../server.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../.env') }); // tests/ folder එකෙන් backend/ root එකට යනවා

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('POST /api/auth/signup', () => {
  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/signup')
      .send({
        name: 'Test User',
        email: `test${Date.now()}@example.com`,
        password: 'password123'
      });
    
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('message');
  }, 15000);

  it('should fail if email is already taken', async () => {
    const email = `taken${Date.now()}@example.com`;

    await request(app)
      .post('/api/auth/signup')
      .send({ name: 'User', email, password: 'password123' });

    const res = await request(app)
      .post('/api/auth/signup')
      .send({ name: 'User', email, password: 'password123' });

    expect(res.statusCode).toBe(400);
  }, 15000);

  it('should login a registered user', async () => {
    const email = `login${Date.now()}@example.com`;
    await request(app)
      .post('/api/auth/signup')
      .send({ name: 'User', email, password: 'password123' });

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email, password: 'password123' });
    
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token'); 
  });
});