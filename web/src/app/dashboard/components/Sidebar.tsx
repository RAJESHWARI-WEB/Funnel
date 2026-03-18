'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, LineChart, Settings, FileText, Layers, LogOut } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { useRouter } from 'next/navigation';

export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const { resetProfile } = useStore();

    const navItems = [
        { label: 'Home', icon: Home, href: '/dashboard' },
        { label: 'Analytics', icon: LineChart, href: '/dashboard/analytics' },
        { label: 'Campaigns', icon: Layers, href: '/dashboard/campaigns' },
        { label: 'Reports', icon: FileText, href: '/dashboard/reports' },
    ];

    const bottomNavItems = [
        { label: 'Settings', icon: Settings, href: '/dashboard/settings' },
    ];

    const NavLink = ({ item }: { item: any }) => {
        const isActive = pathname === item.href;
        return (
            <Link
                href={item.href}
                title={item.label}
                className={`flex items-center justify-center p-3 rounded-xl transition-all duration-200 group ${isActive 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'}`}
            >
                <item.icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-700'}`} />
            </Link>
        );
    };

    const handleLogout = () => {
        resetProfile();
        router.push('/login');
    };

    return (
        <aside className="w-[72px] border-r border-slate-200 bg-white flex flex-col items-center h-full z-20 shrink-0 hidden md:flex">
            {/* Logo Area */}
            <div className="h-20 flex items-center justify-center w-full border-b border-transparent">
                <Link href="/dashboard" className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-slate-50 transition-colors p-1">
                    <img src="/Funnel Mascot.svg" alt="Funnel" className="w-full h-full object-contain" />
                </Link>
            </div>

            {/* Main Navigation */}
            <nav className="flex-1 w-full px-3 py-6 space-y-3 overflow-y-auto">
                {navItems.map((item) => (
                    <NavLink key={item.label} item={item} />
                ))}
            </nav>

            {/* Bottom Actions */}
            <div className="w-full p-3 border-t border-slate-100 space-y-3">
                {bottomNavItems.map((item) => (
                    <NavLink key={item.label} item={item} />
                ))}
                
                <button
                    onClick={handleLogout}
                    title="Log Out"
                    className="w-full flex items-center justify-center p-3 rounded-xl transition-all duration-200 text-red-500 hover:bg-red-50 hover:text-red-700 group"
                >
                    <LogOut className="w-5 h-5 text-red-400 group-hover:text-red-500" />
                </button>
            </div>
        </aside>
    );
}
