'use client';

import { Suspense, useState, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { useCart } from '@/components/features/CartProvider';

const CUT_TYPES = [
    { id: 'full', label: 'Full Chicken (With Skin)', icon: '🐓' },
    { id: 'curry', label: 'Curry Cut (Medium)', icon: '🥘' },
    { id: 'biryani', label: 'Biryani Cut (Large)', icon: '🍗' },
    { id: 'boneless', label: 'Boneless (Cube)', icon: '🍖' },
];

function OrderContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const type = searchParams.get('type') as 'broiler' | 'country' || 'broiler';
    const price = Number(searchParams.get('price')) || 240;

    const { addToCart } = useCart();

    const [quantity, setQuantity] = useState(1);
    const [unit, setUnit] = useState<'kg' | 'pieces'>('kg');
    const [cutType, setCutType] = useState('curry');
    const [notes, setNotes] = useState('');

    const totalPrice = useMemo(() => {
        return price * quantity;
    }, [price, quantity]);

    const handleAddToCart = () => {
        const itemId = `${type}-${cutType}-${unit}`;
        addToCart({
            id: itemId,
            itemType: type,
            cutType,
            quantity,
            unit,
            price: price
        });
        router.push('/checkout');
    };

    return (
        <div className="min-h-screen p-4 max-w-md mx-auto pb-24">
            <header className="mb-6 flex items-center">
                <button onClick={() => router.back()} className="mr-4 text-2xl">←</button>
                <h1 className="text-xl font-bold capitalize">{type} Chicken Order</h1>
            </header>

            {/* Quantity Selection */}
            <section className="mb-8">
                <label className="text-sm text-gray-400 mb-2 block">Quantity (Kg)</label>
                <div className="flex items-center gap-4 bg-surface p-2 rounded-xl border border-white/10">
                    <button
                        onClick={() => setQuantity(Math.max(0.5, quantity - 0.5))}
                        className="w-12 h-12 bg-white/5 rounded-lg text-2xl"
                    >-</button>
                    <div className="flex-1 text-center">
                        <span className="text-3xl font-bold">{quantity}</span>
                        <span className="text-sm text-gray-400 ml-1">kg</span>
                    </div>
                    <button
                        onClick={() => setQuantity(quantity + 0.5)}
                        className="w-12 h-12 bg-primary/20 text-primary rounded-lg text-2xl"
                    >+</button>
                </div>
            </section>

            {/* Cut Selection */}
            <section className="mb-8">
                <label className="text-sm text-gray-400 mb-2 block">Cut Type (Vettu Vakai)</label>
                <div className="grid grid-cols-2 gap-3">
                    {CUT_TYPES.map((cut) => (
                        <button
                            key={cut.id}
                            onClick={() => setCutType(cut.id)}
                            className={`p-4 rounded-xl border text-left transition-all ${cutType === cut.id
                                    ? 'bg-primary/20 border-primary text-white'
                                    : 'bg-surface border-white/5 text-gray-400 hover:bg-surface/80'
                                }`}
                        >
                            <div className="text-2xl mb-1">{cut.icon}</div>
                            <div className="font-medium text-sm">{cut.label}</div>
                        </button>
                    ))}
                </div>
            </section>

            {/* Notes */}
            <section className="mb-8">
                <label className="text-sm text-gray-400 mb-2 block">Special Instructions (Optional)</label>
                <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Eg: Spicy cut, clean well..."
                    className="w-full bg-surface border border-white/10 rounded-xl p-4 text-white placeholder-gray-600 focus:border-primary outline-none min-h-[100px]"
                />
            </section>

            {/* Footer Action */}
            <div className="fixed bottom-0 left-0 w-full bg-background/95 backdrop-blur-lg border-t border-white/10 p-4">
                <div className="max-w-md mx-auto flex items-center justify-between gap-4">
                    <div>
                        <div className="text-sm text-gray-400">Total</div>
                        <div className="text-2xl font-bold text-primary">₹{totalPrice}</div>
                    </div>
                    <Button onClick={handleAddToCart} className="flex-1" size="lg">
                        Add to Order
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default function OrderPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <OrderContent />
        </Suspense>
    );
}
