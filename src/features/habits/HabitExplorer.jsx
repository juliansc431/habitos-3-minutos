import { ChevronRight, Star, Dumbbell, Coffee, Heart, LayoutGrid } from 'lucide-react';

const EXPLORE_CATEGORIES = [
    {
        id: 'essential',
        title: 'Hábitos esenciales',
        subtitle: 'Cimientos para tu día',
        icon: <Star className="text-white" />,
        color: 'bg-rose-500',
        shadow: 'shadow-rose-500/40'
    },
    {
        id: 'energy',
        title: 'Mantente activo y en forma',
        subtitle: 'El sudor no engaña',
        icon: <Dumbbell className="text-white" />,
        color: 'bg-blue-600',
        shadow: 'shadow-blue-600/40'
    },
    {
        id: 'health',
        title: 'Come y bebe sano',
        subtitle: 'Combustible de calidad',
        icon: <Coffee className="text-white" />,
        color: 'bg-emerald-600',
        shadow: 'shadow-emerald-600/40'
    },
    {
        id: 'calm',
        title: 'Alivia el estrés',
        subtitle: 'Encuentra tu paz interior',
        icon: <Heart className="text-white" />,
        color: 'bg-indigo-600',
        shadow: 'shadow-indigo-600/40'
    },
    {
        id: 'ordered',
        title: 'Vida ordenada',
        subtitle: 'Claridad mental y orden',
        icon: <LayoutGrid className="text-white" />,
        color: 'bg-orange-500',
        shadow: 'shadow-orange-500/40'
    }
];

export default function HabitExplorer({ onSelectCategory }) {
    return (
        <div className="w-full space-y-6 px-4 py-6">
            <div className="space-y-1 mb-8">
                <h2 className="text-white text-2xl font-black uppercase tracking-tight">Explora un estilo de vida mejor</h2>
                <div className="h-1 w-12 bg-indigo-500 rounded-full"></div>
            </div>

            <div className="grid gap-4">
                {EXPLORE_CATEGORIES.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => onSelectCategory?.(cat.id)}
                        className={`group relative flex items-center gap-4 p-5 rounded-[1.5rem] transition-all active:scale-[0.97] hover:brightness-110 shadow-lg ${cat.color} ${cat.shadow}`}
                    >
                        {/* Icon Container */}
                        <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm border border-white/10 group-hover:scale-110 transition-transform">
                            {cat.icon}
                        </div>

                        {/* Text content */}
                        <div className="flex-1 text-left">
                            <h3 className="text-white font-bold text-lg leading-tight">{cat.title}</h3>
                            <p className="text-white/80 text-xs font-medium">{cat.subtitle}</p>
                        </div>

                        {/* Arrow */}
                        <div className="bg-white/10 p-2 rounded-full backdrop-blur-md opacity-50 group-hover:opacity-100 transition-opacity">
                            <ChevronRight size={18} className="text-white" />
                        </div>
                    </button>
                ))}
            </div>

            {/* Scientific Routine Banner */}
            <div
                onClick={() => onSelectRoutine?.('sleep')}
                className="mt-10 overflow-hidden relative rounded-[2rem] bg-indigo-950/40 border border-white/5 p-6 group cursor-pointer active:scale-95 transition-all"
            >
                <div className="absolute -right-4 -top-4 w-32 h-32 bg-indigo-500/20 blur-3xl rounded-full"></div>
                <div className="relative z-10 space-y-3">
                    <span className="bg-indigo-500/30 text-indigo-300 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">Recomendado ✨</span>
                    <h3 className="text-white text-xl font-black leading-tight">Rutina Científica: Ritual del Sueño</h3>
                    <p className="text-slate-400 text-sm">Optimiza tu descanso con una guía paso a paso de 21 días.</p>
                    <div className="flex items-center text-indigo-400 font-bold text-sm gap-2 pt-2">
                        Ver plan detallado <ChevronRight size={16} />
                    </div>
                </div>
            </div>
        </div>
    );
}
