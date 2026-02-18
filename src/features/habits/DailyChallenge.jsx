import { useState, useEffect } from 'react';
import { Flame, Star, Zap, Clock } from 'lucide-react';
import { useHabitCompletion } from './useHabitCompletion';
import CompletionModal from './CompletionModal';

const DAILY_CHALLENGES = [
    { id: 'ch_1', emoji: '📵', text: '30 minutos sin mirar el celular antes de dormir', category: 'focus', xp: 50 },
    { id: 'ch_2', emoji: '🍎', text: 'Come una fruta o verdura en tu próxima comida', category: 'selfcare', xp: 40 },
    { id: 'ch_3', emoji: '✍️', text: 'Escribe 3 metas pequeñas para mañana', category: 'productivity', xp: 45 },
    { id: 'ch_4', emoji: '🚶', text: 'Da una caminata de 15 minutos en la naturaleza', category: 'energy', xp: 60 },
];

export default function DailyChallenge() {
    const [challenge, setChallenge] = useState(null);
    const [timeLeft, setTimeLeft] = useState('');
    const [showCompletion, setShowCompletion] = useState(false);
    const [completionData, setCompletionData] = useState({ xp: 0, streak: 0 });
    const { completeHabit, isCompleting } = useHabitCompletion();

    useEffect(() => {
        // Determine challenge based on day of the year
        const now = new Date();
        const start = new Date(now.getFullYear(), 0, 0);
        const diff = now - start;
        const oneDay = 1000 * 60 * 60 * 24;
        const dayIndex = Math.floor(diff / oneDay) % DAILY_CHALLENGES.length;
        setChallenge(DAILY_CHALLENGES[dayIndex]);

        // Timer until next day
        const updateCountdown = () => {
            const tomorrow = new Date();
            tomorrow.setHours(24, 0, 0, 0);
            const remaining = tomorrow - new Date();
            const h = Math.floor(remaining / (1000 * 60 * 60));
            const m = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
            setTimeLeft(`${h}h ${m}m`);
        };

        updateCountdown();
        const interval = setInterval(updateCountdown, 60000);
        return () => clearInterval(interval);
    }, []);

    const handleComplete = async () => {
        const result = await completeHabit({
            ...challenge,
            duration: 'Reto Diario'
        });
        if (result.success) {
            setCompletionData({ xp: result.newXp, streak: result.newStreak });
            setShowCompletion(true);
        }
    };

    if (!challenge) return null;

    return (
        <div className="space-y-6 animate-slide-up">
            <div className="relative overflow-hidden bg-gradient-to-r from-orange-500 to-rose-600 rounded-3xl p-8 shadow-xl">
                <div className="relative z-10">
                    <div className="flex justify-between items-start mb-6">
                        <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white flex items-center gap-1">
                            <Flame size={14} fill="currentColor" /> RETO DEL DÍA
                        </div>
                        <div className="text-white/80 text-xs font-medium flex items-center gap-1">
                            <Clock size={14} /> Siguiente en {timeLeft}
                        </div>
                    </div>

                    <div className="text-6xl mb-4 drop-shadow-lg">{challenge.emoji}</div>
                    <h2 className="text-2xl font-bold text-white mb-2 leading-tight">
                        {challenge.text}
                    </h2>
                    <p className="text-white/80 text-sm mb-6">
                        Completa este reto para ganar puntos extra y subir de nivel más rápido.
                    </p>

                    <div className="flex items-center justify-between gap-4">
                        <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl flex items-center gap-2 text-white font-bold">
                            <Zap className="text-yellow-300 fill-yellow-300" size={20} />
                            +{challenge.xp} Puntos
                        </div>
                        <button
                            onClick={handleComplete}
                            disabled={isCompleting}
                            className="flex-1 bg-white text-rose-600 hover:bg-rose-50 font-bold py-3 rounded-xl shadow-lg transition-all active:scale-95 disabled:opacity-50"
                        >
                            {isCompleting ? 'Procesando...' : '¡Anotar Reto! ✨'}
                        </button>
                    </div>
                </div>

                {/* Decorative background elements */}
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute -top-10 -left-10 w-32 h-32 bg-orange-400/20 rounded-full blur-2xl"></div>
            </div>

            <div className="glass-panel rounded-2xl p-6 border-indigo-500/20">
                <div className="flex items-center gap-3 text-slate-100 font-semibold mb-2">
                    <Star className="text-yellow-400" size={20} />
                    ¿Por qué participar?
                </div>
                <p className="text-slate-400 text-sm leading-relaxed">
                    Los retos diarios cambian cada 24 horas y son iguales para toda la comunidad. ¡Lograrlos te ayuda a mantener la disciplina constante!
                </p>
            </div>

            <CompletionModal
                isOpen={showCompletion}
                onClose={() => setShowCompletion(false)}
                xpEarned={challenge.xp}
                newStreak={completionData.streak}
            />
        </div>
    );
}
