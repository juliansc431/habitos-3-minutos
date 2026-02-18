export default function StatsCard({ stats }) {
    // Safe defaults
    const { points = 0, completed = 0, favorites = 0 } = stats || {};

    return (
        <div className="glass-panel rounded-2xl p-4 mb-6 grid grid-cols-3 gap-3 w-full max-w-md animate-slide-up">
            <div className="text-center">
                <div className="text-2xl font-bold text-emerald-500">
                    {points}
                </div>
                <p className="text-slate-400 text-xs">Puntos</p>
            </div>

            <div className="text-center border-l border-r border-indigo-500/20">
                <div className="text-2xl font-bold text-indigo-500">
                    {completed}
                </div>
                <p className="text-slate-400 text-xs">Completados</p>
            </div>

            <div className="text-center">
                <div className="text-2xl font-bold text-rose-500">
                    {favorites}
                </div>
                <p className="text-slate-400 text-xs">Favoritos</p>
            </div>
        </div>
    );
}
