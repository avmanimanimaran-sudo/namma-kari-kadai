'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import type { Order } from '@/types';

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    const fetchOrders = async () => {
        setLoading(true);
        let query = supabase
            .from('orders')
            .select('*, order_items(*)')
            .order('created_at', { ascending: false });

        if (filter !== 'all') {
            query = query.eq('status', filter);
        }

        const { data } = await query;
        if (data) setOrders(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchOrders();

        // Realtime subscription
        const channel = supabase
            .channel('orders_realtime')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
                fetchOrders(); // Refresh on any change
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [filter]);

    const updateStatus = async (id: string, status: string) => {
        await supabase.from('orders').update({ status }).eq('id', id);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Order Management</h1>
                <select
                    className="bg-surface border border-white/10 rounded-lg p-2 text-white"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                >
                    <option value="all">All Orders</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="ready">Ready</option>
                    <option value="completed">Completed</option>
                </select>
            </div>

            <div className="space-y-4">
                {loading ? <p>Loading...</p> : orders.map((order) => (
                    <div key={order.id} className="bg-surface p-4 rounded-xl border border-white/5 flex flex-col md:flex-row gap-4">

                        <div className="flex-1">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h3 className="font-bold text-lg">#{order.id.slice(0, 4)} - {order.guest_name}</h3>
                                    <p className="text-sm text-gray-400">Time: {order.pickup_time_slot}</p>
                                </div>
                                <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${order.status === 'pending' ? 'bg-amber-500/20 text-amber-500' :
                                        order.status === 'completed' ? 'bg-green-500/20 text-green-500' :
                                            'bg-blue-500/20 text-blue-500'
                                    }`}>
                                    {order.status}
                                </div>
                            </div>

                            <div className="text-sm space-y-1 mb-4">
                                {order.order_items.map((item: any) => (
                                    <div key={item.id}>
                                        • {item.quantity}{item.unit} {item.item_type} ({item.cut_type})
                                    </div>
                                ))}
                            </div>

                            <div className="flex gap-2">
                                <a href={`tel:${order.guest_phone}`} className="bg-white/5 hover:bg-white/10 p-2 rounded-lg text-sm">
                                    📞 Call
                                </a>
                                <a href={`https://wa.me/91${order.guest_phone}`} target="_blank" className="bg-[#25D366]/20 text-[#25D366] p-2 rounded-lg text-sm">
                                    💬 WhatsApp
                                </a>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2 min-w-[150px]">
                            <div className="text-right font-bold text-xl mb-2">₹{order.total_amount}</div>
                            {order.status === 'pending' && (
                                <Button size="sm" onClick={() => updateStatus(order.id, 'confirmed')}>Confirm Order</Button>
                            )}
                            {order.status === 'confirmed' && (
                                <Button size="sm" onClick={() => updateStatus(order.id, 'ready')}>Mark Ready</Button>
                            )}
                            {order.status === 'ready' && (
                                <Button size="sm" variant="secondary" onClick={() => updateStatus(order.id, 'completed')}>Complete</Button>
                            )}
                        </div>

                    </div>
                ))}
                {orders.length === 0 && !loading && <div className="text-center text-gray-400">No orders found.</div>}
            </div>
        </div>
    );
}
