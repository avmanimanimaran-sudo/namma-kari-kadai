'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        todayOrders: 0,
        pendingOrders: 0,
        totalRevenue: 0,
    });

    useEffect(() => {
        async function fetchStats() {
            const today = new Date().toISOString().split('T')[0];

            const { data: orders, error } = await supabase
                .from('orders')
                .select('*')
                .gte('created_at', `${today}T00:00:00`);

            if (orders) {
                setStats({
                    todayOrders: orders.length,
                    pendingOrders: orders.filter(o => o.status === 'pending').length,
                    totalRevenue: orders.reduce((sum, o) => sum + Number(o.total_amount), 0),
                });
            }
        }
        fetchStats();
    }, []);

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Card 1 */}
                <div className="bg-surface p-6 rounded-2xl border border-white/5">
                    <div className="text-gray-400 mb-2">Today's Orders</div>
                    <div className="text-4xl font-bold">{stats.todayOrders}</div>
                </div>

                {/* Card 2 */}
                <div className="bg-surface p-6 rounded-2xl border border-white/5">
                    <div className="text-gray-400 mb-2">Pending Actions</div>
                    <div className="text-4xl font-bold text-amber-400">{stats.pendingOrders}</div>
                </div>

                {/* Card 3 */}
                <div className="bg-surface p-6 rounded-2xl border border-white/5">
                    <div className="text-gray-400 mb-2">Today's Revenue</div>
                    <div className="text-4xl font-bold text-green-400">₹{stats.totalRevenue}</div>
                </div>
            </div>
        </div>
    );
}
