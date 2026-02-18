import { useState } from 'react';
import { Eye, EyeOff, LogIn, UserPlus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AuthScreen() {
    const { login, register } = useAuth();
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({ email: '', password: '', confirmPassword: '' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
        if (error) setError('');
        if (success) setSuccess('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!formData.email || !formData.password) {
            setError('Por favor completa todos los campos');
            return;
        }

        if (!isLogin && formData.password !== formData.confirmPassword) {
            setError('Las contraseñas no coinciden');
            return;
        }

        setLoading(true);
        console.log('App: Auth Attempt', isLogin ? 'Login' : 'Register');

        try {
            if (isLogin) {
                const { data, error: loginErr } = await login(formData.email, formData.password);
                if (loginErr) throw loginErr;
            } else {
                const { data, error: regErr } = await register(formData.email, formData.password);
                if (regErr) throw regErr;

                if (data?.user && !data?.session) {
                    setSuccess('¡Casi listo! Revisa tu correo electrónico para confirmar tu cuenta y poder entrar.');
                    // Don't clear form entirely, but maybe reset passwords
                    setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }));
                }
            }
        } catch (err) {
            console.error('Auth breakdown:', err);
            const msg = err.message || err.error_description || 'Error inesperado';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    if (success && !isLogin) {
        return (
            <div className="w-full max-w-md pt-8 animate-pop">
                <div className="glass-panel rounded-[2rem] p-10 text-center shadow-2xl border border-white/5">
                    <div className="text-6xl mb-6">📧</div>
                    <h2 className="text-2xl font-bold mb-4 text-white">¡Revisa tu correo!</h2>
                    <p className="text-slate-400 mb-8 leading-relaxed">
                        Hemos enviado un enlace de confirmación a <span className="text-indigo-400 font-bold">{formData.email}</span>.
                        Por favor, confírmalo para poder empezar a crear tus hábitos.
                    </p>
                    <button
                        onClick={() => { setSuccess(''); setIsLogin(true); }}
                        className="btn-primary w-full py-4 rounded-2xl font-bold text-white shadow-xl shadow-indigo-600/20 active:scale-95 transition-all"
                    >
                        Volver al Inicio de Sesión
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div key="auth-container" className="w-full max-w-md pt-8">
            <div className="text-center mb-10">
                <p className="text-[10px] text-indigo-400 font-black uppercase tracking-[0.3em] mb-4 opacity-70">
                    Versión Estable v1.0.4 🛡️
                </p>
                <div className="text-6xl mb-4">⚡</div>
                <h1 className="text-4xl font-bold mb-2 text-white">Micro-Hábitos</h1>
                <p className="text-slate-400">Transforma tu vida en 3 minutos</p>
            </div>

            <div className="glass-panel rounded-[2rem] p-8 shadow-2xl border border-white/5">
                <h2 className="text-2xl font-bold mb-6 text-white">
                    {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase px-1">Correo Electrónico</label>
                        <input
                            name="email"
                            type="email"
                            required
                            placeholder="ejemplo@correo.com"
                            className="glass-input w-full px-4 py-3.5 rounded-xl text-sm"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase px-1">Contraseña</label>
                        <div className="relative">
                            <input
                                name="password"
                                type={showPassword ? "text" : "password"}
                                required
                                placeholder="••••••••"
                                className="glass-input w-full px-4 py-3.5 rounded-xl text-sm"
                                value={formData.password}
                                onChange={handleChange}
                            />
                            <button
                                type="button"
                                className="absolute right-4 top-3.5 text-slate-500 hover:text-white transition-colors"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    {!isLogin && (
                        <div className="space-y-1.5 border-t border-white/5 pt-4">
                            <label className="text-xs font-bold text-slate-500 uppercase px-1">Confirmar Contraseña</label>
                            <input
                                name="confirmPassword"
                                type="password"
                                required
                                placeholder="••••••••"
                                className="glass-input w-full px-4 py-3.5 rounded-xl text-sm"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                            />
                        </div>
                    )}

                    {error && (
                        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-xl text-sm flex gap-2">
                            <span className="shrink-0">⚠️</span>
                            <span>{error}</span>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary w-full py-4 rounded-2xl font-bold text-white shadow-xl shadow-indigo-600/20 active:scale-95 transition-all disabled:opacity-50"
                    >
                        {loading ? 'Cargando...' : isLogin ? '🚀 Entrar' : '✨ Crear Cuenta'}
                    </button>
                </form>

                <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
                    <div className="relative flex justify-center text-xs uppercase"><span className="bg-[#1a1a3e] px-4 text-slate-500 font-bold">O</span></div>
                </div>

                <button
                    onClick={() => { setIsLogin(!isLogin); setError(''); setSuccess(''); }}
                    className="w-full py-4 rounded-2xl font-bold text-indigo-400 bg-indigo-500/5 border border-indigo-500/20 hover:bg-indigo-500/10 transition-all flex items-center justify-center gap-2 active:scale-95"
                >
                    {isLogin ? <><UserPlus size={20} /> Crear cuenta nueva</> : <><LogIn size={20} /> Volver al Inicio</>}
                </button>
            </div>

            <p className="mt-8 text-center text-[10px] text-slate-700 font-medium uppercase tracking-widest opacity-50">
                v1.0.4 • Protocolo de Seguridad Activo
            </p>
        </div>
    );
}
