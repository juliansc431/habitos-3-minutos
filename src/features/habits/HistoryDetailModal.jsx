import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Clock, Star, Tag, Timer } from 'lucide-react';

const CATEGORY_STYLES = {
    calm: { color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', label: 'Calma' },
    energy: { color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20', label: 'Energía' },
    focus: { color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20', label: 'Enfoque' },
    selfcare: { color: 'text-pink-400', bg: 'bg-pink-500/10', border: 'border-pink-500/20', label: 'Amor propio' },
    productivity: { color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', label: 'Productividad' },
};

export default function HistoryDetailModal({ isOpen, onClose, habit }) {
    if (!habit) return null;

    const style = CATEGORY_STYLES[habit.category] || {
        color: 'text-slate-400',
        bg: 'bg-slate-500/10',
        border: 'border-slate-500/20',
        label: 'Varios'
    };

    const dateStr = new Date(habit.completed_at || habit.created_at).toLocaleDateString('es-ES', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });

    const timeStr = new Date(habit.completed_at || habit.created_at).toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit'
    });

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-[2000] p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-md"
                    />

                    <motion.div
                        initial={{ scale: 0.8, opacity: 0, y: 40 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.8, opacity: 0, y: 40 }}
                        className="relative bg-[#1a1a3a] border border-white/10 rounded-[2.5rem] p-8 max-w-sm w-full shadow-2xl overflow-hidden"
                    >
                        {/* Decorative background glow */}
                        <div className={`absolute top-0 left-0 w-full h-32 opacity-20 bg-gradient-to-b from-indigo-500 to-transparent`} />

                        <button
                            onClick={onClose}
                            className="absolute top-6 right-6 p-2 rounded-full bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all z-10"
                        >
                            <X size={20} />
                        </button>

                        <div className="relative z-10 flex flex-col items-center text-center">
                            <div className="text-7xl mb-6 filter drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] animate-float">
                                {habit.emoji || '🎯'}
                            </div>

                            <h3 className="text-2xl font-black text-white mb-2 leading-tight">
                                {habit.habit_name || 'Hábito Completado'}
                            </h3>

                            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${style.bg} ${style.color} ${style.border} mb-8`}>
                                <Tag size={12} /> {style.label}
                            </div>

                            <div className="grid grid-cols-2 gap-3 w-full mb-8">
                                <div className="bg-white/5 rounded-2xl p-4 border border-white/5 text-left">
                                    <div className="text-indigo-400 mb-1"><Calendar size={18} /></div>
                                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">Fecha</div>
                                    <div className="text-xs text-white font-bold">{dateStr}</div>
                                </div>
                                <div className="bg-white/5 rounded-2xl p-4 border border-white/5 text-left">
                                    <div className="text-indigo-400 mb-1"><Clock size={18} /></div>
                                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">Hora</div>
                                    <div className="text-xs text-white font-bold">{timeStr}</div>
                                </div>
                                <div className="bg-white/5 rounded-2xl p-4 border border-white/5 text-left">
                                    <div className="text-emerald-400 mb-1"><Timer size={18} /></div>
                                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">Duración</div>
                                    <div className="text-xs text-white font-bold">{habit.duration || '1 min'}</div>
                                </div>
                                <div className="bg-white/5 rounded-2xl p-4 border border-white/5 text-left">
                                    <div className="text-yellow-400 mb-1"><Star size={18} fill="currentColor" /></div>
                                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">Recompensa</div>
                                    <div className="text-xs text-white font-bold">+{habit.xp_earned || 10} XP</div>
                                </div>
                            </div>

                            <button
                                onClick={onClose}
                                className="w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-[1.25rem] font-bold text-lg shadow-xl shadow-indigo-500/20 transition-all hover:scale-[1.02] active:scale-95"
                            >
                                ¡Seguir así! 🚀
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
