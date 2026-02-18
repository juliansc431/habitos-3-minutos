import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Flower2, Gem, Sun } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';

const CATEGORY_EVOLUTION = {
    essential: { name: 'Esenciales', icon: '✨', color: 'text-rose-400', glow: 'shadow-rose-500/20' },
    energy: { name: 'Energía', icon: '💪', color: 'text-blue-400', glow: 'shadow-blue-500/20' },
    health: { name: 'Salud', icon: '🥦', color: 'text-emerald-400', glow: 'shadow-emerald-500/20' },
    calm: { name: 'Calma', icon: '🧘', color: 'text-indigo-400', glow: 'shadow-indigo-500/20' },
    ordered: { name: 'Orden', icon: '🚀', color: 'text-orange-400', glow: 'shadow-orange-500/20' },
};

const getStage = (count) => {
    if (count === 0) return { emoji: '🪴', label: 'Maceta Vacía', progress: 0 };
    if (count < 3) return { emoji: '🌱', label: 'Brote', progress: (count / 3) * 100 };
    if (count < 5) return { emoji: '🌿', label: 'Planta Joven', progress: ((count - 3) / 2) * 100 };
    return { emoji: null, label: 'Evolución Final', progress: 100 }; // Final stage uses the category icon
};

export default function CrystalGarden() {
    const { user } = useAuth();
    const [stats, setStats] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchGardenData() {
            if (!user) return;
            try {
                const { data, error } = await supabase
                    .from('habit_completions')
                    .select('category')
                    .eq('user_id', user.id);

                if (error) throw error;

                const counts = data.reduce((acc, curr) => {
                    const cat = curr.category || 'all';
                    acc[cat] = (acc[cat] || 0) + 1;
                    return acc;
                }, {});

                setStats(counts);
            } catch (err) {
                console.error('Error fetching garden stats:', err);
            } finally {
                setLoading(false);
            }
        }
        fetchGardenData();
    }, [user]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center p-20 animate-pulse">
                <Sparkles className="text-indigo-500 mb-4" size={40} />
                <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">Invocando el Jardín...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-slide-up">
            <div className="glass-panel rounded-[2.5rem] p-6 md:p-8 border border-white/10 relative overflow-hidden">
                {/* Background Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-600/10 blur-[100px] pointer-events-none" />

                <div className="text-center relative z-10 mb-8">
                    <h2 className="text-2xl font-black text-white mb-2 flex items-center justify-center gap-2">
                        Mi Jardín de Cristal <Gem className="text-indigo-400" size={24} />
                    </h2>
                    <p className="text-slate-400 text-xs uppercase tracking-widest font-bold">Tus hábitos convertidos en arte digital</p>
                </div>

                {/* Evolution Grid */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 relative z-10">
                    {Object.entries(CATEGORY_EVOLUTION).map(([id, info]) => {
                        const count = stats[id] || 0;
                        const stage = getStage(count);
                        const isFinal = count >= 5;

                        return (
                            <motion.div
                                key={id}
                                whileHover={{ y: -5 }}
                                className="flex flex-col items-center justify-between p-4 bg-white/5 rounded-3xl border border-white/5 hover:border-white/10 transition-all group"
                            >
                                <div className="text-center mb-4">
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-tighter mb-1">{info.name}</p>
                                    <div className="flex items-center justify-center text-[10px] text-indigo-400 font-bold bg-indigo-500/10 px-2 rounded-full">
                                        LVL {count}
                                    </div>
                                </div>

                                <div className="relative mb-4 flex items-center justify-center aspect-square w-full">
                                    {/* Evolution Icon */}
                                    <motion.div
                                        key={`${id}-${count}`}
                                        initial={{ scale: 0.5, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        className={`text-5xl md:text-6xl filter drop-shadow-lg ${isFinal ? info.color : 'text-slate-300'}`}
                                    >
                                        {isFinal ? info.icon : stage.emoji}
                                    </motion.div>

                                    {/* Final Stage Glow */}
                                    {isFinal && (
                                        <motion.div
                                            animate={{ opacity: [0.2, 0.5, 0.2] }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                            className={`absolute inset-0 blur-2xl rounded-full ${info.glow.replace('shadow-', 'bg-')}`}
                                        />
                                    )}
                                </div>

                                <div className="w-full">
                                    <div className="flex justify-between items-center mb-1.5 px-1">
                                        <span className="text-[9px] text-slate-500 font-bold uppercase tracking-tighter">
                                            {stage.label}
                                        </span>
                                        <span className="text-[9px] text-indigo-400 font-black">
                                            {Math.round(stage.progress)}%
                                        </span>
                                    </div>
                                    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden border border-white/5">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${stage.progress}%` }}
                                            className={`h-full bg-gradient-to-r ${isFinal ? 'from-indigo-500 to-purple-500' : 'from-emerald-500 to-teal-500'}`}
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {/* Guide Card */}
            <div className="glass-panel p-6 rounded-[2rem] border border-white/10 flex items-center gap-4 animate-slide-up">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-400 border border-amber-500/20">
                    <Sun size={24} />
                </div>
                <div>
                    <h4 className="text-white font-bold text-sm">Cómo hacer crecer tu jardín</h4>
                    <p className="text-slate-400 text-xs">Completa 5 hábitos de una misma categoría para desbloquear su <b>Cristal Legendario</b>.</p>
                </div>
            </div>
        </div>
    );
}
