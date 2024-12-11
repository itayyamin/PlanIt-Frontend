// src/components/dashboard/Products.jsx
import React, { useState } from 'react';
import { Plus } from 'lucide-react';

const Products = () => {
    const [products, setProducts] = useState([
        { id: 1, name: 'Sample Product', owner: 'Jane Smith', category: 'Category A' }
    ]);
    const [newProduct, setNewProduct] = useState({ name: '', owner: '', category: '' });

    const addProduct = (e) => {
        e.preventDefault();
        if (newProduct.name && newProduct.owner) {
            setProducts([...products, { ...newProduct, id: products.length + 1 }]);
            setNewProduct({ name: '', owner: '', category: '' });
        }
    };

    return (
        <div>
            <form onSubmit={addProduct} className="mb-6 flex gap-4">
                <input
                    type="text"
                    placeholder="Product name"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    className="flex-1 rounded-md border p-2"
                />
                <input
                    type="text"
                    placeholder="Owner"
                    value={newProduct.owner}
                    onChange={(e) => setNewProduct({ ...newProduct, owner: e.target.value })}
                    className="w-48 rounded-md border p-2"
                />
                <input
                    type="text"
                    placeholder="Category"
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    className="w-48 rounded-md border p-2"
                />
                <button
                    type="submit"
                    className="flex items-center gap-2 rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                >
                    <Plus className="h-4 w-4" /> Add Product
                </button>
            </form>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                    <tr className="border-b">
                        <th className="pb-2 text-left">Name</th>
                        <th className="pb-2 text-left">Owner</th>
                        <th className="pb-2 text-left">Category</th>
                    </tr>
                    </thead>
                    <tbody>
                    {products.map(product => (
                        <tr key={product.id} className="border-b">
                            <td className="py-2">{product.name}</td>
                            <td className="py-2">{product.owner}</td>
                            <td className="py-2">{product.category}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Products;