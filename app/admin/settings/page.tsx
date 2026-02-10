'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';

export default function AdminSettingsPage() {
    const [rates, setRates] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchRates();
    }, []);

    const fetchRates = async () => {
        const { data } = await supabase.from('rates').select('*').order('item_type');
        if (data) setRates(data);
    };

    const updateRate = async (id: string, newPrice: number) => {
        setLoading(true);
        await supabase.from('rates').update({ price_per_kg: newPrice }).eq('id', id);
        setLoading(false);
        fetchRates();
    };

    const toggleActive = async (id: string, current: boolean) => {
        await supabase.from('rates').update({ is_active: !current }).eq('id', id);
        fetchRates();
    };

    return (
        <div className="max-w-2xl">
            <h1 className="text-2xl font-bold mb-6">Rates & Stock Control</h1>

            <div className="space-y-6">
                {rates.map((rate) => (
                    <div key={rate.id} className="bg-surface p-6 rounded-2xl border border-white/5">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold capitalize">{rate.item_type} Chicken</h2>
                            <div className={`px-2 py-1 rounded text-xs ${rate.is_active ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                                {rate.is_active ? 'Active' : 'Hidden'}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 items-end">
                            <div>
                                <label className="text-sm text-gray-400 block mb-1">Price per Kg (₹)</label>
                                <div className="flex gap-2">
                                    <input
                                        type="number"
                                        defaultValue={rate.price_per_kg}
                                        className="bg-background border border-white/10 rounded-lg p-2 text-white w-full"
                                        id={`price-${rate.id}`}
                                    />
                                    <Button
                                        size="sm"
                                        onClick={() => {
                                            const val = (document.getElementById(`price-${rate.id}`) as HTMLInputElement).value;
                                            updateRate(rate.id, Number(val));
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
                                    variant={rate.is_active ? "outline" : "primary"}
                                    onClick={() => toggleActive(rate.id, rate.is_active)}
                                    className="w-full"
                                >
                                    {rate.is_active ? 'Disable Item' : 'Enable Item'}
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
