'use client';

import { useStore } from '@/store/useStore';
import { useState, useEffect } from 'react';
import { Save, Settings2, Key, Database, Building2, ShieldCheck, Cpu } from 'lucide-react';
import { Country, State } from 'country-state-city';
import { loadUserProfile, saveUserProfile } from '@/services/userService';

export default function SettingsPage() {
    const { profile, setProfile } = useStore();
    const [isClient, setIsClient] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Local form states synced with Zustand
    const [companyName, setCompanyName] = useState('');
    const [businessType, setBusinessType] = useState('');
    const [targetCountry, setTargetCountry] = useState('');
    const [targetAudience, setTargetAudience] = useState('');
    
    // Abstract API keys
    const [openAiKey, setOpenAiKey] = useState('');
    const [customEndpoint, setCustomEndpoint] = useState('');
    const [apiStatus, setApiStatus] = useState<'required' | 'testing' | 'connected' | 'invalid'>('required');

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

            if (profile) {
                setCompanyName(profile.companyName || '');
                setBusinessType(profile.businessType || '');
                
                // Format Target Region from ISO codes
                let locString = profile.targetCountry || '';
                if (profile.locationType === 'global') {
                    locString = 'Global';
                } else if (profile.targetCountry) {
                    const c = Country.getCountryByCode(profile.targetCountry);
                    if (c) {
                        const s = State.getStateByCodeAndCountry(profile.targetState, profile.targetCountry);
                        locString = [profile.targetCity, s?.name || profile.targetState, c.name].filter(Boolean).join(', ');
                    } else {
                        locString = [profile.targetCity, profile.targetState, profile.targetCountry].filter(Boolean).join(', ');
                    }
                }
                setTargetCountry(locString);
                
                setTargetAudience(profile.targetAudience || '');
                
                if (profile.openAiKey) {
                    setOpenAiKey(profile.openAiKey);
                }
                setCustomEndpoint(profile.customEndpoint || '');
            }
        };

        initProfile();
    }, [profile, setProfile]);

    // Debounced API Key Validation
    useEffect(() => {
        if (!openAiKey.trim()) {
            setApiStatus('required');
            return;
        }

        setApiStatus('testing');
        const timeoutId = setTimeout(async () => {
            try {
                // Minimal endpoint check to validate token auth
                const res = await fetch('https://api.openai.com/v1/models', {
                    headers: { 'Authorization': `Bearer ${openAiKey.trim()}` }
                });
                if (res.ok) {
                    setApiStatus('connected');
                } else {
                    setApiStatus('invalid');
                }
            } catch (err) {
                setApiStatus('invalid');
            }
        }, 1200);

        return () => clearTimeout(timeoutId);
    }, [openAiKey]);

    const handleSave = async () => {
        setIsSaving(true);
        const updatedProfile = {
            ...profile,
            companyName,
            businessType,
            targetCountry,
            targetAudience,
            openAiKey,
            customEndpoint
        };
        
        try {
            await saveUserProfile(updatedProfile);
            setProfile(updatedProfile);
        } catch (err) {
            console.error("Save config failed:", err);
            alert("Failed to save configuration. Ensure you are signed in.");
        } finally {
            setIsSaving(false);
        }
    };

    if (!isClient) return null;

    return (
        <div className="w-full max-w-[1200px] mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
            
            {/* Header */}
            <div className="flex flex-col xl:flex-row justify-between xl:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
                        <Settings2 className="w-8 h-8 text-blue-600" /> System Settings
                    </h1>
                    <p className="text-slate-500 mt-2">
                        Configure autonomous AI engine keys and update your core company persona for the scraper.
                    </p>
                </div>
                <button 
                    onClick={handleSave}
                    disabled={isSaving}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 flex items-center gap-2 w-full xl:w-auto justify-center"
                >
                    {isSaving ? <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" /> : <Save className="w-4 h-4" />}
                    {isSaving ? 'Saving...' : 'Save Configuration'}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Left Column: API configs */}
                <div className="space-y-8">
                    <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 rounded-full blur-2xl -mr-10 -mt-10 opacity-50 z-0 pointer-events-none group-hover:scale-150 transition-transform duration-700"></div>
                        <div className="relative z-10">
                            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                                <Key className="w-5 h-5 text-amber-500" /> API Connections
                            </h2>
                            <div className="space-y-5">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700 flex items-center justify-between">
                                        OpenAI API Key
                                        {apiStatus === 'connected' && (
                                            <span className="text-[10px] bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-md font-bold uppercase tracking-wider">Connected</span>
                                        )}
                                        {apiStatus === 'testing' && (
                                            <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md font-bold uppercase tracking-wider flex items-center gap-1">
                                                <span className="animate-spin w-2.5 h-2.5 border-2 border-blue-600 border-t-transparent rounded-full" />
                                                Testing
                                            </span>
                                        )}
                                        {apiStatus === 'invalid' && (
                                            <span className="text-[10px] bg-red-50 text-red-600 px-2 py-0.5 rounded-md font-bold uppercase tracking-wider">Invalid Key</span>
                                        )}
                                        {apiStatus === 'required' && (
                                            <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md font-bold uppercase tracking-wider">Required</span>
                                        )}
                                    </label>
                                    <div className="relative">
                                        <input 
                                            type="password"
                                            value={openAiKey}
                                            onChange={(e) => setOpenAiKey(e.target.value)}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-mono text-sm"
                                        />
                                        <ShieldCheck className={`w-5 h-5 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none transition-colors ${
                                            apiStatus === 'connected' ? 'text-emerald-500' :
                                            apiStatus === 'invalid' ? 'text-red-500' :
                                            apiStatus === 'testing' ? 'text-blue-500 animate-pulse' :
                                            'text-slate-300'
                                        }`} />
                                    </div>
                                    <p className="text-xs text-slate-500">The primary logic engine running the autonomous scraping and reasoning.</p>
                                </div>

                                <div className="space-y-2 pt-4 border-t border-slate-100">
                                    <label className="text-sm font-semibold text-slate-700 flex items-center justify-between">
                                        Custom LLM Endpoint
                                        <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md font-bold uppercase tracking-wider">Optional</span>
                                    </label>
                                    <input 
                                        type="url"
                                        placeholder="https://your-custom-api.com/v1"
                                        value={customEndpoint}
                                        onChange={(e) => setCustomEndpoint(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-sm"
                                    />
                                    <p className="text-xs text-slate-500">Override the default LLM host and use your own local/custom wrapper for autonomy.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 rounded-full blur-2xl -mr-10 -mt-10 opacity-50 z-0 pointer-events-none group-hover:scale-150 transition-transform duration-700"></div>
                        <div className="relative z-10 flex flex-col items-center justify-center text-center py-6">
                            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 mb-4 shadow-sm group-hover:scale-110 transition-transform">
                                <Database className="w-8 h-8 text-slate-400" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2">Data Engine Status</h3>
                            <p className="text-slate-500 text-sm mb-4">Your leads are safely synced with Firebase.</p>
                            <button className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-bold transition-colors">
                                Export All Leads (CSV)
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Column: Prompt / Core Setup */}
                <div className="space-y-8">
                    <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
                        <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                            <Building2 className="w-5 h-5 text-blue-500" /> Company Persona (AI Prompts)
                        </h2>
                        <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                            These fields were populated during your onboarding. They act as the core prompt variables shaping how the AI evaluates and scores potential opportunities.
                        </p>

                        <div className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700">Your Company Name</label>
                                <input 
                                    type="text"
                                    value={companyName}
                                    onChange={(e) => setCompanyName(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-900"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700">Target Region / Boundary</label>
                                <input 
                                    type="text"
                                    value={targetCountry}
                                    onChange={(e) => setTargetCountry(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-900"
                                />
                                <p className="text-xs text-slate-500">The geographical radius the AI focuses sweeps on.</p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700">Your Expertise / Niche</label>
                                <input 
                                    type="text"
                                    value={businessType}
                                    onChange={(e) => setBusinessType(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-900"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700">Target Client Persona</label>
                                <textarea 
                                    rows={4}
                                    value={targetAudience}
                                    onChange={(e) => setTargetAudience(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-900 resize-none leading-relaxed"
                                />
                            </div>
                        </div>
                    </div>
                </div>

            </div>

        </div>
    );
}
