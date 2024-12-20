// services/tasksApi.js

const BASE_URL = import.meta.env.VITE_API_URL
const URL = BASE_URL+ '/tasks';

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
    };
};

export const apiTaskService = {
    async createTask(eventId, task) {
        const response = await fetch(`${URL}/events/${eventId}/tasks`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(task),
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to create task');
        }
        return response.json();
    },

    async getTasks(eventId) {
        const response = await fetch(`${URL}/events/${eventId}/tasks`, {
            headers: getAuthHeaders(),
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to fetch tasks');
        }
        return response.json();
    },

    async updateTask(taskId, updates) {
        const response = await fetch(`${URL}/tasks/${taskId}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(updates),
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to update task');
        }
        return response.json();
    },

    async deleteTask(taskId) {
        const response = await fetch(`${URL}/tasks/${taskId}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to delete task');
        }
        return response.json();
    },
};