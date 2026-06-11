import express from 'express';
import { 
    createTask, 
    getTasks,
    getTaskById,
    updateTask,
    deleteTask,
    updateSubTaskStatus
 } from '../controllers/taskController.js';
import { protect } from '../middleware/authMiddleware.js'; // Protected route 🛡️

const router = express.Router();

router.route('/')
    .post(protect, createTask)
    .get(protect, getTasks);
router.route('/:id')
    .get(protect, getTaskById)
    .put(protect, updateTask)
    .delete(protect, deleteTask);
router.route('/:id/subtasks')
    .put(protect, updateSubTaskStatus);
export default router;