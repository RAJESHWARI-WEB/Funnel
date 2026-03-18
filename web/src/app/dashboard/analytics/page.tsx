'use client';

import { useStore } from '@/store/useStore';
import { useEffect, useState } from 'react';
import { Target, MoreVertical, Zap } from 'lucide-react';
import { getRevenueTrackerData, getAIRecommendations, getTrafficConversions } from '@/services/leadService';

export default function AnalyticsDashboard() {
    const { profile } = useStore();
    const [isClient, setIsClient] = useState(false);
    
    // Backend Logic States
    const [revenueData, setRevenueData] = useState<any>(null);
    const [aiInsights, setAiInsights] = useState<string[]>([]);
    const [trafficData, setTrafficData] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsClient(true);
        // Load Analytics Backend Data
        async function fetchAnalyticsData() {
            try {
                const [rev, insights, traffic] = await Promise.all([
                    getRevenueTrackerData(),
                    getAIRecommendations(),
                    getTrafficConversions()
                ]);
                setRevenueData(rev);
                setAiInsights(insights);
                setTrafficData(traffic);
            } catch (err) {
                console.error("Failed to load analytics data", err);
            } finally {
                setIsLoading(false);
            }
        }
        fetchAnalyticsData();
    }, []);

    if (!isClient) return null;

    return (
        <div className="w-full max-w-[1400px] mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
            
            {/* Header / Filter Mocks */}
            <div className="flex flex-col xl:flex-row justify-between xl:items-center gap-4">
                <div className="flex items-center gap-3 relative">
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Analytics & Revenue</h1>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-sm z-10 w-full xl:w-auto overflow-x-auto pb-2 xl:pb-0 scrollbar-hide">
                    <FilterDropdown label="This month compared to last month" />
                    <FilterDropdown label="US dollar" />
                    <FilterDropdown label="Funnel digital MM" />
                    <FilterDropdown label="Channel" />
                    <FilterDropdown label="Traffic source" />
                    <FilterDropdown label="Campaign" />
                </div>
            </div>

            {/* KPI Row */}
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                <KPICard title="Revenue (Closed)" value={`$${((revenueData?.closedRevenue || 0) / 1000).toFixed(1)}K`} trend="Converted Leads" isPositive={true} />
                <KPICard title="Potential Portfolio" value={`$${((revenueData?.potentialRevenue || 0) / 1000).toFixed(1)}K`} trend="Active Leads" isPositive={true} />
                <KPICard title="Pipeline" value={`$${(((revenueData?.potentialRevenue || 0) * 0.4) / 1000).toFixed(1)}K`} trend="In Progress" isPositive={null} />
                <KPICard title="Total ROFS" value="4.0" trend="↑ 11% from 3.6" isPositive={true} />
            </div>

            {/* AI Actionable Insights Banner */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl shadow-sm border border-blue-100 p-6 flex flex-col sm:flex-row gap-6 items-start">
               <div className="bg-white p-3 rounded-full flex-shrink-0 shadow-sm border border-blue-100">
                 <Zap className="w-6 h-6 text-amber-500" fill="currentColor" />
               </div>
               <div className="flex-1 space-y-3">
                 <h2 className="text-lg font-bold text-slate-800">AI Recommendations Engine</h2>
                 {isLoading ? (
                     <div className="animate-pulse space-y-2">
                         <div className="h-4 bg-blue-200/50 rounded w-3/4"></div>
                         <div className="h-4 bg-blue-200/50 rounded w-1/2"></div>
                     </div>
                 ) : (
                     <ul className="space-y-2 text-sm text-slate-700">
                        {aiInsights.map((insight, idx) => (
                            <li key={idx} className="flex gap-2">
                                <span className="text-blue-500 flex-shrink-0 mt-0.5 font-bold">•</span> 
                                <span>{insight}</span>
                            </li>
                        ))}
                     </ul>
                 )}
               </div>
            </div>

            {/* Main Chart Area (Full Width) */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 w-full">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-4">
                        <span className="text-sm font-semibold text-slate-700">Total Pipeline by Choose dimension ˇ</span>
                    </div>
                    <div className="flex items-center gap-2 bg-slate-100 rounded-lg p-1">
                        <button className="px-3 py-1 text-xs font-semibold bg-white shadow-sm rounded-md text-slate-900">Day</button>
                        <button className="px-3 py-1 text-xs font-semibold text-slate-500 hover:text-slate-900">Week</button>
                        <button className="px-3 py-1 text-xs font-semibold text-slate-500 hover:text-slate-900">Month</button>
                        <MoreVertical className="w-4 h-4 ml-2 text-slate-400" />
                    </div>
                </div>

                <div className="h-64 w-full relative">
                    {/* Y-axis lines */}
                    <div className="absolute inset-0 flex flex-col justify-between pt-2 pb-6">
                        {['$4.0', '$3.0', '$2.0', '$1.0', '$0.0'].map(val => (
                            <div key={val} className="flex justify-between items-center w-full border-b border-slate-100 h-0">
                                <span className="text-[10px] text-slate-400 -translate-y-1/2 bg-white pr-2 absolute -left-2">{val}</span>
                            </div>
                        ))}
                    </div>
                    {/* X-axis labels */}
                    <div className="absolute bottom-0 left-0 w-full flex justify-between px-6">
                        {['28 Jul', '1 Aug', '5 Aug', '9 Aug', '13 Aug', '17 Aug', '21 Aug', '25 Aug'].map(val => (
                            <span key={val} className="text-[10px] text-slate-400">{val}</span>
                        ))}
                    </div>

                    {/* Fake Chart Lines rendered as SVG */}
                    <svg className="w-full h-full pt-4 pb-8 relative z-10" preserveAspectRatio="none" viewBox="0 0 100 100">
                        {/* Light Blue Line */}
                        <polyline
                            points="0,60 10,55 15,50 20,70 25,65 30,50 35,60 40,65 45,45 50,55 55,75 60,80 65,65 70,60 75,50 80,60 85,60 90,55 95,60 100,80"
                            fill="none"
                            stroke="#7DD3FC"
                            strokeWidth="1.5"
                            strokeLinejoin="round"
                        />
                        {/* Dark Blue Line */}
                        <polyline
                            points="0,40 10,30 15,25 20,45 25,40 30,25 35,40 40,45 45,35 50,40 55,55 60,60 65,55 70,45 75,35 80,45 85,35 90,40 95,40 100,55"
                            fill="none"
                            stroke="#0284C7"
                            strokeWidth="2"
                            strokeLinejoin="round"
                        />
                    </svg>
                </div>
            </div>

            {/* Data Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden w-full">
                <div className="p-5 border-b border-slate-100 flex justify-between items-center">
                    <h2 className="text-lg font-bold text-slate-900">Traffic Source Conversions</h2>
                </div>
                <div className="w-full overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-slate-50 border-b border-slate-100">
                            <tr>
                                <th className="px-6 py-4 font-semibold text-slate-500">Channel / Source</th>
                                <th className="px-6 py-4 font-semibold text-slate-500 text-right">Cost</th>
                                <th className="px-6 py-4 font-semibold text-slate-500 text-right">Revenue</th>
                                <th className="px-6 py-4 font-semibold text-slate-500 text-right">ROFS</th>
                                <th className="px-6 py-4 font-semibold text-slate-500 text-right">Conversions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                                        <div className="flex justify-center"><span className="animate-spin w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full" /></div>
                                    </td>
                                </tr>
                            ) : trafficData.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500">No active traffic source tracking found.</td>
                                </tr>
                            ) : (
                                trafficData.map((campaign, idx) => (
                                    <TableRow 
                                        key={campaign.id || idx}
                                        name={campaign.name || 'Unknown Source'} 
                                        cost={campaign.cost ? `$${campaign.cost}` : '-'} 
                                        revenue={campaign.revenue ? `$${campaign.revenue}` : '$0'} 
                                        roas={campaign.roas || '0.00'} 
                                        conv={campaign.conversions || '0'} 
                                    />
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            
        </div>
    );
}

function KPICard({ title, value, trend, isPositive }: { title: string, value: string, trend: string, isPositive: boolean | null }) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5 flex flex-col hover:shadow-md transition-shadow cursor-default w-full">
            <h3 className="text-slate-500 text-sm font-semibold mb-2">{title}</h3>
            <span className="text-2xl font-bold tracking-tight text-slate-900 mb-3">{value}</span>
            <span className={`text-xs font-semibold flex items-center gap-1.5 ${
                isPositive === true ? 'text-emerald-500' : isPositive === false ? 'text-red-500' : 'text-slate-400'
            }`}>
                <span className={`w-2 h-2 rounded-full ${isPositive === true ? 'bg-emerald-500' : isPositive === false ? 'bg-red-500' : 'bg-slate-300'}`}/>
                {trend}
            </span>
        </div>
    );
}

function FilterDropdown({ label }: { label: string }) {
    return (
        <button className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-colors whitespace-nowrap">
            <Target className="w-3 h-3 opacity-50" /> {label} <span className="text-[10px] ml-1 opacity-50">▼</span>
        </button>
    );
}

function TableRow({ name, cost, revenue, roas, conv }: any) {
    return (
        <tr className="hover:bg-slate-50 transition-colors cursor-pointer group">
            <td className="px-6 py-4 font-semibold text-slate-900 flex items-center gap-2">
                <span className="text-[10px] opacity-0 group-hover:opacity-50 transition-opacity">▼</span> {name}
            </td>
            <td className="px-6 py-4 text-slate-600 text-right">{cost}</td>
            <td className="px-6 py-4 font-medium text-slate-900 text-right">{revenue}</td>
            <td className="px-6 py-4 text-slate-600 text-right">{roas}</td>
            <td className="px-6 py-4 text-slate-600 text-right">{conv}</td>
        </tr>
    );
}
