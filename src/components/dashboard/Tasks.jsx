import React, { useState, useEffect } from 'react';
import { Plus, Edit2, X, Check, Trash2 } from 'lucide-react';
import {apiTaskService} from "../../services/tasksApi.js";


const Tasks = ({ projectId }) => {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState({ description: '', owner: '' });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingTask, setEditingTask] = useState(null);
    const [editForm, setEditForm] = useState({ description: '', owner: '' });

    useEffect(() => {
        if (projectId) {
            fetchTasks();
        }
    }, [projectId]);

    const fetchTasks = async () => {
        try {
            setIsLoading(true);
            const fetchedTasks = await apiTaskService.getTasks(projectId);
            setTasks(fetchedTasks);
            setError(null);
        } catch (err) {
            setError('Failed to fetch tasks');
            console.error('Error fetching tasks:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const deleteTask = async (taskId) => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            try {
                await apiTaskService.deleteTask(taskId);
                setTasks(tasks.filter(task => task.id !== taskId));
                setError(null);
            } catch (err) {
                setError('Failed to delete task');
                console.error('Error deleting task:', err);
            }
        }
    };

    const addTask = async (e) => {
        e.preventDefault();
        if (newTask.description && newTask.owner) {
            try {
                const createdTask = await apiTaskService.createTask(projectId, newTask);
                setTasks([...tasks, createdTask]);
                setNewTask({ description: '', owner: '' });
                setError(null);
            } catch (err) {
                setError('Failed to create task');
                console.error('Error creating task:', err);
            }
        }
    };

    const startEditing = (task) => {
        setEditingTask(task.id);
        setEditForm({ description: task.description, owner: task.owner });
    };

    const cancelEditing = () => {
        setEditingTask(null);
        setEditForm({ description: '', owner: '' });
    };

    const saveEdit = async (taskId) => {
        try {
            await apiTaskService.updateTask(taskId, editForm);
            setTasks(tasks.map(task =>
                task.id === taskId
                    ? { ...task, ...editForm }
                    : task
            ));
            setEditingTask(null);
            setEditForm({ description: '', owner: '' });
            setError(null);
        } catch (err) {
            setError('Failed to update task');
            console.error('Error updating task:', err);
        }
    };

    const toggleTaskCompletion = async (taskId) => {
        const task = tasks.find(t => t.id === taskId);
        if (task) {
            const newStatus = task.status === 'Completed' ? 'In Progress' : 'Completed';
            try {
                setTasks(tasks.map(t =>
                    t.id === taskId
                        ? { ...t, status: newStatus }
                        : t
                ));

                await apiTaskService.updateTask(taskId, { status: newStatus });
                //todo
                fetchTasks();
            } catch (err) {
                setError('Failed to update task');
                console.error('Error updating task:', err);
                fetchTasks();
            }
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div>
            {error && (
                <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
                    {error}
                </div>
            )}

            <form onSubmit={addTask} className="mb-6 flex gap-4">
                <input
                    type="text"
                    placeholder="Task description"
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    className="flex-1 rounded-md border p-2"
                />
                <input
                    type="text"
                    placeholder="Owner"
                    value={newTask.owner}
                    onChange={(e) => setNewTask({ ...newTask, owner: e.target.value })}
                    className="w-48 rounded-md border p-2"
                />
                <button
                    type="submit"
                    className="flex items-center gap-2 rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                >
                    <Plus className="h-4 w-4" /> Add Task
                </button>
            </form>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                    <tr className="border-b">
                        <th className="pb-2 text-left w-8"></th>
                        <th className="pb-2 text-left">Description</th>
                        <th className="pb-2 text-left">Owner</th>
                        <th className="pb-2 text-left">Status</th>
                        <th className="pb-2 text-left w-24">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {tasks.map(task => (
                        <tr key={task.id} className="border-b">
                            <td className="py-2">
                                <input
                                    type="checkbox"
                                    checked={task.status === 'Completed'}
                                    onChange={() => toggleTaskCompletion(task.id)}
                                    className="w-4 h-4 rounded border-gray-300"
                                />
                            </td>
                            <td className="py-2">
                                {editingTask === task.id ? (
                                    <input
                                        type="text"
                                        value={editForm.description}
                                        onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                        className="w-full rounded-md border p-1"
                                    />
                                ) : (
                                    <span className={task.status === 'Completed' ? 'line-through text-gray-500' : ''}>
                                            {task.description}
                                        </span>
                                )}
                            </td>
                            <td className="py-2">
                                {editingTask === task.id ? (
                                    <input
                                        type="text"
                                        value={editForm.owner}
                                        onChange={(e) => setEditForm({ ...editForm, owner: e.target.value })}
                                        className="w-full rounded-md border p-1"
                                    />
                                ) : (
                                    task.owner
                                )}
                            </td>
                            <td className="py-2">
                                    <span className={`px-2 py-1 rounded-full text-sm ${
                                        task.status === 'Completed'
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-blue-100 text-blue-800'
                                    }`}>
                                        {task.status}
                                    </span>
                            </td>
                            <td className="py-2">
                                {editingTask === task.id ? (
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => saveEdit(task.id)}
                                            className="p-1 text-green-600 hover:bg-green-50 rounded"
                                            title="Save"
                                        >
                                            <Check className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={cancelEditing}
                                            className="p-1 text-red-600 hover:bg-red-50 rounded"
                                            title="Cancel"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => startEditing(task)}
                                            className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                                            title="Edit"
                                        >
                                            <Edit2 className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => deleteTask(task.id)}
                                            className="p-1 text-red-600 hover:bg-red-50 rounded"
                                            title="Delete"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                )}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Tasks;