import { useState, useEffect } from 'react';
import { Play, RotateCcw, Sparkles, Filter } from 'lucide-react';
import { useHabitCompletion } from './useHabitCompletion';
import CompletionModal from './CompletionModal';

const CATEGORIES = [
    { id: 'all', label: '🎲 Todas', color: 'bg-indigo-500/15 text-white' },
    { id: 'essential', label: '✨ Esenciales', color: 'bg-slate-800/60 text-white' },
    { id: 'energy', label: '💪 Energía', color: 'bg-slate-800/60 text-white' },
    { id: 'health', label: '🥦 Saludable', color: 'bg-slate-800/60 text-white' },
    { id: 'calm', label: '🧘 Calma', color: 'bg-slate-800/60 text-white' },
    { id: 'ordered', label: '🚀 Orden', color: 'bg-slate-800/60 text-white' },
];

const MOCK_HABITS = [
    // Calma (calm)
    { category: 'calm', emoji: '🧘', text: 'Haz 3 respiraciones profundas', duration: '1 min', seconds: 60 },
    { category: 'calm', emoji: '👁️', text: 'Cierra los ojos y cuenta 10 respiraciones', duration: '1 min', seconds: 60 },
    { category: 'calm', emoji: '🎵', text: 'Escucha una canción relajante', duration: '3 min', seconds: 180 },
    { category: 'calm', emoji: '🌿', text: 'Observa una planta o dibujo por 1 minuto', duration: '1 min', seconds: 60 },
    { category: 'calm', emoji: '🗣️', text: 'Repite un mantra positivo', duration: '1 min', seconds: 60 },
    { category: 'calm', emoji: '💆', text: 'Masajea tus sienes suavemente', duration: '1 min', seconds: 60 },

    // Energía (energy)
    { category: 'energy', emoji: '🚶', text: 'Estira las piernas y camina un poco', duration: '3 min', seconds: 180 },
    { category: 'energy', emoji: '⚡', text: 'Haz 10 saltos de tijera', duration: '1 min', seconds: 60 },
    { category: 'energy', emoji: '🏋️', text: 'Haz 15 sentadillas rápidas', duration: '2 min', seconds: 120 },
    { category: 'energy', emoji: '💃', text: 'Pon música animada y baila', duration: '2 min', seconds: 120 },
    { category: 'energy', emoji: '🙆', text: 'Estira los brazos hacia el techo', duration: '1 min', seconds: 60 },
    { category: 'energy', emoji: '💪', text: 'Haz 10 flexiones de pecho', duration: '2 min', seconds: 120 },

    // Esenciales (essential)
    { category: 'essential', emoji: '💧', text: 'Bebe un vaso de agua lentamente', duration: '1 min', seconds: 60 },
    { category: 'essential', emoji: '🛌', text: 'Haz tu cama si aún no lo has hecho', duration: '2 min', seconds: 120 },
    { category: 'essential', emoji: '🦷', text: 'Limpia tu zona de trabajo 2 minutos', duration: '2 min', seconds: 120 },
    { category: 'essential', emoji: '📓', text: 'Anota tu intención para hoy', duration: '1 min', seconds: 60 },
    { category: 'essential', emoji: '🧴', text: 'Aplícate crema en las manos', duration: '1 min', seconds: 60 },
    { category: 'essential', emoji: '🏆', text: 'Recuerda un logro de ayer', duration: '1 min', seconds: 60 },

    // Saludable (health)
    { category: 'health', emoji: '🍏', text: 'Come una pieza de fruta', duration: '3 min', seconds: 180 },
    { category: 'health', emoji: '🍵', text: 'Prepara un té sin azúcar', duration: '5 min', seconds: 300 },
    { category: 'health', emoji: '🥗', text: 'Planifica tu menú saludable de mañana', duration: '3 min', seconds: 180 },
    { category: 'health', emoji: '🥜', text: 'Come un puñado de frutos secos', duration: '2 min', seconds: 120 },
    { category: 'health', emoji: '🥤', text: 'Bebe 250ml de agua fresca', duration: '1 min', seconds: 60 },
    { category: 'health', emoji: '🧼', text: 'Lava tus manos con calma y atención', duration: '1 min', seconds: 60 },

    // Orden / Productividad (ordered)
    { category: 'ordered', emoji: '🧹', text: 'Limpia 3 iconos de tu escritorio', duration: '2 min', seconds: 120 },
    { category: 'ordered', emoji: '📧', text: 'Archiva 5 correos antiguos', duration: '2 min', seconds: 120 },
    { category: 'ordered', emoji: '📅', text: 'Revisa tu calendario de mañana', duration: '2 min', seconds: 120 },
    { category: 'ordered', emoji: '📝', text: 'Escribe tu lista de 3 tareas clave', duration: '2 min', seconds: 120 },
    { category: 'ordered', emoji: '❌', text: 'Cierra pestañas del navegador que no uses', duration: '1 min', seconds: 60 },
    { category: 'ordered', emoji: '⌛', text: 'Enfoque total Pomodoro: 5 min', duration: '5 min', seconds: 300 },
];

