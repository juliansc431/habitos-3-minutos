import { useState, useEffect } from 'react';
import { Heart, Play, Trash2 } from 'lucide-react';

export default function Favorites() {
    const [favorites, setFavorites] = useState([
        { id: 1, emoji: '☕', text: 'Disfruta de un café sin distracciones', duration: '3 min' },
        { id: 2, emoji: '📖', text: 'Lee una página de un libro', duration: '2 min' }
    ]);

    const removeFavorite = (id) => {
        setFavorites(favorites.filter(f => f.id !== id));
    };

    return (
        <div className="space-y-4 animate-slide-up">
            <div className="flex items-center gap-2 text-slate-100 font-bold mb-4">
                <Heart className="text-rose-500 fill-rose-500" size={20} />
                Tus Favoritos
            </div>

            {favorites.length > 0 ? (
                favorites.map(fav => (
                    <div key={fav.id} className="glass-panel rounded-2xl p-4 flex items-center justify-between border-slate-700/50 hover:border-indigo-500/30 transition-all group">
                        <div className="flex items-center gap-4">
                            <div className="text-3xl bg-slate-800/50 p-2 rounded-xl group-hover:scale-110 transition-transform">
                                {fav.emoji}
                            </div>
                            <div>
                                <p className="text-slate-100 font-medium text-sm leading-tight">{fav.text}</p>
                                <span className="text-indigo-400 text-[10px] font-bold uppercase tracking-wider">{fav.duration}</span>
                            </div>
                        </div>

                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="p-2 bg-indigo-500/20 text-indigo-400 rounded-lg hover:bg-indigo-500/40 transition-colors">
                                <Play size={16} fill="currentColor" />
                            </button>
                            <button
                                onClick={() => removeFavorite(fav.id)}
                                className="p-2 bg-rose-500/20 text-rose-400 rounded-lg hover:bg-rose-500/40 transition-colors"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                ))
            ) : (
                <div className="glass-panel rounded-2xl p-12 text-center border-dashed border-2 border-slate-700 bg-slate-800/20">
                    <Heart className="mx-auto text-slate-600 mb-3" size={40} />
                    <p className="text-slate-400 text-sm">Aún no tienes favoritos.<br />¡Guarda los que más te gusten!</p>
                </div>
            )}
        </div>
    );
}
