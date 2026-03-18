'use client';

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, BarChart3, Target, Zap, CheckCircle2 } from "lucide-react";
import { auth } from "@/lib/firebase";

export default function Home() {
  const router = useRouter();

  const handleAuthClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (auth.currentUser) {
      router.push('/dashboard');
    } else {
      router.push('/login');
    }
  };
  return (
    <main className="min-h-screen bg-[#FBFBFA] text-[#111827] font-sans selection:bg-blue-100 overflow-x-hidden">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 w-full bg-white/20 backdrop-blur-xl saturate-[1.2] border-b border-white/50 shadow-[0_8px_32px_0_rgba(31,38,135,0.05)] px-6 sm:px-12 h-16 transition-all duration-300">
        {/* Absolutely centered inner layout */}
        <div className="h-full max-w-7xl mx-auto flex items-center justify-between">
          {/* Left: Logo + Nav links */}
          <div className="flex items-center gap-8 h-full">
            <Link href="/" className="flex items-center h-full group">
              <img src="/Funnel-logo.svg" alt="Funnel Logo" className="h-10 w-auto group-hover:scale-105 transition-transform duration-300" />
            </Link>
            <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
              <Link href="#" className="hover:text-slate-900 transition-colors">Product</Link>
              <Link href="#" className="hover:text-slate-900 transition-colors">Solutions</Link>
              <Link href="#" className="hover:text-slate-900 transition-colors">Customers</Link>
              <Link href="#" className="hover:text-slate-900 transition-colors">Pricing</Link>
            </div>
          </div>
          {/* Right: Actions */}
          <div className="flex items-center gap-4">
            <button onClick={handleAuthClick} className="text-sm font-semibold text-slate-700 hover:text-slate-900 transition-colors">
              Log in
            </button>
            <button
              onClick={handleAuthClick}
              className="hidden sm:flex bg-[#111827] hover:bg-slate-800 text-white px-5 py-2.5 rounded-full text-sm font-semibold transition-all shadow-sm"
            >
              Start for free
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 px-6 sm:px-12 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
        {/* Left Copy */}
        <div className="flex-1 flex flex-col items-start gap-8 z-10">
          <h1 className="text-5xl sm:text-6xl lg:text-[5.5rem] font-extrabold tracking-tight text-slate-900 leading-[1.05]">
            The AI that finds your next <span className="text-blue-600">Client.</span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 max-w-xl font-medium leading-relaxed">
            Turn scattered local business data into clear, actionable leads. Funnel connects criteria, scores opportunities, and keeps your pipeline full so you can prove impact without the manual effort.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <button
              onClick={handleAuthClick}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full text-lg font-bold transition-all shadow-lg hover:shadow-blue-500/25"
            >
              Find Your's Now
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={handleAuthClick}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white border-2 border-slate-200 hover:border-slate-300 text-slate-800 px-8 py-4 rounded-full text-lg font-bold transition-all shadow-sm"
            >
              Book a demo
            </button>
          </div>
          <p className="text-sm text-slate-500 font-medium mt-2">No credit card required • 7-day free trial</p>
        </div>

        {/* Right Graphic representing "Data flowing into a Funnel" */}
        <div className="flex-1 relative w-full max-w-lg lg:max-w-none">
          <div className="absolute inset-0 bg-blue-500/5 blur-[100px] rounded-full"></div>
          <div className="relative bg-white border border-slate-200/80 rounded-3xl shadow-2xl overflow-hidden p-8 flex flex-col gap-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                  <Target className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">Lead Scoring Engine</h3>
                  <p className="text-xs text-slate-500">Processing live targets...</p>
                </div>
              </div>
              <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Active
              </span>
            </div>

            <div className="space-y-4">
              {[
                { name: "Smith & Co. Legal", score: 92, label: "High Intent", color: "bg-emerald-500" },
                { name: "Downtown Dental", score: 85, label: "Medium", color: "bg-yellow-500" },
                { name: "Apex Roofing", score: 45, label: "Low Intent", color: "bg-slate-300" }
              ].map((lead, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 border border-slate-100 rounded-2xl transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="bg-white p-2 border border-slate-200 rounded-lg shadow-sm">
                      <BarChart3 className="w-4 h-4 text-slate-600" />
                    </div>
                    <span className="font-semibold text-slate-800">{lead.name}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-md ${lead.score > 80 ? 'bg-emerald-100 text-emerald-700' :
                      lead.score > 50 ? 'bg-yellow-100 text-yellow-700' : 'bg-slate-200 text-slate-600'
                      }`}>
                      {lead.label}
                    </span>
                    <span className="font-black text-slate-900 w-8 text-right">{lead.score}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 cursor-pointer">
              <Zap className="w-4 h-4" />
              Analyze 500+ more leads
            </div>
          </div>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="border-y border-slate-200/60 bg-white py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-8 justify-between opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest text-center md:text-left">
            Trusted by modern agencies
          </p>
          <div className="flex flex-wrap items-center justify-center gap-12 font-black text-2xl text-slate-300">
            <span>acme</span>
            <span>globex</span>
            <span>soylent</span>
            <span>initrode</span>
            <span>hooli</span>
          </div>
        </div>
      </section>

      {/* Feature Highlight */}
      <section className="py-24 px-6 sm:px-12 max-w-7xl mx-auto text-center">
        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 mb-6">
          Unify data without limits.
        </h2>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-16">
          Gather all your prospecting data in one place with Funnel's unmatched AI engine and custom criteria matching.
        </p>

        <div className="grid md:grid-cols-3 gap-8 text-left">
          {[
            {
              title: "AI-Powered Scoring",
              desc: "Automatically evaluate local business footprints and prioritize high-conversion targets."
            },
            {
              title: "Actionable Insights",
              desc: "Turn messy multi-channel discovery into clear, easy-to-read pipeline recommendations."
            },
            {
              title: "Seamless Outreach",
              desc: "Generate custom pitches and export your qualified leads directly to your CRM."
            }
          ].map((feature, i) => (
            <div key={i} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
                <CheckCircle2 className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
              <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

    </main>
  );
}
