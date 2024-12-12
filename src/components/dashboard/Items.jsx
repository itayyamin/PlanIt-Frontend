import React, { useState, useEffect } from 'react';
import { Plus, Edit2, X, Check, Trash2 } from 'lucide-react';
import { apiItemService } from "../../services/itemsApi";

const Items = ({ projectId }) => {
    const [items, setItems] = useState([]);
    const [newItem, setNewItem] = useState({ name: '', quantity: '', price: '', owner: '' });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingItem, setEditingItem] = useState(null);
    const [editForm, setEditForm] = useState({ name: '', quantity: '', price: '', owner: '' });

    useEffect(() => {
        if (projectId) {
            fetchItems();
        }
    }, [projectId]);

    const fetchItems = async () => {
        try {
            setIsLoading(true);
            const fetchedItems = await apiItemService.getItems(projectId);
            setItems(fetchedItems);
            setError(null);
        } catch (err) {
            setError('Failed to fetch items');
            console.error('Error fetching items:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const addItem = async (e) => {
        e.preventDefault();
        if (newItem.name && newItem.quantity && newItem.price && newItem.owner) {
            try {
                const createdItem = await apiItemService.createItem(projectId, {
                    ...newItem,
                    quantity: parseInt(newItem.quantity),
                    price: parseFloat(newItem.price)
                });
                setItems([...items, createdItem]);
                setNewItem({ name: '', quantity: '', price: '', owner: '' });
                setError(null);
            } catch (err) {
                setError('Failed to create item');
                console.error('Error creating item:', err);
            }
        }
    };

    const startEditing = (item) => {
        setEditingItem(item.id);
        setEditForm({
            name: item.name,
            quantity: item.quantity.toString(),
            price: item.price.toString(),
            owner: item.owner
        });
    };

    const cancelEditing = () => {
        setEditingItem(null);
        setEditForm({ name: '', quantity: '', price: '', owner: '' });
    };

    const saveEdit = async (itemId) => {
        try {
            const updatedItem = await apiItemService.updateItem(itemId, {
                ...editForm,
                quantity: parseInt(editForm.quantity),
                price: parseFloat(editForm.price)
            });
            setItems(items.map(item =>
                item.id === itemId ? updatedItem : item
            ));
            setEditingItem(null);
            setEditForm({ name: '', quantity: '', price: '', owner: '' });
            setError(null);
        } catch (err) {
            setError('Failed to update item');
            console.error('Error updating item:', err);
        }
    };

    const deleteItem = async (itemId) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            try {
                await apiItemService.deleteItem(itemId);
                setItems(items.filter(item => item.id !== itemId));
                setError(null);
            } catch (err) {
                setError('Failed to delete item');
                console.error('Error deleting item:', err);
            }
        }
    };

    const toggleItemCompletion = async (itemId) => {
        const item = items.find(i => i.id === itemId);
        if (item) {
            const newStatus = item.status === 'Completed' ? 'Pending' : 'Completed';
            try {
                await apiItemService.updateItem(itemId, { status: newStatus });
                setItems(items.map(i =>
                    i.id === itemId ? { ...i, status: newStatus } : i
                ));
            } catch (err) {
                setError('Failed to update item status');
                console.error('Error updating item status:', err);
            }
        }
    };

    if (isLoading) {
        return <div className="flex justify-center items-center p-4">Loading items...</div>;
    }

    return (
        <div>
            {error && (
                <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
                    {error}
                </div>
            )}

            <form onSubmit={addItem} className="mb-6 flex gap-4">
                <input
                    type="text"
                    placeholder="Item name"
                    value={newItem.name}
                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                    className="flex-1 rounded-md border p-2"
                />
                <input
                    type="number"
                    placeholder="Quantity"
                    value={newItem.quantity}
                    onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
                    className="w-24 rounded-md border p-2"
                />
                <input
                    type="number"
                    step="0.01"
                    placeholder="Price"
                    value={newItem.price}
                    onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                    className="w-24 rounded-md border p-2"
                />
                <input
                    type="text"
                    placeholder="Owner"
                    value={newItem.owner}
                    onChange={(e) => setNewItem({ ...newItem, owner: e.target.value })}
                    className="w-48 rounded-md border p-2"
                />
                <button
                    type="submit"
                    className="flex items-center gap-2 rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                >
                    <Plus className="h-4 w-4" /> Add Item
                </button>
            </form>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                    <tr className="border-b">
                        <th className="pb-2 text-left w-8"></th>
                        <th className="pb-2 text-left">Name</th>
                        <th className="pb-2 text-left">Quantity</th>
                        <th className="pb-2 text-left">Price</th>
                        <th className="pb-2 text-left">Owner</th>
                        <th className="pb-2 text-left">Status</th>
                        <th className="pb-2 text-left w-24">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {items.map(item => (
                        <tr key={item.id} className="border-b">
                            <td className="py-2">
                                <input
                                    type="checkbox"
                                    checked={item.status === 'Completed'}
                                    onChange={() => toggleItemCompletion(item.id)}
                                    className="w-4 h-4 rounded border-gray-300"
                                />
                            </td>
                            <td className="py-2">
                                {editingItem === item.id ? (
                                    <input
                                        type="text"
                                        value={editForm.name}
                                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                        className="w-full rounded-md border p-1"
                                    />
                                ) : (
                                    <span className={item.status === 'Completed' ? 'line-through text-gray-500' : ''}>
                                            {item.name}
                                        </span>
                                )}
                            </td>
                            <td className="py-2">
                                {editingItem === item.id ? (
                                    <input
                                        type="number"
                                        value={editForm.quantity}
                                        onChange={(e) => setEditForm({ ...editForm, quantity: e.target.value })}
                                        className="w-20 rounded-md border p-1"
                                    />
                                ) : (
                                    item.quantity
                                )}
                            </td>
                            <td className="py-2">
                                {editingItem === item.id ? (
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={editForm.price}
                                        onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                                        className="w-20 rounded-md border p-1"
                                    />
                                ) : (
                                    `$${item.price.toFixed(2)}`
                                )}
                            </td>
                            <td className="py-2">
                                {editingItem === item.id ? (
                                    <input
                                        type="text"
                                        value={editForm.owner}
                                        onChange={(e) => setEditForm({ ...editForm, owner: e.target.value })}
                                        className="w-full rounded-md border p-1"
                                    />
                                ) : (
                                    item.owner
                                )}
                            </td>
                            <td className="py-2">
                                    <span className={`px-2 py-1 rounded-full text-sm ${
                                        item.status === 'Completed'
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-blue-100 text-blue-800'
                                    }`}>
                                        {item.status}
                                    </span>
                            </td>
                            <td className="py-2">
                                {editingItem === item.id ? (
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => saveEdit(item.id)}
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
                                            onClick={() => startEditing(item)}
                                            className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                                            title="Edit"
                                        >
                                            <Edit2 className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => deleteItem(item.id)}
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

export default Items;