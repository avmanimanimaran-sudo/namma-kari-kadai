'use client';

import { useEffect, useState } from 'react';
import api from '@/services/api';
import { Button } from '@/components/ui/Button';
import type { Order } from '@/types';

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/orders');
            let filtered = data.sort((a: Order, b: Order) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

            if (filter !== 'all') {
                filtered = filtered.filter((o: Order) => o.status.toLowerCase() === filter.toLowerCase());
            }

            if (data) setOrders(filtered);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [filter]);

    const updateStatus = async (id: string, status: string) => {
        try {
            await api.put(`/orders/${id}/status`, { status });
            fetchOrders();
        } catch (e) {
            console.error('Failed to update status', e);
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Order Management</h1>
                <div className="flex gap-4">
                    <Button variant="secondary" onClick={fetchOrders} size="sm">Refresh</Button>
                    <select
                        className="bg-surface border border-white/10 rounded-lg p-2 text-white"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    >
                        <option value="all">All Orders</option>
                        <option value="pending">Placed / Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="out for delivery">Out for Delivery</option>
                        <option value="delivered">Delivered / Completed</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>
            </div>

            <div className="space-y-4">
                {loading ? <p>Loading...</p> : orders.map((order) => (
                    <div key={order._id} className="bg-surface p-4 rounded-xl border border-white/5 flex flex-col md:flex-row gap-4">

                        <div className="flex-1">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h3 className="font-bold text-lg">#{order._id.slice(-6)} - {order.pickupDetails?.name || 'Guest'}</h3>
                                    <p className="text-sm text-gray-400">Time: {order.pickupDetails?.time} ({order.pickupDetails?.date})</p>
                                </div>
                                <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${order.status === 'Placed' ? 'bg-amber-500/20 text-amber-500' :
                                    order.status === 'Delivered' ? 'bg-green-500/20 text-green-500' :
                                        'bg-blue-500/20 text-blue-500'
                                    }`}>
                                    {order.status}
                                </div>
                            </div>

                            <div className="text-sm space-y-1 mb-4">
                                {order.orderItems.map((item, index) => (
                                    <div key={index}>
                                        • {item.qty}{item.unit} {item.name} ({item.cutType})
                                    </div>
                                ))}
                            </div>

                            <div className="flex gap-2">
                                {order.pickupDetails?.phone && (
                                    <>
                                        <a href={`tel:${order.pickupDetails.phone}`} className="bg-white/5 hover:bg-white/10 p-2 rounded-lg text-sm">
                                            📞 Call
                                        </a>
                                        <a href={`https://wa.me/91${order.pickupDetails.phone}`} target="_blank" className="bg-[#25D366]/20 text-[#25D366] p-2 rounded-lg text-sm">
                                            💬 WhatsApp
                                        </a>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-col gap-2 min-w-[150px]">
                            <div className="text-right font-bold text-xl mb-2">₹{order.totalPrice}</div>
                            {order.status === 'Placed' && (
                                <Button size="sm" onClick={() => updateStatus(order._id, 'Confirmed')}>Confirm Order</Button>
                            )}
                            {order.status === 'Confirmed' && (
                                <Button size="sm" onClick={() => updateStatus(order._id, 'Out for Delivery')}>Mark Ready/Out</Button>
                            )}
                            {order.status === 'Out for Delivery' && (
                                <Button size="sm" variant="secondary" onClick={() => updateStatus(order._id, 'Delivered')}>Complete</Button>
                            )}
                            {order.status !== 'Delivered' && order.status !== 'Cancelled' && (
                                <button className="text-xs text-red-400 mt-2 hover:underline" onClick={() => updateStatus(order._id, 'Cancelled')}>Cancel Order</button>
                            )}
                        </div>

                    </div>
                ))}
                {orders.length === 0 && !loading && <div className="text-center text-gray-400">No orders found.</div>}
            </div>
        </div>
    );
}
