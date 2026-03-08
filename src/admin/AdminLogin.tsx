import { useState, type FormEvent } from 'react';
import { useAuth } from './AdminAuth';
import { Eye, EyeOff, Lock, Mail, ShieldCheck } from 'lucide-react';

export function AdminLogin() {
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [shake, setShake] = useState(false);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Small artificial delay to prevent brute-force feel
        setTimeout(() => {
            const ok = login(email, pass);
            if (!ok) {
                setError('E-mail ou senha inválidos.');
                setShake(true);
                setTimeout(() => setShake(false), 600);
            }
            setLoading(false);
        }, 700);
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4"
            style={{ background: 'linear-gradient(135deg, #060d1a 0%, #0A1628 50%, #0d1e38 100%)' }}>

            {/* Glowing orb behind the form */}
            <div className="absolute w-72 h-72 rounded-full opacity-10 blur-3xl pointer-events-none"
                style={{ background: 'radial-gradient(circle, #C9A96E 0%, transparent 70%)' }} />

            <div className={`w-full max-w-sm z-10 transition-all ${shake ? 'animate-[shake_0.5s_ease-in-out]' : ''}`}>

                {/* Logo / Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 border border-[#C9A96E]/30"
                        style={{ background: 'rgba(201,169,110,0.08)' }}>
                        <ShieldCheck size={32} className="text-[#C9A96E]" />
                    </div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Weid Admin</h1>
                    <p className="text-gray-500 text-sm mt-1">Acesso restrito à equipe</p>
                </div>

                {/* Card */}
                <form onSubmit={handleSubmit}
                    className="p-8 rounded-3xl flex flex-col gap-5"
                    style={{
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        backdropFilter: 'blur(20px)',
                        boxShadow: '0 32px 64px rgba(0,0,0,0.4)',
                    }}>

                    {/* Email */}
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">E-mail</label>
                        <div className="relative">
                            <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                            <input
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                                autoComplete="email"
                                placeholder="peterson@weid.com.br"
                                className="w-full pl-10 pr-4 py-3 rounded-xl text-white placeholder-gray-600 text-sm focus:outline-none focus:ring-1 focus:ring-[#C9A96E]/50 transition-all"
                                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Senha</label>
                        <div className="relative">
                            <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                            <input
                                type={showPass ? 'text' : 'password'}
                                value={pass}
                                onChange={e => setPass(e.target.value)}
                                required
                                autoComplete="current-password"
                                placeholder="••••••••"
                                className="w-full pl-10 pr-12 py-3 rounded-xl text-white placeholder-gray-600 text-sm focus:outline-none focus:ring-1 focus:ring-[#C9A96E]/50 transition-all"
                                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
                            />
                            <button type="button" tabIndex={-1}
                                onClick={() => setShowPass(s => !s)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors">
                                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>

                    {/* Error */}
                    {error && (
                        <p className="text-sm text-red-400 text-center bg-red-400/10 border border-red-400/20 rounded-xl py-2 px-3">
                            🔒 {error}
                        </p>
                    )}

                    {/* Submit */}
                    <button type="submit" disabled={loading}
                        className="w-full py-3.5 rounded-xl font-bold text-sm tracking-wide transition-all active:scale-95 disabled:opacity-60 flex items-center justify-center gap-2"
                        style={{ background: 'linear-gradient(135deg, #C9A96E, #e8c98a)', color: '#0A1628' }}>
                        {loading ? (
                            <span className="inline-block w-4 h-4 border-2 border-[#0A1628]/40 border-t-[#0A1628] rounded-full animate-spin" />
                        ) : (
                            'Entrar'
                        )}
                    </button>
                </form>

                <p className="text-center text-gray-600 text-xs mt-6">
                    Área protegida · Weid Imóveis
                </p>
            </div>

            {/* Shake keyframe */}
            <style>{`
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    20% { transform: translateX(-8px); }
                    40% { transform: translateX(8px); }
                    60% { transform: translateX(-5px); }
                    80% { transform: translateX(5px); }
                }
            `}</style>
        </div>
    );
}
