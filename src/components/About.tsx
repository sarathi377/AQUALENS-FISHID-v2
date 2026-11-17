import React, { useState } from 'react';
import { Fish, Camera, MapPin, RefreshCw, Phone, Shield, Brain, ArrowDown, ChevronRight, Globe, Info } from 'lucide-react';
import Auth from './Auth';
import CNNModel from './AI/CNNModel';
import TeamSection from './TeamSection';

interface AboutProps {
    onLogin: (userData: { name: string; email: string }) => void;
}

export default function About({ onLogin }: AboutProps) {
    const [showAuth, setShowAuth] = useState(false);

    const features = [
        {
            icon: <Camera className="w-8 h-8 text-cyan-400" />,
            title: "Smart Identification",
            desc: "AI-powered species detection with freshness and quality assessment using Gemini 2.5 Flash."
        },
        {
            icon: <RefreshCw className="w-8 h-8 text-blue-400" />,
            title: "Marine Weather",
            desc: "Real-time sea telemetry and safety analysis to ensure safe fishing and boating."
        },
        {
            icon: <Phone className="w-8 h-8 text-red-400" />,
            title: "Emergency SOS",
            desc: "Direct access to Coast Guard and emergency services with live GPS tracking."
        }
    ];

    if (showAuth) {
        return (
            <div className="relative min-h-screen animate-fade-in">
                <button
                    onClick={() => setShowAuth(false)}
                    className="absolute z-50 flex items-center gap-2 px-4 py-2 text-sm font-bold transition-all border rounded-full top-8 left-8 text-slate-400 hover:text-white bg-slate-900/50 backdrop-blur-xl border-white/5"
                >
                    ← Back to Project Info
                </button>
                <Auth onLogin={onLogin} />
            </div>
        );
    }

    return (
        <div className="min-h-screen overflow-x-hidden font-sans bg-slate-950 text-slate-100 selection:bg-cyan-500/30">
            {/* Dynamic Background */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] rounded-full bg-blue-600/5 blur-[120px] animate-pulse-ring"></div>
                <div className="absolute bottom-[-20%] right-[-10%] w-[800px] h-[800px] rounded-full bg-cyan-500/5 blur-[120px] animate-pulse-ring" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="relative z-10">
                {/* Navigation Bar */}
                <nav className="flex items-center justify-between px-8 py-6 mx-auto max-w-7xl">
                    <div className="flex items-center gap-3">
                        <div className="p-2 shadow-lg bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-xl shadow-cyan-500/20">
                            <Fish className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-2xl font-black font-['Outfit'] tracking-tight">AquaLens</span>
                    </div>
                    <div className="items-center hidden gap-8 text-sm font-bold md:flex text-slate-400">
                        <a href="#features" className="transition-colors hover:text-white">Features</a>
                        <a href="#technology" className="transition-colors hover:text-white">Technology</a>
                        <a href="#alpha-x" className="transition-colors hover:text-white">Alpha X</a>
                    </div>
                    <button
                        onClick={() => setShowAuth(true)}
                        className="bg-white/5 hover:bg-white/10 border border-white/10 px-6 py-2.5 rounded-full font-bold text-sm transition-all"
                    >
                        Sign In
                    </button>
                </nav>

                {/* Hero Section */}
                <section className="flex flex-col items-center px-8 pt-20 pb-32 mx-auto text-center max-w-7xl">
                    <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 text-xs font-bold border rounded-full bg-cyan-500/10 border-cyan-500/20 text-cyan-400 animate-float">
                        <Shield className="w-3 h-3" />
                        Empowering the Future of Marine Life
                    </div>
                    <h1 className="text-6xl md:text-8xl font-black bg-clip-text text-transparent bg-gradient-to-b from-white via-white/90 to-slate-500 tracking-tighter mb-8 leading-[0.9]">
                        The World's smartest <br className="hidden md:block" />
                        marine assistant.
                    </h1>
                    <p className="max-w-2xl mb-12 text-lg font-medium leading-relaxed md:text-xl text-slate-400">
                        AquaLens uses cutting-edge artificial intelligence to identify species,
                        monitor sea conditions, and keep you safe on the water. Built for the modern marine lifestyle.
                    </p>
                    <div className="flex flex-col gap-4 sm:flex-row">
                        <button
                            onClick={() => setShowAuth(true)}
                            className="px-10 py-5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-black text-lg shadow-2xl shadow-cyan-500/40 transition-all active:scale-[0.98] flex items-center justify-center gap-3 group"
                        >
                            Get Started Now
                            <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                        </button>
                        <a
                            href="#features"
                            className="flex items-center justify-center gap-3 px-10 py-5 text-lg font-bold text-white transition-all border rounded-2xl bg-slate-900 border-white/5 hover:bg-slate-800"
                        >
                            Explore Features
                        </a>
                    </div>

                    <div className="mt-20 w-full max-w-5xl rounded-[3rem] overflow-hidden border border-white/5 shadow-2xl relative aspect-video animate-fade-in">
                        <div className="absolute inset-0 z-10 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
                        <img
                            src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=2070"
                            alt="Deep sea environment"
                            className="object-cover w-full h-full transition-all duration-1000 opacity-60 grayscale hover:grayscale-0"
                        />
                        <div className="absolute z-20 text-left bottom-12 left-12">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-3 border bg-cyan-500/20 backdrop-blur-xl rounded-2xl border-cyan-500/30">
                                    <Brain className="w-8 h-8 text-cyan-400" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black">Powered by Gemini AI</h3>
                                    <p className="text-sm text-slate-400">Real-time visual processing & analysis</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section id="features" className="px-8 py-32 bg-slate-900/40 border-y border-white/5">
                    <div className="mx-auto max-w-7xl">
                        <div className="mb-20 text-center">
                            <h2 className="mb-4 text-4xl font-black">Everything you need at sea.</h2>
                            <p className="font-medium text-slate-400">Three powerful tools integrated into one seamless experience.</p>
                        </div>
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                            {features.map((f, i) => (
                                <div key={i} className="glass-card p-10 rounded-[2.5rem] border border-white/5 hover:border-cyan-500/30 transition-all group">
                                    <div className="p-5 mb-8 transition-transform shadow-xl bg-slate-950 rounded-3xl w-fit group-hover:scale-110">
                                        {f.icon}
                                    </div>
                                    <h3 className="mb-4 text-2xl font-bold">{f.title}</h3>
                                    <p className="text-sm leading-relaxed text-slate-500">{f.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Alpha X & Tech Section */}
                <section id="technology" className="px-8 py-32 mx-auto max-w-7xl">
                    <div className="grid items-center grid-cols-1 gap-20 lg:grid-cols-2">
                        <div>
                            <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-xs font-bold text-blue-400 border rounded-full bg-blue-500/10 border-blue-500/20">
                                <Globe className="w-3 h-3" />
                                Scalable Marine Ecosystem
                            </div>
                            <h2 className="text-5xl font-black mb-8 leading-[1.1]">Developed in <span className="text-cyan-400">Alpha X</span> context.</h2>
                            <p className="mb-10 text-lg leading-relaxed text-slate-400">
                                AquaLens isn't just an app; it's a sophisticated platform developed within the Alpha X environment,
                                focusing on high-performance computations and real-time data streaming between marine sensors and AI modules.
                            </p>
                            <div className="space-y-6">
                                {[
                                    "Vite-speed performance optimization",
                                    "Seamless Gemini 2.5 Flash integration",
                                    "Advanced Marine Weather API data",
                                    "Coast Guard SOS integration"
                                ].map((text, i) => (
                                    <div key={i} className="flex items-center gap-4">
                                        <div className="flex items-center justify-center w-5 h-5 border rounded-full bg-cyan-500/20 border-cyan-500/40">
                                            <div className="w-2 h-2 rounded-full bg-cyan-400"></div>
                                        </div>
                                        <span className="font-bold text-slate-300">{text}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="relative">
                            <div className="absolute inset-0 bg-blue-500/20 blur-[120px] rounded-full"></div>
                            <div className="relative glass-card p-12 rounded-[3.5rem] border border-white/10 shadow-3xl bg-slate-900/60 backdrop-blur-3xl">
                                <div className="flex items-center gap-6 mb-12">
                                    <div className="p-4 shadow-xl bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl">
                                        <Info className="w-10 h-10 text-white" />
                                    </div>
                                    <div>
                                        <h4 className="text-2xl font-black">Project Specs</h4>
                                        <p className="text-slate-500">Version 1.0.4 - SeaReady</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-8 mb-12">
                                    <div>
                                        <p className="mb-1 text-xs font-bold tracking-widest uppercase text-slate-500">Architecture</p>
                                        <p className="text-xl font-bold">React + Vite</p>
                                    </div>
                                    <div>
                                        <p className="mb-1 text-xs font-bold tracking-widest uppercase text-slate-500">AI core</p>
                                        <p className="text-xl font-bold text-cyan-400">Gemini 2.5</p>
                                    </div>
                                    <div>
                                        <p className="mb-1 text-xs font-bold tracking-widest uppercase text-slate-500">Dev Environment</p>
                                        <p className="text-xl font-bold">Alpha X</p>
                                    </div>
                                    <div className="col-span-2">
                                        <p className="mb-1 text-xs font-bold tracking-widest uppercase text-slate-500">Inference Engine</p>
                                        <p className="text-xl font-bold text-indigo-400">Custom CNN Architecture</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setShowAuth(true)}
                                    className="flex items-center justify-center w-full gap-3 py-5 text-lg font-black transition-all bg-white rounded-2xl text-slate-950 hover:bg-slate-200"
                                >
                                    Authenticate to Enter
                                    <ArrowDown className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CNN Model Section */}
                <section className="px-8 py-32 mx-auto max-w-7xl">
                    <CNNModel />
                    <TeamSection />
                </section>

                {/* Footer */}
                <footer className="px-8 py-20 border-t border-white/5">
                    <div className="flex flex-col items-center justify-between gap-10 mx-auto max-w-7xl md:flex-row">
                        <div className="flex items-center gap-3 opacity-50">
                            <Fish className="w-6 h-6" />
                            <span className="text-xl font-black font-['Outfit'] tracking-tight">AquaLens</span>
                        </div>
                        <p className="text-sm font-medium text-slate-500">© 2026 AquaLens Marine Systems. All rights reserved.</p>
                        <div className="flex gap-8 text-xs font-bold tracking-widest uppercase text-slate-500">
                            <a href="#" className="transition-colors hover:text-white">Privacy</a>
                            <a href="#" className="transition-colors hover:text-white">Security</a>
                            <a href="#" className="transition-colors hover:text-white">Terms</a>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
}
