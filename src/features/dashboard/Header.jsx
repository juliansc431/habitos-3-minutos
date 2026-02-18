import { Settings, LogOut } from 'lucide-react';

export default function Header({ user, onLogout, onSettings }) {
    return (
        <div className="w-full max-w-md animate-slide-up">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <button
                        onClick={onSettings}
                        className="text-4xl hover:scale-110 transition-transform cursor-pointer bg-slate-800/50 p-2 rounded-2xl border border-slate-700/50"
                    >
                        {user.avatar || '🦸'}
                    </button>
                    <div>
                        <h1 className="font-bold text-lg text-slate-50">{user.username || 'Usuario'}</h1>
                        <div className="flex items-center gap-2">
                            <span className="text-indigo-400 text-sm font-semibold">Nivel</span>
                            <div className="bg-gradient-to-br from-indigo-500 to-purple-500 px-2 py-0.5 rounded text-xs font-bold text-white">
                                {user.level || 1}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="text-right">
                    <div className="text-2xl mb-1 font-bold text-slate-50">
                        🔥 {user.streak || 0}
                    </div>
                    <p className="text-slate-400 text-xs">Racha activa</p>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="mb-6 flex gap-2">
                <button
                    onClick={onLogout}
                    className="flex-1 py-2 px-4 rounded-lg font-medium transition-colors bg-rose-500/10 text-rose-500 border border-rose-500/30 hover:bg-rose-500/20 flex items-center justify-center gap-2"
                >
                    <LogOut size={16} /> Salir
                </button>
                <button
                    onClick={onSettings}
                    className="flex-1 py-2 px-4 rounded-lg font-medium transition-colors bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 hover:bg-indigo-500/20 flex items-center justify-center gap-2"
                >
                    <Settings size={16} /> Perfil
                </button>
            </div>
        </div>
    );
}
