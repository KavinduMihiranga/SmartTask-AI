import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User' // Link to User 🔗
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        enum: ['pending', 'completed'],
        default: 'pending'
    },
    // Sub-tasks array with AI steps
    subTasks: [
        {
            text: { type: String, required: true },
            isCompleted: { type: Boolean, default: false }
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

const Task = mongoose.model('Task', taskSchema);
export default Task;