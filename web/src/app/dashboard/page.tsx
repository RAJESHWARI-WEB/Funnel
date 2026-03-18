'use client';

import { useStore } from '@/store/useStore';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Target, Search, Map as MapIcon, List, Zap, Globe, Star, MapPin, DollarSign, Clock, SearchCode } from 'lucide-react';
import { getTopOpportunities, Lead, runAutonomousSearch } from '@/services/leadService';
import { loadUserProfile } from '@/services/userService';

type ViewMode = 'map' | 'list' | 'score';

export default function Dashboard() {
    const router = useRouter();
    const { profile, setProfile } = useStore();
    const [isClient, setIsClient] = useState(false);
    
    // Backend Logic States
    const [opportunities, setOpportunities] = useState<Lead[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSearching, setIsSearching] = useState(false);
    const [viewMode, setViewMode] = useState<ViewMode>('score');

    useEffect(() => {
        setIsClient(true);

        const initProfile = async () => {
            if (!profile || !profile.businessType) {
                try {
                    const loadedProfile = await loadUserProfile();
                    if (loadedProfile) {
                        setProfile(loadedProfile);
                    }
                } catch (err) {
                    console.error("Failed to load profile:", err);
                }
            }
        };

        const fetchDashboardData = async () => {
            try {
                const results = await getTopOpportunities(20);
                const sortedOps = [...results].sort((a, b) => b.score - a.score);
                setOpportunities(sortedOps);
            } catch (err) {
                console.error("Failed to load dashboard data", err);
            } finally {
                setIsLoading(false);
            }
        };

        initProfile().then(() => fetchDashboardData());
    }, [profile, router, setProfile]);

    const handleSearch = async () => {
        setIsSearching(true);
        try {
            const newLeads = await runAutonomousSearch(profile, profile.openAiKey);
            // Append and sort
            setOpportunities(prev => {
                const combined = [...newLeads, ...prev];
                return combined.sort((a, b) => b.score - a.score);
            });
        } catch (error) {
            console.error("Search failed:", error);
            alert("Ensure API configuration is valid and Firebase is connected.");
        } finally {
            setIsSearching(false);
        }
    };

    if (!isClient) return null;

    return (
        <div className="w-full max-w-[1600px] mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12 h-full flex flex-col">
            
            {/* Header / Action Area */}
            <div className="flex flex-col xl:flex-row justify-between xl:items-end gap-6 bg-white p-6 rounded-3xl shadow-sm border border-slate-100 relative overflow-hidden">
                {/* Decorative blob */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -mr-20 -mt-20 opacity-50 z-0 pointer-events-none"></div>

                <div className="flex flex-col z-10 w-full xl:w-1/2">
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Client Acquisition Engine</h1>
                    <p className="text-slate-500 mt-2 leading-relaxed">
                        Currently tracking targeted leads based on your AI persona parameters. Toggle views below to analyze geographical coverage, strict rankings, or detailed lists.
                    </p>
                    <div className="mt-6 flex items-center gap-4">
                        <button 
                            onClick={handleSearch}
                            disabled={isSearching}
                            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-8 py-3.5 rounded-2xl font-bold transition-all shadow-lg hover:shadow-blue-500/30 flex items-center gap-2 group"
                        >
                            {isSearching ? <span className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" /> : <SearchCode className="w-5 h-5 group-hover:scale-110 transition-transform" />}
                            {isSearching ? 'Scraping Matches...' : 'Find New Clients'}
                        </button>
                    </div>
                </div>
                
                <div className="flex flex-col justify-end gap-4 z-10 w-full xl:w-auto">
                    {/* View Toggles */}
                    <div className="bg-slate-100 p-1.5 rounded-xl flex items-center gap-1 self-start xl:self-end border border-slate-200 shadow-inner">
                        <ViewToggleButton active={viewMode === 'map'} onClick={() => setViewMode('map')} icon={<MapIcon className="w-4 h-4" />} label="Maps" />
                        <ViewToggleButton active={viewMode === 'list'} onClick={() => setViewMode('list')} icon={<List className="w-4 h-4" />} label="List" />
                        <ViewToggleButton active={viewMode === 'score'} onClick={() => setViewMode('score')} icon={<Zap className="w-4 h-4" />} label="Score" />
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-sm pt-2">
                        <FilterDropdown label="Sort: Highest Score" />
                    </div>
                </div>
            </div>

            {/* Dynamic Content Area */}
            <div className="relative w-full flex-1">
                {isLoading ? (
                    <div className="flex space-x-6 overflow-x-auto pb-8 scrollbar-hide">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="min-w-[380px] w-full xl:w-[380px] h-[400px] bg-slate-50 rounded-2xl animate-pulse border border-slate-100 flex-shrink-0" />
                        ))}
                    </div>
                ) : opportunities.length === 0 ? (
                    <div className="w-full py-20 flex flex-col items-center justify-center bg-white rounded-3xl border border-dashed border-slate-300">
                        <Target className="w-12 h-12 text-slate-300 mb-4" />
                        <h3 className="text-lg font-bold text-slate-700">No opportunities found</h3>
                        <p className="text-slate-500 mt-2 text-center max-w-sm">No clients currently match your criteria. Click 'Find New Clients' to unleash the AI scraper on your Target Area.</p>
                    </div>
                ) : (
                    <div className="w-full animate-in fade-in duration-300">
                        {viewMode === 'score' && <ScoreView opportunities={opportunities} />}
                        {viewMode === 'list' && <ListView opportunities={opportunities} />}
                        {viewMode === 'map' && <MapView opportunities={opportunities} />}
                    </div>
                )}
            </div>
            
        </div>
    );
}

