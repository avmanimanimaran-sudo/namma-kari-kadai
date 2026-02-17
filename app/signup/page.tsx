'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';

export default function SignupPage() {
    const { login } = useAuth();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const api = (await import('@/services/api')).default;
            // Adjusted to match AuthController signup expectations
            const { data } = await api.post('/auth/signup', { name, email, password, phone });

            login({
                user: {
                    id: data._id,
                    name: data.name,
                    email: data.email,
                    role: data.role,
                    phone: phone
                },
                accessToken: data.token
            });
        } catch (err: any) {
            setError(err.response?.data?.message || 'Signup failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="card-glass w-full max-w-md p-8">
                <h1 className="text-2xl font-bold mb-6 text-center text-primary">Create Account</h1>

                {error && <div className="bg-red-500/20 text-red-500 p-3 rounded-lg mb-4 text-sm">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Full Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-surface border border-white/10 rounded-xl p-3 text-white"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Phone Number</label>
                        <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full bg-surface border border-white/10 rounded-xl p-3 text-white"
                        />
                    </div>
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
                        Sign Up
                    </Button>
                </form>

                <div className="mt-4 text-center text-sm text-gray-400">
                    Already have an account? <Link href="/login" className="text-primary hover:underline">Log In</Link>
                </div>
            </div>
        </div>
    );
}
