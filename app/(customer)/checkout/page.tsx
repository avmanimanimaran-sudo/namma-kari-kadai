'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/components/features/CartProvider';
import { Button } from '@/components/ui/Button';
import { supabase } from '@/lib/supabase/client';

const TIME_SLOTS = [
    'Morning 7AM - 9AM',
    'Morning 9AM - 11AM',
    'Noon 11AM - 1PM',
    'Afternoon 1PM - 4PM',
    'Evening 4PM - 7PM',
    'Evening 7PM - 9PM',
];

export default function CheckoutPage() {
    const router = useRouter();
    const { items, totalAmount, clearCart } = useCart();

    // Form State
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [pickupDate, setPickupDate] = useState(new Date().toISOString().split('T')[0]);
    const [pickupTime, setPickupTime] = useState(TIME_SLOTS[0]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (items.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
                <h2 className="text-xl font-bold mb-4">Your cart is empty</h2>
                <Button onClick={() => router.push('/')}>Go Home</Button>
            </div>
        );
    }

    const handlePlaceOrder = async () => {
        if (!name || !phone) {
            alert('Please fill in Name and Phone Number');
            return;
        }

        setIsSubmitting(true);

        try {
            // 1. Save to Supabase
            // 1. Generate ID Client Side (Bypass RLS Select issue)
            const orderId = crypto.randomUUID();

            // 2. Save to Supabase
            const { error: orderError } = await supabase
                .from('orders')
                .insert({
                    id: orderId,
                    name: name,
                    phone: phone,
                    date: pickupDate,
                    time: pickupTime,
                    payment_method: 'cash'
                });

            if (orderError) {
                console.error('Supabase Order Insert Error:', orderError);
                throw orderError;
            }

            // 3. Save items
            const orderItems = items.map(item => ({
                order_id: orderId,
                item_type: item.itemType,
                cut_type: item.cutType,
                quantity: item.quantity,
                unit: item.unit,
                price_at_time: item.price
            }));

            const { error: itemsError } = await supabase
                .from('order_items')
                .insert(orderItems);

            if (itemsError) {
                console.error('Supabase Order Items Insert Error:', itemsError);
                throw itemsError;
            }

            // 3. Generate WhatsApp Message
            const itemDetails = items.map(i => `${i.itemType} (${i.quantity}${i.unit}, ${i.cutType})`).join(', ');
            const message = encodeURIComponent(
                `🍗 *New Order: #${orderId.slice(0, 4)}*\n\n` +
                `Customer: ${name} (${phone})\n` +
                `Items: ${itemDetails}\n` +
                `Total: ₹${totalAmount}\n` +
                `Pickup: ${pickupDate} @ ${pickupTime}\n\n` +
                `Namma Kari Kadai`
            );

            // 4. Redirect to Success / WhatsApp
            clearCart();

            // Open WhatsApp (User's choice usually, but for this flow we can open it)
            // Here we go to success page first
            router.push(`/order/success?id=${orderId}&wa=${message}`);

        } catch (e) {
            console.error('Order failed', e);
            alert('Failed to place order. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen p-4 max-w-md mx-auto pb-24">
            <header className="mb-6 flex items-center">
                <button onClick={() => router.back()} className="mr-4 text-2xl">←</button>
                <h1 className="text-xl font-bold">Checkout</h1>
            </header>

            {/* Order Summary */}
            <section className="mb-8 bg-surface p-4 rounded-xl border border-white/5">
                <h3 className="text-sm text-gray-400 mb-2 border-b border-white/10 pb-2">Order Summary</h3>
                {items.map((item) => (
                    <div key={item.id} className="flex justify-between py-2 text-sm">
                        <div>
                            <span className="font-bold capitalize">{item.itemType}</span>
                            <span className="text-gray-400 ml-2">{item.quantity}{item.unit} | {item.cutType}</span>
                        </div>
                        <div>₹{item.price * item.quantity}</div>
                    </div>
                ))}
                <div className="flex justify-between mt-4 pt-2 border-t border-white/10 font-bold text-lg">
                    <span>Total To Pay</span>
                    <span>₹{totalAmount}</span>
                </div>
            </section>

            {/* Pickup Details */}
            <section className="mb-8 space-y-4">
                <h3 className="text-lg font-bold">Pickup Details</h3>

                <div>
                    <label className="text-sm text-gray-400 block mb-1">Your Name</label>
                    <input
                        type="text"
                        className="w-full bg-surface border border-white/10 rounded-xl p-3 text-white"
                        placeholder="Enter your name"
                        value={name}
                        onChange={e => setName(e.target.value)}
                    />
                </div>

                <div>
                    <label className="text-sm text-gray-400 block mb-1">Phone Number</label>
                    <input
                        type="tel"
                        className="w-full bg-surface border border-white/10 rounded-xl p-3 text-white"
                        placeholder="9876543210"
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm text-gray-400 block mb-1">Date</label>
                        <input
                            type="date"
                            className="w-full bg-surface border border-white/10 rounded-xl p-3 text-white"
                            value={pickupDate}
                            onChange={e => setPickupDate(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="text-sm text-gray-400 block mb-1">Time</label>
                        <select
                            className="w-full bg-surface border border-white/10 rounded-xl p-3 text-white appearance-none"
                            value={pickupTime}
                            onChange={e => setPickupTime(e.target.value)}
                        >
                            {TIME_SLOTS.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                    </div>
                </div>
            </section>

            {/* Payment Method (Simple for now) */}
            <section className="mb-8">
                <h3 className="text-lg font-bold mb-2">Payment Method</h3>
                <div className="flex gap-4">
                    <button className="flex-1 bg-primary/20 border border-primary text-white p-3 rounded-xl font-bold">
                        Cash on Pickup
                    </button>
                    <button className="flex-1 bg-surface border border-white/10 text-gray-400 p-3 rounded-xl hover:bg-surface/80">
                        UPI (Coming Soon)
                    </button>
                </div>
            </section>

            {/* Order Button */}
            <div className="fixed bottom-0 left-0 w-full bg-background/95 backdrop-blur-lg border-t border-white/10 p-4">
                <div className="max-w-md mx-auto">
                    <Button
                        onClick={handlePlaceOrder}
                        className="w-full"
                        size="lg"
                        isLoading={isSubmitting}
                    >
                        Confirm Order & WhatsApp
                    </Button>
                </div>
            </div>
        </div>
    );
}
