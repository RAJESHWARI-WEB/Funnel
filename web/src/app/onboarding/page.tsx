'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';
import { saveUserProfile } from '@/services/userService';
import { ArrowRight, ArrowLeft, Briefcase, MapPin, Target, Wallet, Lightbulb, Globe, Map } from 'lucide-react';
import { Country, State, City } from 'country-state-city';

const steps = [
    { id: 'businessType', title: 'Your Business', icon: <Briefcase className="w-5 h-5" /> },
    { id: 'targetLocation', title: 'Target Area', icon: <MapPin className="w-5 h-5" /> },
    { id: 'idealClientType', title: 'Ideal Client', icon: <Target className="w-5 h-5" /> },
    { id: 'budgetServices', title: 'Budget & Services', icon: <Wallet className="w-5 h-5" /> },
    { id: 'notes', title: 'AI Context', icon: <Lightbulb className="w-5 h-5" /> },
];

export default function Onboarding() {
    const router = useRouter();
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [isEntryComplete, setIsEntryComplete] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const { profile, setProfileField } = useStore();

    useEffect(() => {
        // Trigger split screen transition shortly after mount to continue from the login animation seamlessly
        const timer = setTimeout(() => {
            setIsEntryComplete(true);
        }, 100);
        return () => clearTimeout(timer);
    }, []);

    const handleNext = async () => {
        if (currentStepIndex < steps.length - 1) {
            setCurrentStepIndex(curr => curr + 1);
        } else {
            setIsSaving(true);
            try {
                await saveUserProfile(profile);
            } catch (err) {
                console.error("Failed to save profile:", err);
            }
            router.push('/dashboard');
        }
    };

    const handleBack = () => {
        if (currentStepIndex > 0) {
            setCurrentStepIndex(curr => curr - 1);
        }
    };

    const renderStepContent = () => {
        switch (currentStepIndex) {
            case 0:
                return (
                    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 text-left">
                        <div className="flex flex-col gap-2">
                            <label className="text-slate-700 text-sm font-semibold">What is your Company Name?</label>
                            <input
                                type="text"
                                placeholder="e.g. Acme Marketing"
                                className="w-full bg-white border border-slate-200 rounded-xl p-4 text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all shadow-sm"
                                value={profile.companyName || ''}
                                onChange={(e) => setProfileField('companyName', e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-slate-700 text-sm font-semibold">What type of business are you running?</label>
                            <input
                                type="text"
                                placeholder="e.g. Web Development Agency, Marketing Firm"
                                className="w-full bg-white border border-slate-200 rounded-xl p-4 text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all shadow-sm"
                                value={profile.businessType || ''}
                                onChange={(e) => setProfileField('businessType', e.target.value)}
                            />
                            <p className="text-xs text-slate-500 mt-1">This helps the AI understand your capabilities.</p>
                        </div>
                    </div>
                );
            case 1:
                return (
                    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 text-left">
                        <div className="flex flex-col gap-3">
                            <label className="text-slate-700 text-sm font-semibold">Where do you want to find clients?</label>
                            
                            {/* Toggle switch between Global and Region */}
                            <div className="flex gap-4 mb-2">
                                <button
                                    className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl border transition-all ${profile.locationType === 'global'
                                            ? 'border-blue-600 bg-blue-50 text-blue-700 font-semibold shadow-sm'
                                            : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                                        }`}
                                    onClick={() => setProfileField('locationType', 'global')}
                                >
                                    <Globe className="w-4 h-4" /> Global Focus
                                </button>
                                <button
                                    className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl border transition-all ${profile.locationType === 'region'
                                            ? 'border-blue-600 bg-blue-50 text-blue-700 font-semibold shadow-sm'
                                            : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                                        }`}
                                    onClick={() => setProfileField('locationType', 'region')}
                                >
                                    <Map className="w-4 h-4" /> Specific Region
                                </button>
                            </div>
                        </div>

                        {/* Region Selectors */}
                        {profile.locationType === 'region' && (
                            <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
                                
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Country</label>
                                    <select
                                        className="w-full bg-white border border-slate-200 rounded-xl p-3.5 text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 shadow-sm transition-all outline-none"
                                        value={profile.targetCountry}
                                        onChange={(e) => {
                                            setProfileField('targetCountry', e.target.value);
                                            setProfileField('targetState', ''); // reset dependents
                                            setProfileField('targetCity', '');
                                        }}
                                    >
                                        <option value="" disabled>Select Country</option>
                                        {Country.getAllCountries().map(country => (
                                            <option key={country.isoCode} value={country.isoCode}>{country.name}</option>
                                        ))}
                                    </select>
                                </div>

                                {profile.targetCountry && (
                                    <div className="flex flex-col gap-1.5 animate-in fade-in duration-300">
                                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">State / Province</label>
                                        <select
                                            className="w-full bg-white border border-slate-200 rounded-xl p-3.5 text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 shadow-sm transition-all outline-none disabled:opacity-50"
                                            value={profile.targetState}
                                            onChange={(e) => {
                                                setProfileField('targetState', e.target.value);
                                                setProfileField('targetCity', ''); // reset dependent
                                            }}
                                            disabled={State.getStatesOfCountry(profile.targetCountry).length === 0}
                                        >
                                            <option value="" disabled>Select State</option>
                                            {State.getStatesOfCountry(profile.targetCountry).map(state => (
                                                <option key={state.isoCode} value={state.isoCode}>{state.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                )}

                                {profile.targetState && (
                                    <div className="flex flex-col gap-1.5 animate-in fade-in duration-300">
                                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">City / Region</label>
                                        <select
                                            className="w-full bg-white border border-slate-200 rounded-xl p-3.5 text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 shadow-sm transition-all outline-none disabled:opacity-50"
                                            value={profile.targetCity}
                                            onChange={(e) => setProfileField('targetCity', e.target.value)}
                                            disabled={City.getCitiesOfState(profile.targetCountry, profile.targetState).length === 0}
                                        >
                                            <option value="" disabled>Select City</option>
                                            {City.getCitiesOfState(profile.targetCountry, profile.targetState).map(city => (
                                                <option key={city.name} value={city.name}>{city.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                );
            case 2:
                return (
                    <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500 text-left">
                        <label className="text-slate-700 text-sm font-semibold">Describe your ideal client briefly</label>
                        <input
                            type="text"
                            placeholder="e.g. Local restaurants, Real estate agents"
                            className="w-full bg-white border border-slate-200 rounded-xl p-4 text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all shadow-sm"
                            value={profile.targetAudience || ''}
                            onChange={(e) => setProfileField('targetAudience', e.target.value)}
                        />
                    </div>
                );
            case 3:
                return (
                    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 text-left">
                        <div className="flex flex-col gap-2">
                            <label className="text-slate-700 text-sm font-semibold">What services do you offer?</label>
                            <input
                                type="text"
                                placeholder="e.g. SEO, Website Redesign, Custom Apps"
                                className="w-full bg-white border border-slate-200 rounded-xl p-4 text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all shadow-sm"
                                value={profile.servicesOffered}
                                onChange={(e) => setProfileField('servicesOffered', e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-slate-700 text-sm font-semibold">Estimated budget range for your services?</label>
                            <input
                                type="text"
                                placeholder="e.g. $1,000 - $5,000"
                                className="w-full bg-white border border-slate-200 rounded-xl p-4 text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all shadow-sm"
                                value={profile.budgetRange}
                                onChange={(e) => setProfileField('budgetRange', e.target.value)}
                            />
                        </div>
                    </div>
                );
            case 4:
                return (
                    <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500 text-left">
                        <label className="text-slate-700 text-sm font-semibold">Any custom notes for the AI?</label>
                        <textarea
                            rows={4}
                            placeholder="e.g. Prioritize businesses with terrible reviews so I can offer reputation management."
                            className="w-full bg-white border border-slate-200 rounded-xl p-4 text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all shadow-sm resize-none"
                            value={profile.customNotes}
                            onChange={(e) => setProfileField('customNotes', e.target.value)}
                        />
                        <p className="text-xs text-slate-500">This helps the AI find highly targeted leads dynamically.</p>
                    </div>
                );
            default:
                return null;
        }
    };

    const isCurrentStepValid = () => {
        switch (currentStepIndex) {
            case 0: return (profile.companyName?.trim().length > 0) && (profile.businessType?.trim().length > 0);
            case 1: 
                if (profile.locationType === 'global') return true;
                // If region, ensure at least a country is selected. State and City might be empty for some countries.
                return profile.targetCountry.trim().length > 0;
            case 2: return profile.targetAudience?.trim().length > 0;
            case 3: return profile.servicesOffered.trim().length > 0;
            case 4: return true; // optional
            default: return true;
        }
    };

    const renderRightPanelContent = () => {
        const panels = [
            {
                step: 0,
                title: "Tell us about your business",
                desc: "Funnel customizes its AI algorithms based on your specific industry and offerings.",
                icon: <Briefcase className="w-12 h-12 text-blue-500 mb-6" />
            },
            {
                step: 1,
                title: "Define your territory",
                desc: "Whether you operate locally or globally, we'll scan the specific regions you target.",
                icon: <MapPin className="w-12 h-12 text-blue-500 mb-6" />
            },
            {
                step: 2,
                title: "Who is your ideal client?",
                desc: "Give us the persona, and Funnel will find businesses that perfectly match it.",
                icon: <Target className="w-12 h-12 text-blue-500 mb-6" />
            },
            {
                step: 3,
                title: "Scope and Budget",
                desc: "Filter out leads that don't match your pricing model or service capabilities.",
                icon: <Wallet className="w-12 h-12 text-blue-500 mb-6" />
            },
            {
                step: 4,
                title: "Fine-tune the AI",
                desc: "Add any specific nuances you want the AI to look for when scoring potential leads.",
                icon: <Lightbulb className="w-12 h-12 text-blue-500 mb-6" />
            }
        ];

        return (
            <div className="relative h-[250px] w-full mt-12">
                {panels.map((p, idx) => (
                    <div
                        key={idx}
                        className={`absolute inset-0 flex flex-col items-start transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] ${currentStepIndex === idx
                                ? 'opacity-100 translate-y-0 pointer-events-auto'
                                : 'opacity-0 translate-y-8 pointer-events-none'
                            }`}
                    >
                        {p.icon}
                        <h3 className="text-3xl xl:text-4xl font-extrabold mb-4 tracking-tight leading-tight">{p.title}</h3>
                        <p className="text-slate-400 text-lg leading-relaxed">{p.desc}</p>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-slate-50 flex overflow-hidden">
            {/* ── LEFT PANEL (Shrinks to w-1/2 dynamically) ── */}
            <div
                className={`flex flex-col items-center justify-center p-6 h-full min-h-screen transition-all duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)] ${isEntryComplete ? 'w-full lg:w-1/2' : 'w-full'
                    }`}
            >
                <div className="w-full max-w-2xl transition-all duration-700">
                    <div className="mb-8 flex flex-row items-center justify-between">
                        {steps.map((step, idx) => (
                            <div key={step.id} className="flex flex-col items-center gap-2 relative z-10">
                                <div
                                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 shadow-sm bg-white ${idx <= currentStepIndex
                                            ? 'border-blue-600 text-blue-600'
                                            : 'border-slate-200 text-slate-400'
                                        }`}
                                >
                                    {step.icon}
                                </div>
                                <span className={`text-xs absolute -bottom-6 w-24 text-center font-medium ${idx <= currentStepIndex ? 'text-slate-900' : 'text-slate-400'}`}>
                                    {step.title}
                                </span>
                            </div>
                        ))}
                        <div className="absolute left-0 top-5 w-full h-1 bg-slate-200 -z-10 px-10 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-blue-600 transition-all duration-500"
                                style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
                            />
                        </div>
                    </div>

                    <div className="bg-white shadow-xl shadow-slate-200/50 border border-slate-100 rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden mt-12">

                        <h2 className="text-3xl font-extrabold text-slate-900 mb-2 tracking-tight">{steps[currentStepIndex].title}</h2>
                        <p className="text-slate-500 mb-8 font-medium">Step {currentStepIndex + 1} of {steps.length}</p>

                        <div className="min-h-[220px]">
                            {renderStepContent()}
                        </div>

                        <div className="flex justify-between items-center mt-8 pt-6 border-t border-slate-100">
                            <button
                                onClick={handleBack}
                                disabled={currentStepIndex === 0}
                                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${currentStepIndex === 0
                                        ? 'text-slate-300 cursor-not-allowed'
                                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                                    }`}
                            >
                                <ArrowLeft className="w-4 h-4" /> Back
                            </button>
                            <button
                                onClick={handleNext}
                                disabled={!isCurrentStepValid() || isSaving}
                                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white shadow-lg shadow-blue-500/30 px-8 py-3 rounded-xl font-bold transition-all disabled:cursor-not-allowed"
                            >
                                {isSaving ? 'Saving...' : (currentStepIndex === steps.length - 1 ? 'Finish' : 'Continue')}
                                {!isSaving && <ArrowRight className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── RIGHT PANEL (Slides in dynamically) ── */}
            <div
                className={`hidden lg:flex fixed top-0 right-0 h-full w-1/2 bg-[#0a0e1a] z-20 transition-transform duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)] ${isEntryComplete ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                {/* Background glow blobs */}
                <div className="absolute top-[-80px] right-[-80px] w-[420px] h-[420px] rounded-full bg-blue-600/20 blur-[120px] pointer-events-none" />
                <div className="absolute bottom-[-60px] left-[-60px] w-[300px] h-[300px] rounded-full bg-blue-500/10 blur-[100px] pointer-events-none" />

                <div className="relative z-10 w-full h-full flex flex-col justify-center p-14 text-white">
                    <div className="max-w-md">
                        <div className="inline-flex items-center gap-2 bg-blue-600/10 border border-blue-500/20 text-blue-400 text-xs font-semibold px-4 py-2 rounded-full w-fit mb-8">
                            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                            Tailoring your experience
                        </div>

                        {renderRightPanelContent()}
                    </div>
                </div>
            </div>
        </div>
    );
}
