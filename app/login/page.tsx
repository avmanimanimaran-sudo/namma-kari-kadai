'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';

export default function LoginPage() {
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // We need to implement the actual API call here or inside AuthContext
            // For now, let's assume AuthContext's login handles it or we call API first
            const api = (await import('@/services/api')).default;
            const { data } = await api.post('/auth/login', { email, password });

            login({
                user: {
                    id: data._id,
                    name: data.name,
                    email: data.email,
                    role: data.role,
                    phone: '' // Adjust if backend sends phone
                },
                accessToken: data.token
            });
        } catch (err: any) {
            setError(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="card-glass w-full max-w-md p-8">
                <h1 className="text-2xl font-bold mb-6 text-center text-primary">Login</h1>

                {error && <div className="bg-red-500/20 text-red-500 p-3 rounded-lg mb-4 text-sm">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-surface border border-white/10 rounded-xl p-3 text-white"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-surface border border-white/10 rounded-xl p-3 text-white"
                            required
                        />
                    </div>
                    <Button type="submit" className="w-full" isLoading={loading}>
                        Sign In
                    </Button>
                </form>

                <div className="mt-4 text-center text-sm text-gray-400">
                    Don't have an account? <Link href="/signup" className="text-primary hover:underline">Sign Up</Link>
                </div>
            </div>
        </div>
    );
}
