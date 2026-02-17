'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const { user, isLoading, logout } = useAuth();

    useEffect(() => {
        if (!isLoading) {
            if (!user || user.role !== 'admin') {
                if (!pathname.includes('/login')) {
                    router.push('/admin/login');
                }
            }
        }
    }, [user, isLoading, router, pathname]);

    if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading Admin...</div>;

    if (pathname.includes('/login')) return <>{children}</>;

    const links = [
        { href: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
        { href: '/admin/orders', label: 'Orders', icon: '📝' },
        { href: '/admin/settings', label: 'Rates & Stock', icon: '⚙️' },
    ];

    return (
        <div className="min-h-screen flex bg-background">
            {/* Sidebar (Desktop) / Bottom Nav (Mobile - Todo) */}
            <aside className="w-64 bg-surface border-r border-white/5 hidden md:flex flex-col p-4">
                <div className="text-xl font-bold mb-8 text-primary">Namma Kari Kadai<br /><span className="text-xs text-gray-400 font-normal">Admin Panel</span></div>
                <nav className="flex-1 space-y-2">
                    {links.map(link => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`flex items-center p-3 rounded-xl transition-all ${pathname === link.href
                                ? 'bg-primary text-white'
                                : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                }`}
                        >
                            <span className="mr-3 text-xl">{link.icon}</span>
                            {link.label}
                        </Link>
                    ))}
                </nav>
                <button
                    onClick={() => logout()}
                    className="p-3 text-left text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
                >
                    Sign Out
                </button>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <header className="md:hidden p-4 border-b border-white/5 flex justify-between items-center bg-surface">
                    <span className="font-bold">Admin Panel</span>
                    <button onClick={() => logout()} className="text-sm text-red-400">Logout</button>
                </header>
                <div className="p-4 md:p-8">
                    {children}
                </div>
            </main>

            {/* Mobile Bottom Nav */}
            <nav className="md:hidden fixed bottom-0 left-0 w-full bg-surface border-t border-white/5 flex justify-around p-3 z-50">
                {links.map(link => (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={`flex flex-col items-center ${pathname === link.href ? 'text-primary' : 'text-gray-400'
                            }`}
                    >
                        <span className="text-xl">{link.icon}</span>
                        <span className="text-xs mt-1">{link.label}</span>
                    </Link>
                ))}
            </nav>
        </div>
    );
}
