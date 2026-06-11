import express from 'express';
import { generateSubTasks } from '../controllers/aiController.js';
import { protect } from '../middleware/authMiddleware.js'; // Protected route 🛡️

const router = express.Router();

// Route for AI sub-tasks
router.post('/generate-subtasks', protect, generateSubTasks);

export default router;