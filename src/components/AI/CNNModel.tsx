import React from 'react';
import { Layers, Zap, Database, Target, Cpu } from 'lucide-react';

export default function CNNModel() {
    const layers = [
        { title: "Input Layer", type: "Image Data", size: "224x224x3", color: "bg-slate-800" },
        { title: "Convolutional", type: "Feature Extraction", size: "32 filters", color: "bg-blue-600/20" },
        { title: "Pooling", type: "Dimensionality Reduction", size: "Max Pooling", color: "bg-cyan-600/20" },
        { title: "Dense Layer", type: "Classification", size: "Softmax", color: "bg-indigo-600/20" }
    ];

    return (
        <div className="glass-card rounded-[3rem] p-8 md:p-12 border border-white/10 shadow-3xl bg-slate-900/40 backdrop-blur-3xl">
            <div className="flex flex-col lg:flex-row gap-16">
                <div className="flex-1">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold mb-6">
                        <Cpu className="w-3 h-3" />
                        Neural Architecture
                    </div>
                    <h2 className="text-4xl font-black mb-6">Deep Learning <span className="text-indigo-400">CNN Model</span></h2>
                    <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                        Our specialized Convolutional Neural Network is trained on over 50,000 marine species images.
                        Developed in the Alpha X context, it uses advanced feature mapping to identify fish with extreme precision.
                    </p>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
                            <Target className="w-6 h-6 text-indigo-400 mb-3" />
                            <p className="text-2xl font-black">98.4%</p>
                            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Accuracy</p>
                        </div>
                        <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
                            <Zap className="w-6 h-6 text-yellow-400 mb-3" />
                            <p className="text-2xl font-black">42ms</p>
                            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Inference</p>
                        </div>
                    </div>
                </div>

                <div className="flex-1">
                    <div className="relative space-y-4">
                        {layers.map((layer, i) => (
                            <div key={i} className={`relative flex items-center justify-between p-6 rounded-2xl border border-white/10 ${layer.color} animate-fade-in`} style={{ animationDelay: `${i * 0.2}s` }}>
                                <div>
                                    <h4 className="font-bold text-white">{layer.title}</h4>
                                    <p className="text-slate-400 text-xs">{layer.type}</p>
                                </div>
                                <span className="text-xs font-mono font-bold text-slate-500">{layer.size}</span>
                                {i < layers.length - 1 && (
                                    <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 z-20">
                                        <div className="w-px h-4 bg-gradient-to-b from-white/20 to-transparent"></div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
