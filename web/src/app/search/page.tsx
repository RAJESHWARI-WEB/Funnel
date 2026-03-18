'use client';

import { useStore } from '@/store/useStore';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ExternalLink, MapPin, Star, Building2, BrainCircuit, CheckCircle, XCircle, Search } from 'lucide-react';

interface Lead {
    id: string;
    businessName: string;
    location: string;
    rating: number;
    reviewCount: number;
    websiteUrl: string | null;
    opportunityScore: number;
    aiReasoning: string;
    conversionLikelihood: 'High' | 'Medium' | 'Low';
}

export default function SearchPage() {
    const router = useRouter();
    const { profile } = useStore();
    const [isSearching, setIsSearching] = useState(false);
    const [searchStatus, setSearchStatus] = useState<string>('');
    const [leads, setLeads] = useState<Lead[]>([]);

    // Simulation for frontend MVP layout viewing
    const simulateSearch = () => {
        setIsSearching(true);
        setSearchStatus('Scraping Google Maps data...');

        setTimeout(() => {
            setSearchStatus('Applying deterministic filters (Rating > 4.2)...');

            setTimeout(() => {
                setSearchStatus('Sending valid leads to OpenAI for scoring...');

                setTimeout(() => {
                    setLeads([
                        {
                            id: '1',
                            businessName: 'Golden Gate Dental Care',
                            location: 'San Francisco, CA',
                            rating: 4.8,
                            reviewCount: 112,
                            websiteUrl: null,
                            opportunityScore: 9,
                            aiReasoning: 'Excellent local reputation but complete lack of web presence. Perfect target for web development services.',
                            conversionLikelihood: 'High'
                        },
                        {
                            id: '2',
                            businessName: 'Sunset Plumbing & Heating',
                            location: 'San Francisco, CA',
                            rating: 4.5,
                            reviewCount: 45,
                            websiteUrl: 'http://sunsetplumbingca.com',
                            opportunityScore: 7,
                            aiReasoning: 'They have a website, but it is likely outdated or not SEO optimized given the low traffic indicators. Medium budget potential.',
                            conversionLikelihood: 'Medium'
                        },
                        {
                            id: '3',
                            businessName: 'Bay Area Landscaping',
                            location: 'San Francisco, CA',
                            rating: 4.9,
                            reviewCount: 89,
                            websiteUrl: null,
                            opportunityScore: 10,
                            aiReasoning: 'High end service with strong positive reviews but no digital storefront. Urgent need for SEO and lead funnel.',
                            conversionLikelihood: 'High'
                        }
                    ]);
                    setIsSearching(false);
                    setSearchStatus('');
                }, 1500);
            }, 1500);
        }, 1500);
    };

    useEffect(() => {
        // Start search automatically on mount
        simulateSearch();
    }, []);

    return (
        <div className="min-h-screen bg-slate-950 text-white font-sans p-6 sm:p-12">
            <div className="max-w-5xl mx-auto">

                <header className="flex justify-between items-center mb-8">
                    <button
                        onClick={() => router.push('/dashboard')}
                        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
                    </button>
                    <div className="flex items-center gap-2">
                        <Search className="w-5 h-5 text-blue-400" />
                        <h1 className="text-xl font-semibold">Active Search</h1>
                    </div>
                </header>

                {isSearching && (
                    <div className="flex flex-col items-center justify-center py-32 animate-in fade-in duration-500">
                        <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mb-8" />
                        <h2 className="text-2xl font-bold mb-2">Analyzing Businesses</h2>
                        <p className="text-slate-400 text-sm animate-pulse">{searchStatus}</p>
                    </div>
                )}

                {!isSearching && leads.length > 0 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex justify-between items-end mb-8">
                            <div>
                                <h2 className="text-3xl font-bold mb-2">Found {leads.length} High-Value Leads</h2>
                                <p className="text-slate-400">Filtered and scored by AI based on your profile.</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-6">
                            {leads.map(lead => (
                                <LeadCard key={lead.id} lead={lead} />
                            ))}
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}

function LeadCard({ lead }: { lead: Lead }) {
    return (
        <div className="glass-panel p-6 rounded-2xl flex flex-col md:flex-row gap-6 hover:border-white/20 transition-all duration-300">

            <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                        <Building2 className="w-5 h-5 text-slate-400" />
                        {lead.businessName}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${lead.conversionLikelihood === 'High' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                            lead.conversionLikelihood === 'Medium' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                                'bg-slate-500/10 text-slate-400 border border-slate-500/20'
                        }`}>
                        {lead.conversionLikelihood} Likelihood
                    </span>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400 mb-6">
                    <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" /> {lead.location}
                    </div>
                    <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-amber-400" /> {lead.rating} ({lead.reviewCount} reviews)
                    </div>
                    <div className="flex items-center gap-1">
                        {lead.websiteUrl ? (
                            <span className="text-red-400 flex items-center gap-1"><XCircle className="w-4 h-4" /> Has Website</span>
                        ) : (
                            <span className="text-emerald-400 flex items-center gap-1"><CheckCircle className="w-4 h-4" /> No Website</span>
                        )}
                    </div>
                </div>

                <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-800">
                    <div className="flex items-center gap-2 mb-2">
                        <BrainCircuit className="w-4 h-4 text-purple-400" />
                        <span className="text-sm font-semibold text-purple-200">AI Reasoning</span>
                    </div>
                    <p className="text-slate-300 text-sm leading-relaxed">
                        {lead.aiReasoning}
                    </p>
                </div>
            </div>

            <div className="w-full md:w-48 flex flex-col justify-between border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-6">
                <div className="text-center md:text-right mb-4">
                    <div className="text-sm text-slate-400 mb-1">Opportunity Score</div>
                    <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-amber-200 to-amber-500 drop-shadow-sm">
                        {lead.opportunityScore}<span className="text-2xl text-amber-500/50">/10</span>
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <button className="w-full btn-primary py-2 rounded-lg text-sm font-medium">
                        Mark Contacted
                    </button>
                    <button className="w-full bg-slate-800 hover:bg-slate-700 text-white py-2 rounded-lg text-sm font-medium transition-colors">
                        Skip
                    </button>
                </div>
            </div>

        </div>
    );
}
