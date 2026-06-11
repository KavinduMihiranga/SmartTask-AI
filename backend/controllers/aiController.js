import dotenv from 'dotenv'; // 1. Import dotenv
dotenv.config(); // 2. Load .env file

import { GoogleGenAI } from '@google/genai';

// Initialize Gemini Client
const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

export const generateSubTasks = async (req, res) => {
    try {
        const { taskTitle } = req.body;

        if (!taskTitle) {
            return res.status(400).json({ message: 'Please provide a task title.' });
        }

        // AI Prompt 🤖
        const prompt = `You are a smart task manager assistant. 
        The user wants to do this task: "${taskTitle}". 
        Please break down this task into exactly 3 actionable, simple sub-tasks.
        Provide the response ONLY as a valid JSON array of strings. Do not include any formatting, markdown, or text outside the array.
        Example response format: ["Step 1 text", "Step 2 text", "Step 3 text"]`;

        // Send prompt to Gemini Model
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash', // Fastest and recommended model
            contents: prompt,
        });

        // Convert AI response to JSON
        const aiText = response.text.trim();
        const subTasksArray = JSON.parse(aiText);

        res.status(200).json({
            message: 'Sub-tasks generated successfully!',
            subTasks: subTasksArray
        });

    } catch (error) {
        res.status(500).json({ message: 'Error communicating with AI.', error: error.message });
    }
};