import React, { useState } from 'react';
import { Fish, Mail, Lock, User, ArrowRight, Loader2, AlertCircle, Eye, EyeOff } from 'lucide-react';

interface AuthProps {
    onLogin: (userData: { name: string; email: string }) => void;
}

export default function Auth({ onLogin }: AuthProps) {
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        try {
            if (isLogin) {
                // Mock Login logic
                const storedUsers = JSON.parse(localStorage.getItem('aqualens_users') || '[]');
                const user = storedUsers.find((u: any) => u.email === formData.email && u.password === formData.password);

                if (user) {
                    localStorage.setItem('aqualens_logged_in', 'true');
                    localStorage.setItem('aqualens_current_user', JSON.stringify({ name: user.name, email: user.email }));
                    onLogin({ name: user.name, email: user.email });
                } else {
                    setError('Invalid email or password');
                }
            } else {
                // Mock Register logic
                if (!formData.name || !formData.email || !formData.password) {
                    setError('All fields are required');
                    setLoading(false);
                    return;
                }

                const storedUsers = JSON.parse(localStorage.getItem('aqualens_users') || '[]');
                if (storedUsers.some((u: any) => u.email === formData.email)) {
                    setError('Email already registered');
                } else {
                    const newUser = { name: formData.name, email: formData.email, password: formData.password };
                    storedUsers.push(newUser);
                    localStorage.setItem('aqualens_users', JSON.stringify(storedUsers));
                    localStorage.setItem('aqualens_logged_in', 'true');
                    localStorage.setItem('aqualens_current_user', JSON.stringify({ name: newUser.name, email: newUser.email }));
                    onLogin({ name: newUser.name, email: newUser.email });
                }
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative flex items-center justify-center w-full min-h-screen p-4 overflow-hidden bg-slate-950">
            {/* Animated Background Elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-600/10 blur-[100px] animate-pulse-ring"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-cyan-500/10 blur-[100px] animate-pulse-ring" style={{ animationDelay: '1s' }}></div>

            <div className="relative z-10 w-full max-w-md animate-fade-in">
                {/* Logo Section */}
                <div className="mb-8 text-center">
                    <div className="inline-block p-4 mb-4 shadow-2xl rounded-3xl bg-gradient-to-tr from-cyan-500 to-blue-600 shadow-cyan-500/20 animate-float">
                        <Fish className="w-12 h-12 text-white" />
                    </div>
                    <h1 className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-100 via-cyan-100 to-white tracking-tight font-['Outfit']">
                        AquaLens
                    </h1>
                    <p className="mt-2 font-medium text-slate-400">Smart Marine Identification</p>
                </div>

                {/* Auth Card */}
                <div className="glass-card rounded-[2.5rem] p-8 border border-white/10 shadow-2xl backdrop-blur-3xl bg-slate-900/40">
                    <div className="flex gap-4 p-1 mb-8 border bg-slate-950/50 rounded-2xl border-white/5">
                        <button
                            onClick={() => setIsLogin(true)}
                            className={`flex-1 py-3 px-4 rounded-xl font-bold transition-all ${isLogin ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20' : 'text-slate-500 hover:text-slate-300'}`}
                        >
                            Login
                        </button>
                        <button
                            onClick={() => setIsLogin(false)}
                            className={`flex-1 py-3 px-4 rounded-xl font-bold transition-all ${!isLogin ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20' : 'text-slate-500 hover:text-slate-300'}`}
                        >
                            Register
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {!isLogin && (
                            <div className="space-y-2">
                                <label className="ml-1 text-xs font-bold tracking-widest uppercase text-slate-500">Full Name</label>
                                <div className="relative group">
                                    <User className="absolute w-5 h-5 transition-colors -translate-y-1/2 left-4 top-1/2 text-slate-500 group-focus-within:text-cyan-400" />
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="Enter your name"
                                        className="w-full py-4 pl-12 pr-4 text-white transition-all border outline-none bg-slate-950/50 border-white/10 rounded-2xl placeholder-slate-600 focus:border-cyan-500/50 focus:ring-4 focus:ring-cyan-500/5"
                                    />
                                </div>
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="ml-1 text-xs font-bold tracking-widest uppercase text-slate-500">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute w-5 h-5 transition-colors -translate-y-1/2 left-4 top-1/2 text-slate-500 group-focus-within:text-cyan-400" />
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="name@example.com"
                                    className="w-full py-4 pl-12 pr-4 text-white transition-all border outline-none bg-slate-950/50 border-white/10 rounded-2xl placeholder-slate-600 focus:border-cyan-500/50 focus:ring-4 focus:ring-cyan-500/5"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="ml-1 text-xs font-bold tracking-widest uppercase text-slate-500">Password</label>
                            <div className="relative group">
                                <Lock className="absolute w-5 h-5 transition-colors -translate-y-1/2 left-4 top-1/2 text-slate-500 group-focus-within:text-cyan-400" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={formData.password}
                                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                                    placeholder="••••••••"
                                    className="w-full py-4 pl-12 pr-12 text-white transition-all border outline-none bg-slate-950/50 border-white/10 rounded-2xl placeholder-slate-600 focus:border-cyan-500/50 focus:ring-4 focus:ring-cyan-500/5"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute transition-colors -translate-y-1/2 right-4 top-1/2 text-slate-500 hover:text-cyan-400"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <div className="flex items-center gap-2 p-4 text-sm text-red-400 border rounded-2xl bg-red-500/10 border-red-500/20 animate-shake">
                                <AlertCircle className="w-4 h-4 shrink-0" />
                                <p>{error}</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold py-4 rounded-2xl transition-all shadow-xl shadow-cyan-500/20 active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-50 group hover:shadow-cyan-500/40"
                        >
                            {loading ? (
                                <Loader2 className="w-6 h-6 animate-spin" />
                            ) : (
                                <>
                                    {isLogin ? 'Login Now' : 'Create Account'}
                                    <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                                </>
                            )}
                        </button>
                    </form>

                    <p className="mt-8 text-sm font-medium text-center text-slate-500">
                        {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
                        <button
                            onClick={() => setIsLogin(!isLogin)}
                            className="font-bold underline transition-all text-cyan-400 hover:text-cyan-300 underline-offset-4 decoration-2 decoration-cyan-400/30 hover:decoration-cyan-400"
                        >
                            {isLogin ? 'Register New User' : 'Login Here'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}
