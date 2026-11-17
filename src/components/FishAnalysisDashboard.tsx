
import React from 'react';
import { Fish, Info, RefreshCw, Award, Activity, CheckCircle, AlertCircle, Thermometer } from 'lucide-react';
import { FishResult } from '../types';

interface FishAnalysisDashboardProps {
    result: FishResult;
    image: string | null;
    onNewScan: () => void;
}

const FishAnalysisDashboard: React.FC<FishAnalysisDashboardProps> = ({ result, image, onNewScan }) => {
    const getFreshnessColor = (grade: string) => {
        switch (grade) {
            case 'Excellent': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
            case 'Good': return 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20';
            case 'Fair': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
            case 'Poor': return 'text-red-400 bg-red-400/10 border-red-400/20';
            default: return 'text-slate-400 bg-slate-400/10 border-slate-400/20';
        }
    };

    const getQualityColor = (grade: string) => {
        switch (grade) {
            case 'Premium': return 'text-purple-400 bg-purple-400/10 border-purple-400/20';
            case 'Good': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
            case 'Average': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
            case 'Below Average': return 'text-orange-400 bg-orange-400/10 border-orange-400/20';
            default: return 'text-slate-400 bg-slate-400/10 border-slate-400/20';
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto animate-message-in">
            <div className="relative overflow-hidden border shadow-2xl bg-slate-900/80 backdrop-blur-xl border-white/10 rounded-3xl">
                {/* Ocean Gradient Header */}
                <div className="absolute top-0 left-0 w-full h-32 pointer-events-none bg-gradient-to-br from-cyan-900/40 via-blue-900/40 to-slate-900/0"></div>
                <div className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none w-96 h-96 bg-cyan-500/5 blur-3xl"></div>

                {/* Top Actions */}
                <div className="relative z-10 flex items-center justify-between p-6 pb-2">
                    <div className="flex items-center gap-2 px-3 py-1 border rounded-full bg-cyan-950/50 border-cyan-500/20">
                        <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
                        <span className="text-xs font-bold tracking-wider uppercase text-cyan-400">Analysis Report</span>
                    </div>
                    <button
                        onClick={onNewScan}
                        className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white transition-all border bg-white/5 hover:bg-white/10 border-white/10 rounded-xl hover:scale-105 active:scale-95"
                    >
                        <RefreshCw className="w-3 h-3" /> New Scan
                    </button>
                </div>

                <div className="relative z-10 p-6 pt-2">

                    {/* Main Fish Identity Card */}
                    <div className="flex flex-col gap-8 mb-8 md:flex-row">
                        {/* Image Section */}
                        <div className="relative flex-shrink-0 group">
                            <div className="absolute inset-0 transition-opacity duration-500 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl blur opacity-20 group-hover:opacity-40"></div>
                            <div className="relative w-full h-64 overflow-hidden border shadow-2xl md:w-64 rounded-2xl border-white/10 bg-slate-950">
                                {image ? (
                                    <img src={image} alt={result.commonName} className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110" />
                                ) : (
                                    <div className="flex items-center justify-center w-full h-full text-slate-700">
                                        <Fish className="w-20 h-20" />
                                    </div>
                                )}
                                {result.confidence && (
                                    <div className="absolute bottom-3 left-3 right-3">
                                        <div className="flex items-center justify-between p-3 border bg-black/60 backdrop-blur-md border-white/10 rounded-xl">
                                            <span className="text-xs font-medium text-slate-300">Confidence</span>
                                            <div className="flex items-center gap-2">
                                                <div className="w-16 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                                                    <div className="h-full bg-cyan-400" style={{ width: `${result.confidence}%` }}></div>
                                                </div>
                                                <span className="text-xs font-bold text-white">{result.confidence}%</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Info Section */}
                        <div className="flex flex-col justify-center flex-1">
                            <div>
                                <h1 className="mb-2 text-4xl font-bold tracking-tight text-white md:text-5xl">
                                    {result.commonName || "Unknown Species"}
                                </h1>
                                <h2 className="mb-6 font-serif text-xl italic text-cyan-400 opacity-90">
                                    {result.scientificName}
                                </h2>
                            </div>

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                {result.category && (
                                    <div className="flex items-start gap-3 p-3 border rounded-xl bg-white/5 border-white/5">
                                        <Activity className="w-5 h-5 text-cyan-400 mt-0.5" />
                                        <div>
                                            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-0.5">Category</p>
                                            <p className="text-sm text-slate-200">{result.category}</p>
                                        </div>
                                    </div>
                                )}
                                {result.edibility && (
                                    <div className="flex items-start gap-3 p-3 border rounded-xl bg-white/5 border-white/5">
                                        <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                                        <div>
                                            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-0.5">Edibility</p>
                                            <p className="text-sm text-slate-200">{result.edibility}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
                        {/* Nutrition Section (Full Width) */}
                        {result.nutrition && (
                            <div className="md:col-span-12">
                                <div className="relative p-6 border bg-slate-800/40 rounded-2xl border-white/5 hover:border-cyan-500/20 transition-all">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400">
                                            <Activity className="w-5 h-5" />
                                        </div>
                                        <h3 className="text-sm font-bold tracking-widest uppercase text-slate-200">Nutritional Value (per 100g)</h3>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                        <div className="p-4 border rounded-xl bg-white/5 border-white/5">
                                            <p className="text-xs text-slate-400 font-bold uppercase mb-2">Protein Intake</p>
                                            <p className="text-xl font-black text-white">{result.nutrition.protein}</p>
                                        </div>
                                        <div className="p-4 border rounded-xl bg-white/5 border-white/5">
                                            <p className="text-xs text-slate-400 font-bold uppercase mb-2">Vitamins & Minerals</p>
                                            <div className="flex flex-wrap gap-2">
                                                {result.nutrition.vitamins.map((v, i) => (
                                                    <span key={i} className="text-[10px] px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-400 font-bold border border-cyan-500/20">
                                                        {v}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="p-4 border rounded-xl bg-white/5 border-white/5">
                                            <p className="text-xs text-slate-400 font-bold uppercase mb-2">Health Benefits</p>
                                            <p className="text-xs leading-relaxed text-slate-300">{result.nutrition.benefits}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Left Column: Freshness & Quality */}
                        <div className="space-y-6 md:col-span-7">

                            {/* Freshness Section */}
                            {result.freshness && (
                                <div className="relative p-6 transition-all duration-300 border group bg-slate-800/50 rounded-2xl border-white/5 hover:border-cyan-500/30">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition-transform duration-300">
                                                <Thermometer className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold text-slate-100">Freshness</h3>
                                                <p className="text-xs text-slate-400">Biological condition analysis</p>
                                            </div>
                                        </div>
                                        <span className={`px-3 py-1 rounded-lg text-xs font-bold border uppercase tracking-wider ${getFreshnessColor(result.freshness.grade)}`}>
                                            {result.freshness.grade}
                                        </span>
                                    </div>

                                    <div className="mb-5">
                                        <div className="flex justify-between mb-2 text-xs">
                                            <span className="font-medium text-slate-400">Score</span>
                                            <span className="font-mono font-bold text-emerald-400">{result.freshness.score}/100</span>
                                        </div>
                                        <div className="h-4 overflow-hidden border rounded-full bg-slate-900 border-white/5">
                                            <div
                                                className="h-full bg-gradient-to-r from-emerald-600 to-green-400 shadow-[0_0_15px_rgba(52,211,153,0.5)] transition-all duration-1000 ease-out"
                                                style={{ width: `${result.freshness.score}%` }}
                                            ></div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2">
                                        {result.freshness.indicators.slice(0, 4).map((indicator, idx) => (
                                            <div key={idx} className="flex items-center gap-2 px-3 py-2 border rounded-lg bg-emerald-500/5 border-emerald-500/10">
                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
                                                <span className="text-xs font-medium truncate text-emerald-100/80">{indicator}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Quality Section */}
                            {result.quality && (
                                <div className="relative p-6 transition-all duration-300 border group bg-slate-800/50 rounded-2xl border-white/5 hover:border-purple-500/30">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 group-hover:scale-110 transition-transform duration-300">
                                                <Award className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold text-slate-100">Quality</h3>
                                                <p className="text-xs text-slate-400">Market value assessment</p>
                                            </div>
                                        </div>
                                        <span className={`px-3 py-1 rounded-lg text-xs font-bold border uppercase tracking-wider ${getQualityColor(result.quality.grade)}`}>
                                            {result.quality.grade}
                                        </span>
                                    </div>

                                    <div className="mb-5">
                                        <div className="flex justify-between mb-2 text-xs">
                                            <span className="font-medium text-slate-400">Score</span>
                                            <span className="font-mono font-bold text-purple-400">{result.quality.score}/100</span>
                                        </div>
                                        <div className="h-4 overflow-hidden border rounded-full bg-slate-900 border-white/5">
                                            <div
                                                className="h-full bg-gradient-to-r from-purple-600 to-fuchsia-400 shadow-[0_0_15px_rgba(192,132,252,0.5)] transition-all duration-1000 ease-out"
                                                style={{ width: `${result.quality.score}%` }}
                                            ></div>
                                        </div>
                                    </div>

                                    {result.quality.assessment && (
                                        <div className="p-3 border rounded-lg bg-purple-500/5 border-purple-500/10">
                                            <p className="text-sm italic leading-relaxed text-purple-100/80">
                                                "{result.quality.assessment}"
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Right Column: Features & Habitat */}
                        <div className="space-y-6 md:col-span-5">
                            <div className="flex flex-col h-full p-6 border bg-slate-900/60 rounded-2xl border-white/5">
                                <div className="flex items-center gap-3 mb-6">
                                    <Info className="w-5 h-5 text-cyan-400" />
                                    <h3 className="text-sm font-bold tracking-widest uppercase text-slate-200">Key Features</h3>
                                </div>

                                {result.features && (
                                    <ul className="mb-8 space-y-4">
                                        {result.features.map((feature, idx) => (
                                            <li key={idx} className="flex gap-3 text-sm text-slate-300 group">
                                                <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 mt-2 shrink-0 group-hover:scale-150 transition-transform"></div>
                                                <span className="transition-colors group-hover:text-cyan-100">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                )}

                                {result.habitat && (
                                    <div className="pt-6 mt-auto border-t border-white/5">
                                        <h4 className="mb-2 text-xs font-bold tracking-wider uppercase text-slate-400">Natural Habitat</h4>
                                        <p className="text-sm leading-relaxed text-slate-300">
                                            {result.habitat}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>

                    {/* Footer - Error Display if exists */}
                    {result.error && (
                        <div className="p-4 mt-6 text-sm text-center text-red-100 border rounded-xl bg-red-400/10 border-red-400/20">
                            {result.error}
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default FishAnalysisDashboard;
