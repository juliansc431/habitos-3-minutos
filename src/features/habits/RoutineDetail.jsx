import { ChevronLeft, Moon, Zap, Target, Award, Clock } from 'lucide-react';

const SLEEP_ROUTINE = {
    title: "Ritual antes de dormir",
    subtitle: "Para un sueño reparador",
    image: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&q=80&w=800",
    benefits: [
        { icon: <Moon size={16} />, text: "Despídete del insomnio" },
        { icon: <Clock size={16} />, text: "Duerme más rápido" },
        { icon: <Zap size={16} />, text: "Más energía y creatividad" },
        { icon: <Award size={16} />, text: "Horario de vida saludable" }
    ],
    phases: [
        {
            days: "Día 1-7",
            title: "Evaluación de la adaptabilidad",
            description: "Ajuste de horarios y entorno de sueño.",
            color: "bg-blue-500",
            dotColor: "border-blue-500"
        },
        {
            days: "Día 8-21",
            title: "Crear nuevos hábitos",
            description: "Consolidación de rituales pre-sueño.",
            color: "bg-emerald-500",
            dotColor: "border-emerald-500"
        },
        {
            days: "Día 22-30",
            title: "Consolidar los resultados",
            description: "Optimización profunda y descanso total.",
            color: "bg-orange-500",
            dotColor: "border-orange-500"
        },
        {
            days: "Final",
            title: "¡PLAN TERMINADO!",
            description: "Has dominado tu ritual de descanso.",
            color: "bg-indigo-500",
            dotColor: "border-indigo-500",
            isFinal: true
        }
    ]
};

export default function RoutineDetail({ onBack }) {
    return (
        <div className="w-full min-h-screen bg-[#0a0a14] animate-slide-up pb-20">
            {/* Header / Image Area */}
            <div className="relative h-72 w-full">
                <img
                    src={SLEEP_ROUTINE.image}
                    alt="Rest"
                    className="w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a14] via-transparent to-transparent"></div>

                {/* Back Button */}
                <button
                    onClick={onBack}
                    className="absolute top-6 left-6 p-3 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 text-white active:scale-90 transition-all"
                >
                    <ChevronLeft size={20} />
                </button>

                {/* Floating Title */}
                <div className="absolute bottom-6 left-6 right-6">
                    <h1 className="text-white text-3xl font-black uppercase leading-none mb-2">{SLEEP_ROUTINE.title}</h1>
                    <p className="text-indigo-400 font-bold tracking-widest text-xs uppercase">{SLEEP_ROUTINE.subtitle}</p>
                </div>
            </div>

            {/* Benefits Grid */}
            <div className="px-6 py-8">
                <div className="grid grid-cols-2 gap-3">
                    {SLEEP_ROUTINE.benefits.map((b, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/5">
                            <div className="text-indigo-400">{b.icon}</div>
                            <span className="text-[10px] font-bold text-slate-300 leading-tight uppercase tracking-wide">{b.text}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Timeline Area */}
            <div className="px-8 mt-4 relative">
                {/* Vertical Line */}
                <div className="absolute left-[39px] top-4 bottom-10 w-0.5 bg-gradient-to-b from-blue-500 via-emerald-500 to-indigo-500 opacity-20"></div>

                <div className="space-y-12">
                    {SLEEP_ROUTINE.phases.map((phase, i) => (
                        <div key={i} className="flex gap-6 relative group">
                            {/* Dot */}
                            <div className="relative z-10 flex flex-col items-center">
                                <div className={`w-6 h-6 rounded-full border-4 bg-[#0a0a14] ${phase.dotColor} z-20 group-hover:scale-125 transition-transform`}></div>
                            </div>

                            {/* Content Card */}
                            <div className="flex-1 glass-panel rounded-3xl p-6 border border-white/5 shadow-xl group-hover:bg-white/10 transition-colors">
                                <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-black text-white mb-3 ${phase.color}`}>
                                    {phase.days}
                                </span>
                                <h4 className="text-white font-bold text-base mb-2">{phase.title}</h4>
                                <p className="text-slate-400 text-xs leading-relaxed">{phase.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* CTA Button */}
            <div className="fixed bottom-6 left-6 right-6 z-50">
                <button className="btn-primary w-full py-5 rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-2xl shadow-indigo-600/40 active:scale-95">
                    Empezar este plan científico
                </button>
            </div>
        </div>
    );
}
