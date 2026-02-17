'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '@/services/api';
import { useRouter } from 'next/navigation';

interface User {
    _id: string;
    name: string;
    email: string;
    role: 'customer' | 'admin';
    phone?: string;
}

interface AuthContextType {
    user: User | null;
    login: (userData: any) => void;
    logout: () => void;
    isLoading: boolean;
    register: (userData: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        // Check if user is logged in
        const checkUser = async () => {
            try {
                // If we have an access token, try to fetch profile
                const token = localStorage.getItem('accessToken');
                if (token) {
                    const { data } = await api.get('/auth/profile');
                    setUser(data);
                } else {
                    // Maybe try refresh?
                    // api.post('/auth/refresh') called by interceptor if we make a request? 
                    // But first request /auth/profile needs token.
                    // If no token, we are guest.
                }
            } catch (err) {
                console.error('Auth check failed', err);
                localStorage.removeItem('accessToken');
            } finally {
                setIsLoading(false);
            }
        };
        checkUser();
    }, []);

    const login = (data: { user: User; accessToken: string }) => {
        setUser(data.user);
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('user', JSON.stringify(data.user));
        if (data.user.role === 'admin') {
            router.push('/admin/dashboard');
        } else {
            router.push('/menu'); // or home
        }
    };

    const register = async (userData: any) => {
        const { data } = await api.post('/auth/signup', userData);
        login({ user: data, accessToken: data.accessToken });
    };

    const logout = async () => {
        try {
            await api.post('/auth/logout');
            setUser(null);
            localStorage.removeItem('accessToken');
            localStorage.removeItem('user');
            router.push('/login');
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isLoading, register }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
