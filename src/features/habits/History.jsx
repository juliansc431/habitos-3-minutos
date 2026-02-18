import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, CheckCircle2, Calendar, Search } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import HistoryDetailModal from './HistoryDetailModal';

export default function History() {
    const { user } = useAuth();
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedHabit, setSelectedHabit] = useState(null);

    useEffect(() => {
        async function fetchHistory() {
            if (!user) return;
            try {
                const { data, error } = await supabase
                    .from('habit_completions')
                    .select('*')
                    .eq('user_id', user.id)
                    .order('completed_at', { ascending: false })
                    .limit(20);

                if (error) throw error;
                setHistory(data);
            } catch (err) {
                console.error('Error fetching history:', err);
            } finally {
                setLoading(false);
            }
        }
        fetchHistory();
    }, [user]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center p-20 animate-pulse">
                <Clock className="text-indigo-500 mb-4 animate-spin" size={40} />
                <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">Cargando Historial...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-slide-up">
            <div className="glass-panel rounded-[2.5rem] p-8 border border-white/10">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-2xl font-black text-white">Actividad Reciente</h2>
                        <p className="text-slate-400 text-xs uppercase tracking-widest font-bold">Tus últimos 20 hábitos</p>
                    </div>
                    <div className="bg-indigo-500/10 p-3 rounded-2xl border border-indigo-500/20">
                        <Clock className="text-indigo-400" size={24} />
                    </div>
                </div>

                {history.length === 0 ? (
                    <div className="text-center py-12 opacity-50">
                        <Calendar size={48} className="mx-auto mb-4 text-slate-600" />
                        <p className="text-slate-500 font-bold">Aún no hay registros de actividad.</p>
                        <p className="text-xs text-slate-600 px-10 mt-2">Completa tu primer hábito para empezar a llenar tu historial.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {history.map((item, idx) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                onClick={() => setSelectedHabit(item)}
                                className="group relative flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-indigo-500/30 transition-all hover:bg-white/10 cursor-pointer active:scale-[0.98]"
                            >
                                <div className="flex-none w-12 h-12 flex items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 group-hover:bg-indigo-500/20 transition-all text-2xl">
                                    {item.emoji || '🎯'}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-white font-bold truncate">{item.habit_name}</h4>
                                    <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold uppercase tracking-tighter">
                                        <span className="px-1.5 py-0.5 bg-white/5 rounded-md border border-white/5">{item.category}</span>
                                        <span>•</span>
                                        <span>{new Date(item.completed_at || item.created_at).toLocaleString('es-ES', {
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}</span>
                                    </div>
                                </div>
                                <div className="flex-none px-3 py-1 bg-emerald-500/10 text-emerald-400 text-[10px] font-black rounded-full border border-emerald-500/20">
                                    +10 XP
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            <HistoryDetailModal
                isOpen={!!selectedHabit}
                onClose={() => setSelectedHabit(null)}
                habit={selectedHabit}
            />
        </div>
    );
}
