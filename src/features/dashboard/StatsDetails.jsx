import { useState } from 'react';
import { BarChart3, TrendingUp, Calendar, Clock, Award, ChevronRight } from 'lucide-react';

const WEEK_DATA = [
    { day: 'D', value: 40, active: false },
    { day: 'L', value: 60, active: false },
    { day: 'M', value: 45, active: false },
    { day: 'M', value: 80, active: true },
    { day: 'J', value: 50, active: false },
    { day: 'V', value: 30, active: false },
    { day: 'S', value: 20, active: false }
];

const MONTH_DATA = [
    { day: 'S1', value: 65, active: false },
    { day: 'S2', value: 85, active: false },
    { day: 'S3', value: 75, active: true },
    { day: 'S4', value: 90, active: false }
];

const TODAY_DATA = [
    { day: '8AM', value: 20, active: false },
    { day: '12PM', value: 60, active: true },
    { day: '4PM', value: 30, active: false },
    { day: '8PM', value: 10, active: false }
];

export default function StatsDetails({ stats }) {
    const [activeFilter, setActiveFilter] = useState('hoy');

    const chartData = activeFilter === 'hoy' ? TODAY_DATA : activeFilter === 'semana' ? WEEK_DATA : MONTH_DATA;

    return (
        <div className="w-full space-y-6 px-4 py-6 animate-slide-up">
            <div className="space-y-1 mb-8">
                <h2 className="text-white text-2xl font-black uppercase tracking-tight">Seguimiento de Progreso</h2>
                <div className="h-1 w-12 bg-indigo-500 rounded-full"></div>
            </div>

            {/* Time Filter Tabs */}
            <div className="flex gap-2 p-1 bg-white/5 rounded-2xl border border-white/5 mb-6">
                <button
                    onClick={() => setActiveFilter('hoy')}
                    className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${activeFilter === 'hoy' ? 'bg-white/10 text-white shadow-sm' : 'text-slate-500 hover:text-white'}`}
                >Hoy</button>
                <button
                    onClick={() => setActiveFilter('semana')}
                    className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${activeFilter === 'semana' ? 'bg-white/10 text-white shadow-sm' : 'text-slate-500 hover:text-white'}`}
                >Semana</button>
                <button
                    onClick={() => setActiveFilter('mes')}
                    className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${activeFilter === 'mes' ? 'bg-white/10 text-white shadow-sm' : 'text-slate-500 hover:text-white'}`}
                >Mes</button>
            </div>

            {/* Main Chart Card */}
            <div className="glass-panel rounded-[2rem] p-6 border border-white/5 shadow-2xl overflow-hidden relative">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <BarChart3 size={60} />
                </div>

                <div className="flex justify-between items-start mb-8">
                    <div>
                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Promedio Diario</p>
                        <h3 className="text-white text-3xl font-black">
                            {activeFilter === 'hoy' ? '1.2h' : activeFilter === 'semana' ? '28.5m' : '4.5h'}
                            <span className="text-sm font-bold text-slate-500 uppercase ml-1">total</span>
                        </h3>
                    </div>
                    <div className="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-[10px] font-black flex items-center gap-1">
                        <TrendingUp size={12} /> +12%
                    </div>
                </div>

                {/* Bar Graph */}
                <div className="flex items-end justify-between h-32 gap-2 px-2">
                    {chartData.map((item, i) => (
                        <div key={i} className="flex flex-col items-center gap-3 flex-1">
                            <div className="w-full relative group h-full flex items-end justify-center">
                                <div
                                    className={`w-full max-w-[12px] rounded-full transition-all duration-500 ${item.active ? 'bg-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.5)]' : 'bg-indigo-500/40 hover:bg-indigo-500'}`}
                                    style={{ height: `${item.value}%` }}
                                ></div>
                            </div>
                            <span className={`text-[10px] font-bold ${item.active ? 'text-white' : 'text-slate-500'}`}>{item.day}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Summary Grid */}
            <div className="grid grid-cols-2 gap-4">
                <div className="glass-panel p-5 rounded-[2rem] border border-white/5 active:scale-95 transition-transform">
                    <div className="text-indigo-400 mb-3"><Calendar size={20} /></div>
                    <p className="text-slate-500 text-[10px] font-black uppercase mb-1">Racha Actual</p>
                    <h4 className="text-white text-xl font-black">{stats.streak || 0} Días</h4>
                </div>
                <div className="glass-panel p-5 rounded-[2rem] border border-white/5 active:scale-95 transition-transform">
                    <div className="text-purple-400 mb-3"><Clock size={20} /></div>
                    <p className="text-slate-500 text-[10px] font-black uppercase mb-1">Tiempo Total</p>
                    <h4 className="text-white text-xl font-black">{(stats.totalMinutes || 0).toFixed(1)}m</h4>
                </div>
            </div>

            {/* Achievement Preview */}
            <button
                onClick={() => alert('¡Próximamente! Desbloquea más logros para subir de rango.')}
                className="glass-panel w-full flex items-center justify-between p-6 rounded-[2rem] border border-white/5 bg-gradient-to-r from-white/[0.02] to-transparent active:scale-[0.98] transition-all hover:bg-white/[0.05]"
            >
                <div className="flex items-center gap-4 text-left">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/20 flex items-center justify-center text-amber-500 border border-amber-500/20">
                        <Award size={24} />
                    </div>
                    <div>
                        <h4 className="text-white font-bold text-sm">Próximo Rango</h4>
                        <p className="text-slate-500 text-xs">A 150 XP de Maestro de Rutinas</p>
                    </div>
                </div>
                <div className="text-slate-400">
                    <ChevronRight size={20} />
                </div>
            </button>
        </div>
    );
}
