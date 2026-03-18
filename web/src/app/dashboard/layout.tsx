import Sidebar from '@/app/dashboard/components/Sidebar';
import TopNav from '@/app/dashboard/components/TopNav';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-screen w-full bg-slate-50 text-slate-900 overflow-hidden font-sans">
            {/* Left Sidebar */}
            <Sidebar />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col h-full overflow-hidden">
                <TopNav />
                
                {/* Dashboard Scrollable Body */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto p-6 md:p-8 relative">
                    {children}
                </main>
            </div>
        </div>
    );
}
