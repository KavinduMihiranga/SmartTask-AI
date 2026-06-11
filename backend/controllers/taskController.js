import Task from '../models/Task.js';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// 1. Create a new task
export const createTask = async (req, res) => {
    try {
        const { title, description } = req.body;

        if (!title || !description) {
            return res.status(400).json({ message: 'Please provide title and description.' });
        }

        let aiSubTasks = [];
        try {
            const prompt = `You are a smart task manager assistant. 
            The user wants to do this task: "${title}". 
            Please break down this task into exactly 3 actionable, simple sub-tasks.
            Provide the response ONLY as a valid JSON array of strings. Do not include any formatting, markdown, or text outside the array.
            Example response format: ["Step 1 text", "Step 2 text", "Step 3 text"]`;

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });

            const aiText = response.text.trim();
            aiSubTasks = JSON.parse(aiText);
        } catch (aiError) {
            console.error('AI Sub-task generation failed:', aiError.message);
            aiSubTasks = ["Add step 1", "Add step 2", "Add step 3"];
        }

        // Mapping simple strings to object format [{ text: '...', isCompleted: false }]
        const formattedSubTasks = aiSubTasks.map(subTaskText => ({
            text: subTaskText,
            isCompleted: false
        }));
        
        const task = await Task.create({
            user: req.user._id, 
            title,
            description,
            subTasks: formattedSubTasks 
        });

        res.status(201).json({
            message: 'Task created successfully with AI steps!',
            task
        });

    } catch (error) {
        res.status(500).json({ message: 'Error creating task.', error: error.message });
    }
};

// 2. Get all tasks
export const getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ user: req.user._id }).sort({ createdAt: -1 }); // Sort by newest
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// 3. Get task by ID
export const getTaskById = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ message: 'Task not found.' });
        }

        if (task.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized to view this task.' });
        }

        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// 4. Update task
export const updateTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ message: 'Task not found.' });
        }

        if (task.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized to update this task.' });
        }

        const updatedTask = await Task.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        res.status(200).json({
            message: 'Task updated successfully!',
            task: updatedTask
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// 5. Delete task
export const deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ message: 'Task not found.' });
        }

        if (task.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized to delete this task.' });
        }

        await task.deleteOne();
        res.status(200).json({ message: 'Task deleted successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// 6. Update sub-task status
export const updateSubTaskStatus = async (req, res) => {
    try {
        const { id } = req.params; 
        const { subTasks } = req.body;

        const updatedTask = await Task.findByIdAndUpdate(
            id,
            { subTasks },
            { new: true }
        );

        if (!updatedTask) {
            return res.status(404).json({ message: 'Task not found.' });
        }

        res.status(200).json(updatedTask);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};