export default function HabitGenerator({ initialCategory = 'all' }) {
    const [selectedCategory, setSelectedCategory] = useState(initialCategory);
    const [currentHabit, setCurrentHabit] = useState(null);
    const [isTimerActive, setIsTimerActive] = useState(false);
    const [timeLeft, setTimeLeft] = useState(180);
    const [showCompletion, setShowCompletion] = useState(false);
    const [completionData, setCompletionData] = useState({ xp: 0, streak: 0 });

    const [selectedColor, setSelectedColor] = useState('indigo');
    const [timeOfDay, setTimeOfDay] = useState('any');
    const [isCustomMode, setIsCustomMode] = useState(false);
    const [customText, setCustomText] = useState('');
    const [customEmoji, setCustomEmoji] = useState('✍️');

    const { completeHabit, isCompleting } = useHabitCompletion();

    // Auto-generate habit if initialCategory is provided
    useEffect(() => {
        if (initialCategory !== 'all') {
            generateHabit();
        }
    }, [initialCategory]);

    // Timer logic
    useEffect(() => {
        let interval = null;
        if (isTimerActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0 && isTimerActive) {
            handleComplete();
        }
        return () => clearInterval(interval);
    }, [isTimerActive, timeLeft]);

    const generateHabit = (forceCategory = null) => {
        const categoryToUse = forceCategory || selectedCategory;
        const filtered = categoryToUse === 'all'
            ? MOCK_HABITS
            : MOCK_HABITS.filter(h => h.category === categoryToUse);

        const random = filtered[Math.floor(Math.random() * filtered.length)];
        setCurrentHabit(random);
        setIsTimerActive(false);
        setTimeLeft(random?.seconds || 180);
    };

    const handleCategorySelect = (id) => {
        setSelectedCategory(id);
        generateHabit(id);
    };

    const toggleTimer = () => {
        setIsTimerActive(!isTimerActive);
    };

    const handleComplete = async () => {
        setIsTimerActive(false);
        const result = await completeHabit(currentHabit);
        if (result.success) {
            setCompletionData({ xp: result.newXp, streak: result.newStreak });
            setShowCompletion(true);
        } else {
            console.error('Error al guardar el hábito:', result.error);
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="space-y-6 animate-slide-up">
            {/* Mode Toggle */}
            <div className="flex gap-2 p-1 bg-slate-800/40 rounded-2xl border border-white/5">
                <button
                    onClick={() => setIsCustomMode(false)}
                    className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${!isCustomMode ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                >
                    <Sparkles size={14} /> Ideas IA
                </button>
                <button
                    onClick={() => setIsCustomMode(true)}
                    className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${isCustomMode ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                >
                    <Play size={14} /> Personalizado
                </button>
            </div>

            {/* AI Button - Only show in AI mode */}
            {!isCustomMode && (
                <button
                    onClick={() => generateHabit()}
                    className="w-full py-4 px-8 rounded-2xl font-bold text-lg transition-all hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] active:scale-95 relative overflow-hidden group shadow-xl"
                    style={{
                        background: 'linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)',
                        color: 'white'
                    }}
                >
                    <div className="relative z-10 flex items-center justify-center gap-2">
                        <Sparkles size={20} className="group-hover:rotate-12 transition-transform" />
                        {currentHabit ? 'Generar otra idea 🪄' : 'Hábito Mágico con IA'}
                    </div>
                    <div className="absolute top-2 right-2 bg-black/20 px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-tighter">AI PRO</div>
                </button>
            )}

            {/* Categories - Only show in AI mode */}
            {!isCustomMode && (
                <div className="grid grid-cols-2 gap-2">
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => handleCategorySelect(cat.id)}
                            className={`py-3.5 px-3 rounded-2xl font-bold text-[10px] uppercase tracking-widest text-center transition-all border-2 ${selectedCategory === cat.id
                                ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-lg shadow-indigo-500/10'
                                : 'bg-slate-800/40 border-slate-700/50 text-slate-400 hover:border-slate-500 hover:text-slate-200'
                                }`}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>
            )}

            {/* Habit Card Display */}
            <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-[2rem] blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>

                {currentHabit || isCustomMode ? (
                    <div className="relative glass-panel rounded-[2rem] p-8 min-h-[220px] flex flex-col items-center justify-center border border-white/10 animate-pop">
                        {isCustomMode && !isTimerActive ? (
                            <div className="w-full space-y-6 flex flex-col items-center">
                                <div className="flex gap-4 w-full">
                                    <input
                                        type="text"
                                        value={customEmoji}
                                        onChange={(e) => setCustomEmoji(e.target.value)}
                                        className="w-16 h-16 text-3xl flex items-center justify-center bg-white/5 rounded-2xl border border-white/10 text-center focus:border-indigo-500 outline-none"
                                        placeholder="✍️"
                                    />
                                    <input
                                        type="text"
                                        value={customText}
                                        onChange={(e) => setCustomText(e.target.value)}
                                        className="flex-1 bg-white/5 rounded-2xl border border-white/10 px-4 py-2 text-white font-bold placeholder:text-slate-600 focus:border-indigo-500 outline-none"
                                        placeholder="¿Qué vas a lograr hoy?"
                                    />
                                </div>
                                <div className="flex gap-2 p-1 bg-white/5 rounded-2xl border border-white/5">
                                    {[1, 3, 5, 10, 20].map((m) => (
                                        <button
                                            key={m}
                                            onClick={() => setTimeLeft(m * 60)}
                                            className={`px-3 py-2 rounded-xl text-[10px] font-black transition-all ${(timeLeft / 60) === m
                                                ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                                                : 'text-slate-500 hover:text-slate-300'
                                                }`}
                                        >
                                            {m} MIN
                                        </button>
                                    ))}
                                </div>
                                <button
                                    onClick={() => {
                                        if (!customText) return alert('¡Escribe tu meta primero!');
                                        setCurrentHabit({
                                            text: customText,
                                            emoji: customEmoji || '✍️',
                                            category: 'custom',
                                            duration: `${timeLeft / 60} min`,
                                            seconds: timeLeft
                                        });
                                        toggleTimer();
                                    }}
                                    className="btn-primary w-full max-w-[200px] py-3.5 rounded-2xl font-bold text-base flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20 active:scale-95 transition-all"
                                >
                                    <Play size={20} fill="currentColor" /> Iniciar ({formatTime(timeLeft)})
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="text-6xl mb-5 animate-float">{currentHabit?.emoji || customEmoji}</div>
                                <p className="text-xl font-bold leading-tight text-center mb-6 text-white max-w-[250px]">
                                    {currentHabit?.text || customText}
                                </p>

                                {!isTimerActive ? (
                                    <div className="flex flex-col items-center gap-6 w-full">
                                        {/* Time Selector */}
                                        <div className="flex gap-2 p-1 bg-white/5 rounded-2xl border border-white/5">
                                            {[1, 3, 5].map((m) => (
                                                <button
                                                    key={m}
                                                    onClick={() => {
                                                        setTimeLeft(m * 60);
                                                        setCurrentHabit(prev => ({ ...prev, duration: `${m} min`, seconds: m * 60 }));
                                                    }}
                                                    className={`px-4 py-2 rounded-xl text-[10px] font-black transition-all ${(timeLeft / 60) === m
                                                        ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                                                        : 'text-slate-500 hover:text-slate-300'
                                                        }`}
                                                >
                                                    {m} MIN
                                                </button>
                                            ))}
                                        </div>

                                        {/* Advanced Personalization (from User Image) */}
                                        <div className="w-full space-y-4 pt-4 border-t border-white/5 mt-2 text-center">
                                            <div className="flex flex-col items-center gap-2">
                                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Color del tema</span>
                                                <div className="flex gap-3">
                                                    {['indigo', 'emerald', 'rose', 'orange', 'blue'].map(c => (
                                                        <button
                                                            key={c}
                                                            onClick={() => setSelectedColor(c)}
                                                            className={`w-5 h-5 rounded-full transition-transform ${selectedColor === c ? 'scale-125 ring-2 ring-white/50' : 'opacity-40 hover:opacity-100'}`}
                                                            style={{ backgroundColor: c === 'indigo' ? '#6366f1' : c === 'emerald' ? '#10b981' : c === 'rose' ? '#f43f5e' : c === 'orange' ? '#f59e0b' : '#3b82f6' }}
                                                        ></button>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Momento del día</span>
                                                <div className="grid grid-cols-2 gap-2 max-w-[280px] mx-auto">
                                                    <button
                                                        onClick={() => setTimeOfDay('morning')}
                                                        className={`py-2 rounded-xl text-[10px] font-black transition-all border ${timeOfDay === 'morning' ? 'bg-white/10 border-white/20 text-white' : 'border-transparent text-slate-500 hover:text-slate-300 uppercase'}`}
                                                    >🌅 Mañana</button>
                                                    <button
                                                        onClick={() => setTimeOfDay('afternoon')}
                                                        className={`py-2 rounded-xl text-[10px] font-black transition-all border ${timeOfDay === 'afternoon' ? 'bg-white/10 border-white/20 text-white' : 'border-transparent text-slate-500 hover:text-slate-300 uppercase'}`}
                                                    >☀️ Tarde</button>
                                                    <button
                                                        onClick={() => setTimeOfDay('night')}
                                                        className={`py-2 rounded-xl text-[10px] font-black transition-all border ${timeOfDay === 'night' ? 'bg-white/10 border-white/20 text-white' : 'border-transparent text-slate-500 hover:text-slate-300 uppercase'}`}
                                                    >🌙 Noche</button>
                                                    <button
                                                        onClick={() => setTimeOfDay('any')}
                                                        className={`py-2 rounded-xl text-[10px] font-black transition-all border ${timeOfDay === 'any' ? 'bg-white/10 border-white/20 text-white' : 'border-transparent text-slate-500 hover:text-slate-300 uppercase'}`}
                                                    >✨ Libre</button>
                                                </div>
                                            </div>
                                        </div>

                                        <button
                                            onClick={toggleTimer}
                                            className="btn-primary w-full max-w-[200px] py-3.5 rounded-2xl font-bold text-base flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20 active:scale-95 transition-all"
                                        >
                                            <Play size={20} fill="currentColor" /> Iniciar ({formatTime(timeLeft)})
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center gap-5 w-full">
                                        <div className="text-5xl font-black text-indigo-400 font-mono tracking-[0.2em] bg-indigo-500/10 px-6 py-2 rounded-2xl border border-indigo-500/20">
                                            {formatTime(timeLeft)}
                                        </div>
                                        <div className="flex gap-4">
                                            <button onClick={toggleTimer} className="px-6 py-3 rounded-xl font-bold text-sm bg-slate-800/80 text-slate-300 border border-slate-700 hover:bg-slate-700 transition-colors">
                                                Pausa
                                            </button>
                                            <button onClick={() => setTimeLeft(currentHabit?.seconds || 180)} className="px-6 py-3 rounded-xl font-bold text-sm bg-slate-800/80 text-slate-300 border border-slate-700 hover:bg-slate-700 flex items-center gap-2 transition-colors">
                                                <RotateCcw size={16} /> Reiniciar
                                            </button>
                                        </div>
                                        <button
                                            onClick={handleComplete}
                                            disabled={isCompleting}
                                            className="text-indigo-400 text-xs font-bold uppercase tracking-widest hover:text-indigo-300 transition-colors"
                                        >
                                            {isCompleting ? 'Sincronizando...' : 'Terminar ahora ⚡'}
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                ) : (
                    <div className="relative glass-panel rounded-[2rem] p-10 min-h-[220px] flex flex-col items-center justify-center border-2 border-dashed border-slate-700 bg-slate-800/10 grayscale opacity-70">
                        <div className="text-5xl mb-4 bg-slate-800 p-4 rounded-3xl">🎯</div>
                        <p className="font-bold text-slate-500 uppercase tracking-tighter text-sm">Elige una categoría para empezar</p>
                    </div>
                )}
            </div>

            {/* Completion Modal */}
            <CompletionModal
                isOpen={showCompletion}
                onClose={() => setShowCompletion(false)}
                xpEarned={10}
                newStreak={completionData.streak}
            />
        </div>
    );
}
