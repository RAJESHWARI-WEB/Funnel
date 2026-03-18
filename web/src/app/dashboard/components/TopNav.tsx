'use client';

import { Search, LoaderPinwheel, Bell, Monitor, UserCircle } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { useStore } from '@/store/useStore';

export default function TopNav() {
    const pathname = usePathname();
    const { profile } = useStore();
    
    const pathText = pathname === '/dashboard' ? 'Funnel AI' : pathname.split('/').pop();
    const formattedPath = pathText ? pathText.charAt(0).toUpperCase() + pathText.slice(1) : 'Funnel AI';

    // Handle initial F shortcut
    useEffect(() => {

        const handleKeyDown = (e: KeyboardEvent) => {
            // Listen for long press 'F' -> trigger search (mocking long press as shift+F or explicit logic)
            // A simple implementation for 'f' character
            // Real long press usually requires tracking mousedown/up durations. 
            // We'll map Cmd/Ctrl+K and 'Shift+F' to open the search for accessibility.
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                document.getElementById('global-search')?.focus();
            }
            if (e.shiftKey && e.key.toLowerCase() === 'f') {
               e.preventDefault();
               document.getElementById('global-search')?.focus();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <header className="h-20 w-full bg-white/80 backdrop-blur-md border-b border-slate-200 flex flex-col justify-center px-6 md:px-8 z-10 sticky top-0">
            <div className="flex items-center justify-between">
                
                {/* Breadcrumbs */}
                <div className="hidden sm:flex items-center text-sm font-medium text-slate-500 gap-2">
                    <span className="hover:text-slate-900 cursor-pointer transition-colors">Home</span>
                    <span className="text-slate-300">/</span>
                    <span className="hover:text-slate-900 cursor-pointer transition-colors">Dashboards</span>
                    <span className="text-slate-300">/</span>
                    <span className="text-slate-900">{formattedPath}</span>
                </div>

                {/* Right side interactions */}
                <div className="flex items-center gap-4 w-full sm:w-auto mt-2 sm:mt-0">
                    
                    {/* Search Bar - Note: Requested shortcut hook applied */}
                    <div className="relative group w-full sm:w-64 md:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                        <input
                            id="global-search"
                            type="text"
                            placeholder="Search or navigate"
                            className="w-full bg-slate-100 border border-transparent rounded-full py-2 pl-10 pr-16 text-sm text-slate-900 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all shadow-sm"
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1 items-center">
                            <kbd className="hidden sm:inline-block border border-slate-300 rounded px-1.5 text-[10px] font-sans text-slate-400">⌘K</kbd>
                            <kbd className="hidden sm:inline-block border border-slate-300 rounded px-1.5 text-[10px] font-sans text-slate-400">⇧F</kbd>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 border-l border-slate-200 pl-4 ml-2">

                        {/* Notifications */}
                        <button className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-all relative">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                        </button>
                        
                        {/* User Profile Hook / Mascot */}
                        <button className="w-10 h-10 rounded-full ml-2 overflow-hidden hover:opacity-80 transition-opacity flex items-center justify-center">
                            <img 
                                src="/Funnel Mascot.svg" // Render Funnel mascot icon
                                alt="Funnel Mascot"
                                className="w-full h-full object-contain"
                            />
                        </button>
                    </div>

                </div>
            </div>
        </header>
    );
}
