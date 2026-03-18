'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, ArrowRight, Zap, Target, BarChart3 } from 'lucide-react';
import { auth } from '@/lib/firebase';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [tab, setTab] = useState<'login' | 'signup'>('login');

    // Auto-redirect if already logged in via persistent session
    useEffect(() => {
        if (auth.currentUser) {
            setIsSuccess(true);
            setTimeout(() => {
                router.push('/dashboard');
            }, 800);
        }
    }, [router]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate a check whether the user has completed onboarding.
        // In a real app, this would come from your auth provider or database.
        const hasCompletedOnboarding = false; // Set to false to test the onboarding flow from login

        if (tab === 'signup' || !hasCompletedOnboarding) {
            // Trigger screen-wash animation for signup OR if onboarding is incomplete
            setIsSuccess(true);
            setTimeout(() => {
                router.push('/onboarding');
            }, 800); // Wait for transition
        } else {
            // Simulate auth — redirect to dashboard for existing fully onboarded users
            setTimeout(() => {
                router.push('/dashboard');
            }, 1200);
        }
    };

    const handleGoogle = async () => {
        setIsLoading(true);
        try {
            const provider = new GoogleAuthProvider();
            await signInWithPopup(auth, provider);
            
            // Authentication successful
            setIsSuccess(true);
            setTimeout(() => {
                // In future passes, we would check Firestore if they have an onboarding profile already here.
                // For now, push all new external signups to onboarding.
                router.push('/onboarding');
            }, 800);

        } catch (error: any) {
            console.error("Google Auth Failed:", error.message);
            alert(`Authentication failed: ${error.message}`);
            setIsLoading(false);
        }
    };

    const stats = [
        { icon: <Target className="w-5 h-5" />, label: 'Leads Scored', value: '500K+' },
        { icon: <BarChart3 className="w-5 h-5" />, label: 'Clients Found', value: '12K+' },
        { icon: <Zap className="w-5 h-5" />, label: 'Time Saved', value: '80%' },
    ];

    return (
        <div className="min-h-screen flex">
            {/* ── LEFT PANEL ── */}
            <div className="hidden lg:flex flex-col justify-between w-1/2 bg-[#0a0e1a] relative overflow-hidden p-14">
                {/* Background glow blobs */}
                <div className="absolute top-[-80px] left-[-80px] w-[420px] h-[420px] rounded-full bg-blue-600/20 blur-[120px] pointer-events-none" />
                <div className="absolute bottom-[-60px] right-[-60px] w-[300px] h-[300px] rounded-full bg-blue-500/10 blur-[100px] pointer-events-none" />

                {/* Logo */}
                <div>
                    <Link href="/">
                        <img src="/Funnel-logo.svg" alt="Funnel" className="h-9 w-auto brightness-0 invert" />
                    </Link>
                </div>

                {/* Center copy */}
                <div className="flex flex-col gap-8 z-10">
                    <div className="inline-flex items-center gap-2 bg-blue-600/10 border border-blue-500/20 text-blue-400 text-xs font-semibold px-4 py-2 rounded-full w-fit">
                        <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                        AI-Powered Client Discovery
                    </div>

                    <h1 className="text-4xl xl:text-5xl font-extrabold text-white leading-tight tracking-tight">
                        The AI that finds<br />your next{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">
                            Client.
                        </span>
                    </h1>

                    <p className="text-slate-400 text-lg leading-relaxed max-w-md">
                        Funnel scores local business opportunities, keeps your pipeline full, and surfaces your next win — automatically.
                    </p>

                    {/* Stats row */}
                    <div className="flex flex-col gap-4 mt-2">
                        {stats.map((s, i) => (
                            <div key={i} className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                                    {s.icon}
                                </div>
                                <div>
                                    <p className="text-white font-bold text-lg leading-none">{s.value}</p>
                                    <p className="text-slate-500 text-sm">{s.label}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom quote */}
                <div className="border-t border-white/10 pt-8 z-10">
                    <p className="text-slate-400 text-sm italic">
                        "Funnel doubled our qualified pipeline in the first week."
                    </p>
                    <p className="text-slate-600 text-xs mt-2">— Early access user</p>
                </div>
            </div>

            {/* ── RIGHT PANEL ── */}
            <div
                className={`flex items-center justify-center bg-white px-6 py-12 absolute right-0 h-full z-20 transition-all duration-[800ms] ease-[cubic-bezier(0.25,1,0.5,1)] ${isSuccess ? 'w-full !px-0' : 'w-full lg:w-1/2'
                    }`}
            >
                <div className={`w-full max-w-[420px] transition-opacity duration-300 ${isSuccess ? 'opacity-0' : 'opacity-100'}`}>
                    {/* Mobile logo */}
                    <div className="lg:hidden mb-10 flex justify-center">
                        <Link href="/">
                            <img src="/Funnel-logo.svg" alt="Funnel" className="h-8 w-auto" />
                        </Link>
                    </div>

                    {/* Header */}
                    <div className="mb-8">
                        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                            {tab === 'login' ? 'Welcome back' : 'Create your account'}
                        </h2>
                        <p className="text-slate-500 text-sm mt-1">
                            {tab === 'login'
                                ? 'Sign in to find your next client.'
                                : 'Start your 7-day free trial today.'}
                        </p>
                    </div>

                    {/* Tab switcher */}
                    <div className="flex bg-slate-100 rounded-xl p-1 mb-8">
                        {(['login', 'signup'] as const).map((t) => (
                            <button
                                key={t}
                                onClick={() => setTab(t)}
                                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${tab === t
                                    ? 'bg-white text-slate-900 shadow-sm'
                                    : 'text-slate-500 hover:text-slate-700'
                                    }`}
                            >
                                {t === 'login' ? 'Log In' : 'Sign Up'}
                            </button>
                        ))}
                    </div>

                    {/* Google sign-in */}
                    <button
                        onClick={handleGoogle}
                        disabled={isLoading}
                        className="w-full flex items-center justify-center gap-3 border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm py-3 rounded-xl transition-all duration-200 mb-6 shadow-sm disabled:opacity-60"
                    >
                        {/* Google SVG icon */}
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path
                                fill="#4285F4"
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            />
                            <path
                                fill="#34A853"
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            />
                            <path
                                fill="#FBBC05"
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                            />
                            <path
                                fill="#EA4335"
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            />
                        </svg>
                        Continue with Google
                    </button>

                    {/* Divider */}
                    <div className="flex items-center gap-4 mb-6">
                        <div className="flex-1 h-px bg-slate-200" />
                        <span className="text-xs text-slate-400 font-medium">or continue with email</span>
                        <div className="flex-1 h-px bg-slate-200" />
                    </div>

                    {/* Email/Password form */}
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-semibold text-slate-700">Email address</label>
                            <input
                                type="email"
                                required
                                placeholder="you@company.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all"
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-semibold text-slate-700">Password</label>
                                {tab === 'login' && (
                                    <button type="button" className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                                        Forgot password?
                                    </button>
                                )}
                            </div>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-xl px-4 py-3 pr-12 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm py-3.5 rounded-xl transition-all duration-200 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 disabled:opacity-70 mt-2"
                        >
                            {isLoading ? (
                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    {tab === 'login' ? 'Sign In' : 'Create Account'}
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Footer note */}
                    <p className="text-center text-xs text-slate-400 mt-6">
                        {tab === 'login' ? (
                            <>
                                Don&apos;t have an account?{' '}
                                <button onClick={() => setTab('signup')} className="text-blue-600 font-semibold hover:text-blue-700">
                                    Sign up free
                                </button>
                            </>
                        ) : (
                            <>
                                Already have an account?{' '}
                                <button onClick={() => setTab('login')} className="text-blue-600 font-semibold hover:text-blue-700">
                                    Sign in
                                </button>
                            </>
                        )}
                    </p>

                    <p className="text-center text-xs text-slate-300 mt-4">
                        By continuing, you agree to our{' '}
                        <span className="underline cursor-pointer hover:text-slate-400">Terms</span> &amp;{' '}
                        <span className="underline cursor-pointer hover:text-slate-400">Privacy Policy</span>.
                    </p>
                </div>
            </div>
        </div>
    );
}
