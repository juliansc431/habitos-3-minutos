import { useState, useEffect } from 'react';
import Header from './Header';
import StatsCard from './StatsCard';
import { Target, Flame, Heart, MessageCircle, Gem, Clock } from 'lucide-react';
import HabitGenerator from '../habits/HabitGenerator';
import DailyChallenge from '../habits/DailyChallenge';
import AICoach from './AICoach';
import Favorites from '../habits/Favorites';
import ProfileSettings from './ProfileSettings';
import CrystalGarden from './CrystalGarden';
import History from '../habits/History';

export default function Dashboard({ user, onLogout }) {
    const [activeTab, setActiveTab] = useState('generate');
    const [isAICoachOpen, setIsAICoachOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [localUser, setLocalUser] = useState(user);

    // Sync localUser when context/prop user updates (e.g. after refreshProfile)
    useEffect(() => {
        if (user) setLocalUser(user);
    }, [user]);
    return (
        <div className="w-full max-w-md flex flex-col items-center relative">
            <Header
                user={localUser}
                onLogout={onLogout}
                onSettings={() => setIsProfileOpen(true)}
            />
            <StatsCard stats={{
                points: localUser.xp || 0,
                completed: localUser.total_completed || 0,
                favorites: 0
            }} />

            {/* Tabs - Now scrollable on mobile */}
            <div className="w-full relative px-2 mb-6">
                <div className="flex gap-2 bg-slate-800/40 rounded-xl p-1 overflow-x-auto hide-scrollbar snap-x">
                    <button
                        onClick={() => setActiveTab('generate')}
                        className={`flex-none px-6 py-2.5 rounded-lg font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 snap-start ${activeTab === 'generate'
                            ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg'
                            : 'text-slate-500 hover:text-slate-300'
                            }`}
                    >
                        <Target size={16} /> Generar
                    </button>
                    <button
                        onClick={() => setActiveTab('challenge')}
                        className={`flex-none px-6 py-2.5 rounded-lg font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 snap-start ${activeTab === 'challenge'
                            ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg'
                            : 'text-slate-500 hover:text-slate-300'
                            }`}
                    >
                        <Flame size={16} /> Reto
                    </button>
                    <button
                        onClick={() => setActiveTab('favorites')}
                        className={`flex-none px-6 py-2.5 rounded-lg font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 snap-start ${activeTab === 'favorites'
                            ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg'
                            : 'text-slate-500 hover:text-slate-300'
                            }`}
                    >
                        <Heart size={16} /> Favoritos
                    </button>
                    <button
                        onClick={() => setActiveTab('garden')}
                        className={`flex-none px-6 py-2.5 rounded-lg font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 snap-start ${activeTab === 'garden'
                            ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg'
                            : 'text-slate-500 hover:text-slate-300'
                            }`}
                    >
                        <Gem size={16} /> Jardín
                    </button>
                    <button
                        onClick={() => setActiveTab('history')}
                        className={`flex-none px-6 py-2.5 rounded-lg font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 snap-start ${activeTab === 'history'
                            ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg'
                            : 'text-slate-500 hover:text-slate-300'
                            }`}
                    >
                        <Clock size={16} /> Historial
                    </button>
                    <button
                        onClick={() => setIsAICoachOpen(true)}
                        className="flex-none px-6 py-2.5 rounded-lg font-bold text-xs uppercase tracking-wider text-slate-500 hover:text-slate-300 transition-all flex items-center justify-center gap-2 snap-start"
                    >
                        <MessageCircle size={16} /> Coach
                    </button>
                </div>
                {/* Visual fade for overflow */}
                <div className="absolute right-2 top-0 bottom-0 w-8 bg-gradient-to-l from-slate-900/50 to-transparent pointer-events-none rounded-r-xl" />
            </div>

            {/* Floating AI Button - Responsive labeling */}
            <button
                onClick={() => setIsAICoachOpen(true)}
                className="fixed bottom-6 right-6 p-4 md:px-6 md:py-4 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-[0_10px_40px_rgba(79,70,229,0.5)] hover:scale-110 active:scale-90 transition-all z-[2500] animate-float flex items-center gap-3 border border-white/20"
            >
                <MessageCircle size={24} fill="white" className="drop-shadow-sm" />
                <span className="hidden md:block font-black text-sm uppercase tracking-widest">Coach IA</span>
                <div className="absolute top-0 right-0 w-4 h-4 bg-emerald-500 rounded-full border-4 border-[#1a1a3e] animate-pulse"></div>
            </button>

            <AICoach isOpen={isAICoachOpen} onClose={() => setIsAICoachOpen(false)} />

            <ProfileSettings
                isOpen={isProfileOpen}
                onClose={() => setIsProfileOpen(false)}
                user={localUser}
                onUpdate={(updated) => setLocalUser(updated)}
            />

            {/* Tab Content */}
            <div className="w-full animate-slide-up pb-20">
                {activeTab === 'generate' && <HabitGenerator />}
                {activeTab === 'challenge' && <DailyChallenge />}
                {activeTab === 'favorites' && <Favorites />}
                {activeTab === 'garden' && <CrystalGarden />}
                {activeTab === 'history' && <History />}
            </div>
        </div>
    );
}
