'use client';

import { useEffect, useState } from 'react';
import api from '@/services/api';
import { Button } from '@/components/ui/Button';
import type { Product } from '@/types';

export default function AdminSettingsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const { data } = await api.get('/products');
            if (data) setProducts(data);
        } catch (e) {
            console.error(e);
        }
    };

    const updateProduct = async (id: string, updates: Partial<Product>) => {
        setLoading(true);
        try {
            await api.put(`/products/${id}`, updates);
            fetchProducts();
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl">
            <h1 className="text-2xl font-bold mb-6">Rates & Stock Control</h1>

            <div className="space-y-6">
                {products.map((product) => (
                    <div key={product._id} className="bg-surface p-6 rounded-2xl border border-white/5">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold capitalize">{product.name}</h2>
                            <div className={`px-2 py-1 rounded text-xs ${product.inStock ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                                {product.inStock ? 'Active' : 'Stock Out'}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 items-end">
                            <div>
                                <label className="text-sm text-gray-400 block mb-1">Price (₹)</label>
                                <div className="flex gap-2">
                                    <input
                                        type="number"
                                        defaultValue={product.price}
                                        className="bg-background border border-white/10 rounded-lg p-2 text-white w-full"
                                        id={`price-${product._id}`}
                                    />
                                    <Button
                                        size="sm"
                                        onClick={() => {
                                            const val = (document.getElementById(`price-${product._id}`) as HTMLInputElement).value;
                                            updateProduct(product._id, { price: Number(val) });
                                        }}
                                        isLoading={loading}
                                    >
                                        Save
                                    </Button>
                                </div>
                            </div>

                            <div>
                                <label className="text-sm text-gray-400 block mb-1">Availability</label>
                                <Button
                                    variant={product.inStock ? "outline" : "primary"}
                                    onClick={() => updateProduct(product._id, { inStock: !product.inStock })}
                                    className="w-full"
                                >
                                    {product.inStock ? 'Mark Out of Stock' : 'Mark In Stock'}
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-8 bg-surface p-6 rounded-2xl border border-white/5 opacity-50 cursor-not-allowed">
                <h3 className="font-bold mb-2">Shop Settings (Coming Soon)</h3>
                <p className="text-sm text-gray-400">Emergency Close, Holiday Mode, Banner Text.</p>
            </div>

        </div>
    );
}
