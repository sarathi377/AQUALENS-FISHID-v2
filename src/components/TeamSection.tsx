import React from 'react';
import { Github, Linkedin, Mail } from 'lucide-react';

const TeamSection: React.FC = () => {
    const team = [
        {
            name: "KEERTHASARATHI G K",
            role: "Lead Developer / AI Architect",
            initials: "KS",
            color: "from-alpha-cyan to-blue-600",
            image: "/team/keertha.png"
        },
        {
            name: "BALAKRISHNAN J",
            role: "Full Stack Engineer",
            initials: "BJ",
            color: "from-blue-500 to-indigo-600",
            image: "/team/bala.jpeg"
        },
        {
            name: "GOWTHAM S",
            role: "UI/UX Designer & Data Analyst",
            initials: "GS",
            color: "from-purple-500 to-alpha-cyan",
            image: "/team/gowtham.jpeg"
        }
    ];

    return (
        <section className="mt-12 py-12 border-t border-alpha-700/50">
            <div className="text-center mb-12">
                <h2 className="text-xl font-display font-bold text-white tracking-widest uppercase">
                    Developed By <span className="text-alpha-cyan text-glow">Alpha X</span>
                </h2>
                <p className="text-alpha-muted text-xs font-mono mt-2 uppercase tracking-[0.2em]">
                    Core Engineering Team
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {team.map((member, idx) => (
                    <div
                        key={idx}
                        className="alpha-panel p-6 flex flex-col items-center group hover:border-alpha-cyan/30 transition-all duration-300 hover:-translate-y-1"
                    >
                        {/* Image Circle Area */}
                        <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${member.color} p-1 mb-6 relative`}>
                            <div className="w-full h-full rounded-full bg-alpha-900 flex items-center justify-center overflow-hidden border-2 border-alpha-900/50 relative">
                                {member.image ? (
                                    <img 
                                        src={member.image} 
                                        alt={member.name} 
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        onError={(e) => {
                                            // Fallback to initials if image fails to load
                                            e.currentTarget.style.display = 'none';
                                            const parent = e.currentTarget.parentElement;
                                            if (parent) {
                                                const initialsSpan = document.createElement('span');
                                                initialsSpan.className = "text-2xl font-display font-bold text-white opacity-40 group-hover:opacity-100 transition-opacity";
                                                initialsSpan.innerText = member.initials;
                                                parent.appendChild(initialsSpan);
                                            }
                                        }}
                                    />
                                ) : (
                                    <span className="text-2xl font-display font-bold text-white opacity-40 group-hover:opacity-100 transition-opacity">
                                        {member.initials}
                                    </span>
                                )}
                                {/* Decorative scanning line for team avatars */}
                                <div className="absolute inset-0 bg-alpha-cyan/10 translate-y-full group-hover:translate-y-[-100%] transition-transform duration-[2s] ease-in-out z-10" />
                            </div>
                            <div className="absolute -inset-2 bg-alpha-cyan/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        </div>

                        <h3 className="text-sm font-bold text-white tracking-wide mb-1 group-hover:text-alpha-cyan transition-colors">
                            {member.name}
                        </h3>
                        <p className="text-[11px] text-alpha-muted font-mono uppercase tracking-wider mb-6">
                            {member.role}
                        </p>

                        <div className="flex space-x-4">
                            <button className="p-2 rounded-full bg-alpha-800 border border-alpha-700 text-alpha-muted hover:text-alpha-cyan hover:border-alpha-cyan/50 transition-all">
                                <Github className="w-4 h-4" />
                            </button>
                            <button className="p-2 rounded-full bg-alpha-800 border border-alpha-700 text-alpha-muted hover:text-blue-400 hover:border-blue-400/50 transition-all">
                                <Linkedin className="w-4 h-4" />
                            </button>
                            <button className="p-2 rounded-full bg-alpha-800 border border-alpha-700 text-alpha-muted hover:text-alpha-light hover:border-alpha-light/50 transition-all">
                                <Mail className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Team Motto / Signal */}
            <div className="mt-12 text-center">
                <div className="inline-flex items-center space-x-2 px-3 py-1 bg-alpha-900 border border-alpha-800 rounded-full">
                    <div className="w-1.5 h-1.5 rounded-full bg-alpha-success animate-pulse" />
                    <span className="text-[10px] font-mono text-alpha-muted uppercase tracking-tighter">
                        Alpha X Platform Build v1.0.4 r-2026 // Production Ready
                    </span>
                </div>
            </div>
        </section>
    );
};

export default TeamSection;
