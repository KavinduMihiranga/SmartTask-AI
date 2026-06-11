import React, { useState, useEffect, useContext } from 'react';
import Navbar from '../components/Navbar';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

function Dashboard() {
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [loading, setLoading] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState('');

  const { user } = useContext(AuthContext);

  // 1. Fetching existing tasks 🔄
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/tasks');
        setTasks(response.data);
      } catch (err) {
        console.error('Failed to load tasks:', err);
        setError('Failed to load tasks.');
      }
    };

    if (user) {
      fetchTasks();
    }
  }, [user]);

  // 2. Create new task 🤖➕
  const handleCreateTask = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/tasks', {
        title: taskTitle,
        description: taskDesc
      });

      if (response.data) {
        const newCreatedTask = response.data.task ? response.data.task : response.data;
        setTasks([newCreatedTask, ...tasks]);
        setTaskTitle('');
        setTaskDesc('');
      }
    } catch (err) {
      console.error('Task creation failed:', err);
      setError(err.response?.data?.message || 'Could not add task. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // 3. Toggle sub-task status (FIXED) 🛠️
  const handleToggleSubTask = async (taskId, subTaskIdx) => {
    const updatedTasks = [...tasks];
    const taskIdx = updatedTasks.findIndex(t => t._id === taskId);
    
    if (taskIdx !== -1) {
      const task = updatedTasks[taskIdx];
      
      if (typeof task.subTasks[subTaskIdx] === 'string') {
        task.subTasks[subTaskIdx] = {
          text: task.subTasks[subTaskIdx],
          isCompleted: true
        };
      } else {
        task.subTasks[subTaskIdx].isCompleted = !task.subTasks[subTaskIdx].isCompleted;
      }

      setTasks(updatedTasks);

      try {
        await axios.put(`http://localhost:5000/api/tasks/${taskId}/subtasks`, {
          subTasks: task.subTasks
        });
      } catch (err) {
        console.error('Failed to update sub-task:', err);
        setError('Failed to save status.');
      }
    }
  };

  // 🗑️ Delete task function
  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }

    const originalTasks = [...tasks];
    setTasks(tasks.filter(task => task._id !== taskId));

    try {
      await axios.delete(`http://localhost:5000/api/tasks/${taskId}`);
    } catch (err) {
      console.error('Task deletion failed:', err);
      setError(err.response?.data?.message || 'Could not delete task.');
      setTasks(originalTasks);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left side: Form */}
        <div className="lg:col-span-1 bg-slate-900 border border-slate-800 rounded-2xl p-6 h-fit shadow-xl">
          <h3 className="text-lg font-bold text-teal-400 mb-4 flex items-center gap-2">
            <span>➕</span> Add New Task
          </h3>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-3 rounded-xl text-center mb-4">
              {error}
            </div>
          )}
          
          <form onSubmit={handleCreateTask} className="space-y-4">
            <div>
              <label className="block text-slate-400 text-xs font-medium mb-1.5">Task Title</label>
              <input
                name="title"
                type="text"
                placeholder="e.g., Build a REST API"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-teal-500 text-sm transition-all"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-slate-400 text-xs font-medium mb-1.5">Description</label>
              <textarea
                name="description"
                placeholder="Brief description of the task..."
                value={taskDesc}
                onChange={(e) => setTaskDesc(e.target.value)}
                rows="3"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-teal-500 text-sm transition-all resize-none"
                required
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-teal-500 hover:bg-teal-600 text-slate-950 font-semibold py-2.5 rounded-xl text-sm shadow-lg shadow-teal-500/10 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <span className="animate-spin inline-block w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full"></span>
                  Processing with AI...
                </>
              ) : (
                '✨ Add Task with AI'
              )}
            </button>
          </form>
        </div>

        {/* Right side: Task Display */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-lg font-bold text-slate-300 flex items-center gap-2">
            <span>📋</span> All Your Tasks ({tasks.length})
          </h3>

          {tasks.length === 0 ? (
            <div className="bg-slate-900/50 border border-slate-800/60 rounded-2xl p-10 text-center border-dashed">
              <p className="text-slate-500 text-sm italic">No tasks added yet. Start using the form on the left!</p>
            </div>
          ) : (
            tasks.map((task) => (
              <div key={task._id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md hover:border-slate-700 transition-all">
                {/* Task title and delete button */}
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h4 className="text-base font-bold text-white tracking-wide">{task.title}</h4>
                    <p className="text-slate-400 text-xs mt-1">{task.description}</p>
                  </div>
                  
                  <button
                    onClick={() => handleDeleteTask(task._id)}
                    className="text-slate-500 hover:text-red-500 bg-slate-950/20 hover:bg-red-500/10 p-2 rounded-xl border border-slate-800/40 hover:border-red-500/20 active:scale-95 transition-all cursor-pointer group"
                    title="Delete Task"
                  >
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      strokeWidth={1.5} 
                      stroke="currentColor" 
                      className="w-4 h-4 transition-transform group-hover:scale-110"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                  </button>
                </div>
                
                {/* AI sub-task renderer */}
                {task.subTasks && task.subTasks.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-slate-800/60">
                    <h5 className="text-xs font-semibold text-teal-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      🤖 AI Generated Sub-tasks:
                    </h5>
                    <ul className="space-y-2">
                      {task.subTasks.map((sub, idx) => {
                        const isDone = typeof sub === 'string' ? false : sub.isCompleted;
                        const subText = typeof sub === 'string' ? sub : sub.text;

                        return (
                      <li key={idx} className="subtask-item flex items-center gap-2 text-xs text-slate-300 bg-slate-950/40 px-3 py-2 rounded-lg border border-slate-800/40">
                        <input 
                          type="checkbox" 
                          checked={isDone}
                          onChange={() => handleToggleSubTask(task._id, idx)}
                          className="accent-teal-500 rounded focus:ring-0 cursor-pointer w-4 h-4" 
                        />
                        <span className={isDone ? "line-through text-slate-500 transition-all" : "transition-all"}>
                          {subText}
                        </span>
                      </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}

export default Dashboard;