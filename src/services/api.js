// src/services/api.js

const BASE_URL = import.meta.env.VITE_API_URL
const URL = BASE_URL;

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
    };
};

export const apiService = {
    // Auth endpoints
    async login(credentials) {
        try {
            console.log("URL: ",URL)
            console.log("Import: ",BASE_URL)
            const response = await fetch(`${URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Login failed');
            }

            return response.json();
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    },

    async getUserDetails(userId) {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }

            const response = await fetch(`${URL}/users/${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to fetch user details');
            }

            const data = await response.json();
            return data.user;
        } catch (error) {
            console.error('Error fetching user details:', error);
            throw error;
        }
    },

    async get_user_events() {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }

            const response = await fetch(`${URL}/events/my-events`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to fetch events');
            }

            const data = await response.json();
            return data.events; // Returns the array of events directly

        } catch (error) {
            console.error('Error fetching events:', error);
            throw error;
        }
    },

    async getEventDetails(eventId) {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }

            const response = await fetch(`${URL}/events/get-event-id/${eventId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                //credentials: 'include' // Add this if using cookies
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to fetch event details');
            }

            const data = await response.json();
            return data.event;

        } catch (error) {
            console.error('Error fetching event details:', error);
            throw error;
        }
    },


    async register(userData) {
        try {
            const response = await fetch(`${URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Registration failed');
            }

            return response.json();
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    },

    // Protected endpoints
    async getTasks() {
        const response = await fetch(`${URL}/tasks`, {
            headers: getAuthHeaders(),
        });
        if (!response.ok) throw new Error('Failed to fetch tasks');
        return response.json();
    },

    async createTask(task) {
        const response = await fetch(`${URL}/tasks`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(task),
        });
        if (!response.ok) throw new Error('Failed to create task');
        return response.json();
    },

    async updateTask(taskId, task) {
        const response = await fetch(`${URL}/tasks/${taskId}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(task),
        });
        if (!response.ok) throw new Error('Failed to update task');
        return response.json();
    },

    async deleteTask(taskId) {
        const response = await fetch(`${URL}/tasks/${taskId}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
        });
        if (!response.ok) throw new Error('Failed to delete task');
        return response.json();
    }
};