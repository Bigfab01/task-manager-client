import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState('');
    const [editingTaskId, setEditingTaskId] = useState(null); // To track which task is being edited
    const [editedTask, setEditedTask] = useState(''); // To store edited task value
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/tasks', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                setTasks(response.data);
            } catch (err) {
                console.error(err);
                navigate('/login');  // If there's an error, navigate to the login page
            }
        };

        if (!localStorage.getItem('token')) {
            navigate('/login');  // Redirect to login if there's no token in localStorage
        } else {
            fetchTasks();
        }
    }, [navigate]);

    const handleAddTask = async () => {
        try {
            const response = await axios.post('http://localhost:5000/api/tasks', { task: newTask }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setTasks([...tasks, response.data]);
            setNewTask('');
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeleteTask = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/tasks/${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setTasks(tasks.filter((task) => task._id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    const handleToggleComplete = async (id) => {
        try {
            await axios.patch(`http://localhost:5000/api/tasks/${id}`, {}, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setTasks(tasks.map((task) =>
                task._id === id ? { ...task, completed: !task.completed } : task
            ));
        } catch (err) {
            console.error(err);
        }
    };

    const handleEditTask = async (id) => {
        try {
            // Update the task on the server
            const response = await axios.patch(`http://localhost:5000/api/tasks/${id}`, { task: editedTask }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            
            // Update the task in the local state
            setTasks(tasks.map(task =>
                task._id === id ? { ...task, task: editedTask } : task
            ));

            // Clear the editing state
            setEditingTaskId(null);
            setEditedTask('');
        } catch (err) {
            console.error(err);
        }
    };

    const handleLogout = () => {
        // Remove the token from localStorage
        localStorage.removeItem('token');
        // Redirect to login page
        navigate('/');
    };

    return (
        <div className="max-w-3xl mx-auto mt-10">
            <h2 className="text-2xl font-bold mb-6">Task Manager</h2>
            <div className="flex justify-between mb-6">
                <button 
                    onClick={handleLogout}
                    className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                >
                    Logout
                </button>
                <div className="flex mb-6">
                    <input
                        type="text"
                        value={newTask}
                        onChange={(e) => setNewTask(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        placeholder="Add a new task..."
                    />
                    <button onClick={handleAddTask} className="ml-4 p-2 bg-blue-500 text-white rounded-md">Add Task</button>
                </div>
            </div>
            <ul>
                {tasks.map((task) => (
                    <li key={task._id} className="flex items-center justify-between mb-4">
                        {/* Check if the task is being edited */}
                        {editingTaskId === task._id ? (
                            <div className="flex items-center space-x-4">
                                <input
                                    type="text"
                                    value={editedTask}
                                    onChange={(e) => setEditedTask(e.target.value)}
                                    className="p-2 border border-gray-300 rounded-md"
                                />
                                <button
                                    onClick={() => handleEditTask(task._id)}
                                    className="bg-green-500 text-white p-2 rounded-md"
                                >
                                    Save
                                </button>
                                <button
                                    onClick={() => setEditingTaskId(null)}
                                    className="bg-gray-500 text-white p-2 rounded-md"
                                >
                                    Cancel
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <span className={`text-lg ${task.completed ? 'line-through text-gray-500' : ''}`}>
                                    {task.task}
                                </span>
                                <button onClick={() => handleToggleComplete(task._id)} className="mr-2 text-green-500">
                                    {task.completed ? 'Undo' : 'Complete'}
                                </button>
                                <button
                                    onClick={() => handleDeleteTask(task._id)}
                                    className="text-red-500"
                                >
                                    Delete
                                </button>
                                <button
                                    onClick={() => {
                                        setEditingTaskId(task._id);
                                        setEditedTask(task.task);  // Set the current task text in the input field
                                    }}
                                    className="text-blue-500"
                                >
                                    Edit
                                </button>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Dashboard;
