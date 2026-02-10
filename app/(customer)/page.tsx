'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { supabase } from '@/lib/supabase/client';
import type { Rate } from '@/types';

export default function HomePage() {
  const [rates, setRates] = useState<Rate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRates() {
      try {
        const { data, error } = await supabase
          .from('rates')
          .select('*')
          .eq('is_active', true);

        if (data) setRates(data);
      } catch (e) {
        console.error('Error fetching rates', e);
      } finally {
        setLoading(false);
      }
    }
    fetchRates();
  }, []);

  const broilerPrice = rates.find(r => r.item_type === 'broiler')?.price_per_kg || 240;
  const countryPrice = rates.find(r => r.item_type === 'country')?.price_per_kg || 650;

  return (
    <main className="min-h-screen pb-20 p-4 max-w-md mx-auto relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-primary/20 to-transparent -z-10" />

      {/* Header */}
      <header className="flex justify-between items-center mb-8 pt-4">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-white">
            Namma <br /> Kari Kadai
          </h1>
          <p className="text-sm text-gray-400">Fresh Chicken, Daily.</p>
        </div>
        <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
          🍗
        </div>
      </header>

      {/* Today's Rates */}
      <section className="space-y-4 mb-8">
        <h2 className="text-xl font-semibold text-white/90">Indraiya Vilai (Today's Price)</h2>

        {/* Broiler Card */}
        <div className="card-glass p-6 relative overflow-hidden group">
          <div className="absolute right-0 top-0 p-4 opacity-10 text-6xl rotate-12 group-hover:rotate-0 transition-all">🐓</div>
          <h3 className="text-lg text-gray-300">Broiler Chicken</h3>
          <div className="flex items-baseline mt-2">
            <span className="text-4xl font-bold text-white">₹{broilerPrice}</span>
            <span className="text-sm text-gray-400 ml-2">/ kg</span>
          </div>
          <Button
            className="mt-4 w-full"
            variant="primary"
            onClick={() => window.location.href = `/order?type=broiler&price=${broilerPrice}`}
          >
            Order Broiler
          </Button>
        </div>

        {/* Country Card */}
        <div className="card-glass p-6 relative overflow-hidden group border-amber-500/30">
          <div className="absolute right-0 top-0 p-4 opacity-10 text-6xl rotate-12 group-hover:rotate-0 transition-all">🐔</div>
          <h3 className="text-lg text-amber-200">Naatu Kozhi (Country)</h3>
          <div className="flex items-baseline mt-2">
            <span className="text-4xl font-bold text-white">₹{countryPrice}</span>
            <span className="text-sm text-gray-400 ml-2">/ kg</span>
          </div>
          <Button
            className="mt-4 w-full bg-amber-600 hover:bg-amber-700 text-white"
            onClick={() => window.location.href = `/order?type=country&price=${countryPrice}`}
          >
            Order Naatu Kozhi
          </Button>
        </div>
      </section>

      {/* Features / Info */}
      <section className="grid grid-cols-2 gap-4 mb-24">
        <div className="bg-surface/50 p-4 rounded-xl text-center">
          <div className="text-2xl mb-2">⚡</div>
          <p className="text-sm text-gray-300">Fast Pickup</p>
        </div>
        <div className="bg-surface/50 p-4 rounded-xl text-center">
          <div className="text-2xl mb-2">✂️</div>
          <p className="text-sm text-gray-300">Clean Cuts</p>
        </div>
      </section>

      {/* Bottom Nav Placeholder (to be implemented later) */}
      <nav className="fixed bottom-4 left-4 right-4 bg-surface/90 backdrop-blur-lg p-4 rounded-2xl flex justify-around items-center border border-white/10 shadow-2xl z-50">
        <button className="flex flex-col items-center text-primary">
          <span className="text-xl">🏠</span>
          <span className="text-xs">Home</span>
        </button>
        <button className="flex flex-col items-center text-gray-400">
          <span className="text-xl">📋</span>
          <span className="text-xs">Orders</span>
        </button>
        <button className="flex flex-col items-center text-gray-400">
          <span className="text-xl">👤</span>
          <span className="text-xs">Profile</span>
        </button>
      </nav>

    </main>
  );
}