/* ==============================================
   Sub-Views 
   ============================================== */

function ScoreView({ opportunities }: { opportunities: Lead[] }) {
    return (
        <div>
            <div className="flex items-center gap-2 mb-4 text-slate-600 font-semibold px-2">
                <Zap className="w-5 h-5 text-amber-500" /> Top Priority Opportunities
            </div>
            <div className="flex space-x-6 overflow-x-auto pb-8 scrollbar-hide snap-x items-stretch">
                {opportunities.map((opt, i) => (
                    <div key={opt.id} className="min-w-[380px] w-[380px] bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex-shrink-0 snap-center flex flex-col hover:shadow-md transition-shadow relative overflow-hidden group">
                        
                        <div className="flex justify-between items-start mb-5">
                            <div className="flex flex-col">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                                        Match #{i + 1}
                                    </span>
                                    <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider bg-blue-50 text-blue-600">
                                        <Globe className="w-3 h-3" /> Active Site
                                    </span>
                                </div>
                            </div>
                            <div className="flex flex-col items-end">
                                <div className="flex items-center justify-center w-12 h-12 bg-emerald-50 rounded-xl border border-emerald-100/50">
                                    <span className="font-extrabold text-emerald-600 text-lg">{opt.score.toFixed(1)}</span>
                                </div>
                                <span className="text-[10px] text-slate-400 font-semibold mt-1 uppercase">AI Score</span>
                            </div>
                        </div>

                        <div className="mb-4">
                            <h2 className="text-xl font-bold text-slate-900 leading-tight mb-2 group-hover:text-blue-600 transition-colors">
                                {opt.name}
                            </h2>
                            <div className="flex flex-col gap-2 text-sm text-slate-600">
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-slate-400" /> {opt.location}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" /> 
                                    <span className="font-medium">{opt.rating} Rating</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-50 rounded-2xl p-4 mb-5 flex-1 border border-slate-100 relative">
                            <div className="absolute -top-3 left-4 bg-white px-2 flex items-center gap-1 text-xs font-bold text-amber-600">
                                <Zap className="w-3.5 h-3.5" /> AI Reasoning
                            </div>
                            <p className="text-sm text-slate-700 leading-relaxed italic mt-2">
                                "{opt.explanation}"
                            </p>
                        </div>

                        <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-auto">
                            <div className="flex flex-col">
                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Est. Value</span>
                                <span className="text-base font-extrabold text-slate-900 flex items-center gap-0.5">
                                    <DollarSign className="w-4 h-4 text-emerald-500" />
                                    {opt.estimatedValue.toLocaleString()}
                                </span>
                            </div>

                            <div className="flex flex-col items-end">
                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Urgency</span>
                                <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                                    opt.urgency === 'High' ? 'bg-red-50 text-red-600 border border-red-100' :
                                    opt.urgency === 'Medium' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                                    'bg-slate-100 text-slate-600 border border-slate-200'
                                }`}>
                                    <Clock className="w-3.5 h-3.5" />
                                    {opt.urgency}
                                </span>
                            </div>
                        </div>

                    </div>
                ))}
            </div>
        </div>
    );
}

function ListView({ opportunities }: { opportunities: Lead[] }) {
    return (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden w-full">
            <div className="w-full overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-slate-50 border-b border-slate-100">
                        <tr>
                            <th className="px-6 py-4 font-semibold text-slate-500">Target Client</th>
                            <th className="px-6 py-4 font-semibold text-slate-500">Location</th>
                            <th className="px-6 py-4 font-semibold text-slate-500 text-center">Score</th>
                            <th className="px-6 py-4 font-semibold text-slate-500 text-right">Potential Value</th>
                            <th className="px-6 py-4 font-semibold text-slate-500 text-center">Urgency</th>
                            <th className="px-6 py-4 font-semibold text-slate-500 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {opportunities.map((opt) => (
                            <tr key={opt.id} className="hover:bg-slate-50 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{opt.name}</div>
                                    <div className="text-xs text-slate-500">{opt.websiteStatus}</div>
                                </td>
                                <td className="px-6 py-4 text-slate-600">{opt.location}</td>
                                <td className="px-6 py-4 text-center">
                                    <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
                                        {opt.score.toFixed(1)}
                                    </span>
                                </td>
                                <td className="px-6 py-4 font-medium text-slate-900 text-right">
                                    ${opt.estimatedValue.toLocaleString()}
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                                        opt.urgency === 'High' ? 'bg-red-50 text-red-600' :
                                        opt.urgency === 'Medium' ? 'bg-amber-50 text-amber-600' :
                                        'bg-slate-100 text-slate-600'
                                    }`}>
                                        {opt.urgency}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button className="text-blue-600 font-bold hover:text-blue-800 text-sm px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors">
                                        View Details
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function MapView({ opportunities }: { opportunities: Lead[] }) {
    // A stylized, dynamic mock representation of a Google Maps view indicating geographical data constraints until API key config
    return (
        <div className="w-full bg-slate-100 rounded-3xl border border-slate-200 overflow-hidden relative flex flex-col h-[600px] shadow-sm">
            {/* Mock Map Background Canvas */}
            <div className="absolute inset-0 z-0 bg-[#e5e3df] mix-blend-multiply opacity-50 bg-[url('https://maps.googleapis.com/maps/api/staticmap?center=San+Francisco,CA&zoom=11&size=1600x600&maptype=roadmap&style=feature:all|element:labels|visibility:off&style=feature:landscape|color:0xf4f3f0&style=feature:water|color:0xdbe4eb')] bg-cover bg-center" />
            
            {/* Map Overlay Top Bar */}
            <div className="relative z-10 w-full p-4 flex justify-end">
                <div className="bg-white/90 backdrop-blur shadow-sm rounded-xl px-4 py-2 text-sm font-semibold text-slate-700 flex items-center gap-2">
                    <MapIcon className="w-4 h-4 text-blue-500" />
                    Geographical Client Spread
                </div>
            </div>

            {/* Pins */}
            <div className="relative z-10 flex-1 flex items-center justify-center p-8">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 w-full max-w-4xl opacity-90 mx-auto mt-20">
                    {opportunities.slice(0, 8).map((opt, i) => (
                        <div key={opt.id} className="relative group cursor-pointer" style={{ transform: `translateY(${i % 2 === 0 ? '20px' : '-20px'})`, marginLeft: `${i * 10}px` }}>
                            {/* The Pin Icon */}
                            <div className="flex flex-col items-center group-hover:-translate-y-2 transition-transform duration-300">
                                <div className="bg-red-500 text-white shadow-lg w-8 h-8 rounded-t-full rounded-bl-full rotate-45 flex items-center justify-center relative border-2 border-white">
                                    <div className="w-2.5 h-2.5 bg-white rounded-full -rotate-45" />
                                </div>
                                <div className="w-1.5 h-6 bg-gradient-to-t from-transparent to-red-500/50 mt-1 rounded-full" />
                            </div>
                            
                            {/* Hover Card */}
                            <div className="absolute top-12 left-1/2 -translate-x-1/2 bg-white shadow-xl rounded-xl p-3 w-48 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 border border-slate-100">
                                <div className="font-bold text-slate-900 text-sm leading-tight mb-1">{opt.name}</div>
                                <div className="text-xs text-slate-500 truncate flex items-center gap-1"><MapPin className="w-3 h-3" /> {opt.location}</div>
                                <div className="mt-2 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded inline-block">Appx Value: ${opt.estimatedValue}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            
            <div className="relative z-20 bg-white/80 backdrop-blur-md p-4 mt-auto border-t border-slate-200">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                    <div>Showing {opportunities.length} target clients in radius</div>
                    <div className="flex gap-4">
                        <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-500"></div> High Pipeline</span>
                        <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-slate-400"></div> Explored</span>
                    </div>
                </div>
            </div>
        </div>
    );
}


/* ==============================================
   UI Components 
   ============================================== */

function ViewToggleButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
    return (
        <button 
            onClick={onClick}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all shadow-sm ${
                active ? 'bg-white text-blue-600 border border-blue-100 ring-1 ring-blue-500/20' : 'text-slate-500 hover:text-slate-800 hover:bg-white/50 border border-transparent'
            }`}
        >
            {icon} {label}
        </button>
    );
}

function FilterDropdown({ label }: { label: string }) {
    return (
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all font-medium whitespace-nowrap shadow-sm">
            {label} <span className="text-[10px] ml-1 opacity-50">▼</span>
        </button>
    );
}
