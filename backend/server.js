import { createRequire } from 'module';
const require = createRequire(import.meta.url);
import crypto from 'node:crypto';
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js'; 
import taskRoutes from './routes/taskRoutes.js'; 
import aiRoutes from './routes/aiRoutes.js'; 

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes); 
app.use('/api/tasks', taskRoutes); 
app.use('/api/ai', aiRoutes); 

app.get('/', (req, res) => {
    res.send('AI Task Manager Backend is running successfully!');
});

const PORT = process.env.PORT || 8080;

// ටෙස්ට් එකේදී මේ කොටස රන් වෙන්නේ නැහැ (Port ප්‍රශ්න විසඳන්න)
if (process.env.NODE_ENV !== 'test') {
    mongoose.connect(process.env.MONGO_URI)
        .then(() => {
            console.log('✅ Connected to MongoDB!');
            app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
        })
        .catch((err) => console.error('❌ MongoDB connection failed:', err.message));
}

export default app;