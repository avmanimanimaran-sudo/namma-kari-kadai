'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';

function SuccessContent() {
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const wa = searchParams.get('wa'); // Encoded message

    const shopPhone = '919789723104'; // Shop Owner Real Number

    const handleWhatsApp = () => {
        window.open(`https://wa.me/${shopPhone}?text=${wa}`, '_blank');
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-green-500/20 to-transparent -z-10" />

            <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center text-5xl mb-6 shadow-xl shadow-green-500/30 animate-bounce">
                ✅
            </div>

            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-white mb-2">
                Order Placed!
            </h1>
            <p className="text-gray-300 mb-8">
                Order ID: <span className="font-mono bg-white/10 px-2 py-1 rounded">{id?.slice(0, 8)}</span>
            </p>

            <div className="card-glass p-6 w-full mb-8 space-y-4">
                <p className="text-sm text-gray-300">
                    Your order has been sent to the shop. Please disable popup blocker if WhatsApp didn't open.
                </p>
            </div>

            <Button
                onClick={handleWhatsApp}
                className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white font-bold mb-4"
                size="lg"
            >
                Open WhatsApp Confirmation
            </Button>

            <Button variant="ghost" onClick={() => window.location.href = '/'}>
                Back to Home
            </Button>
        </div>
    );
}

export default function OrderSuccessPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <SuccessContent />
        </Suspense>
    );
}
