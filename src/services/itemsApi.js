// services/itemsApi.js
const API_URL = 'http://127.0.0.1:8000/api/items';

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
    };
};

export const apiItemService = {
    async createItem(eventId, item) {
        const response = await fetch(`${API_URL}/events/${eventId}/items`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(item),
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to create item');
        }
        return response.json();
    },

    async getItems(eventId) {
        const response = await fetch(`${API_URL}/events/${eventId}/items`, {
            headers: getAuthHeaders(),
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to fetch items');
        }
        return response.json();
    },

    async updateItem(itemId, updates) {
        const response = await fetch(`${API_URL}/items/${itemId}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(updates),
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to update item');
        }
        return response.json();
    },

    async deleteItem(itemId) {
        const response = await fetch(`${API_URL}/items/${itemId}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to delete item');
        }
        return response.json();
    },
};