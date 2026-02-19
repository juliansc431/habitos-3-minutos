import { useState, useEffect } from 'react';
import Header from './Header';
import StatsCard from './StatsCard';
import { Target, Flame, Heart, MessageCircle, Gem, Clock, BarChart3 } from 'lucide-react';
import HabitGenerator from '../habits/HabitGenerator';
import DailyChallenge from '../habits/DailyChallenge';
import AICoach from './AICoach';
import Favorites from '../habits/Favorites';
import ProfileSettings from './ProfileSettings';
import CrystalGarden from './CrystalGarden';
import History from '../habits/History';
import HabitExplorer from '../habits/HabitExplorer';
import RoutineDetail from '../habits/RoutineDetail';
import StatsDetails from './StatsDetails';

export default function Dashboard({ user, onLogout }) {
    const [activeTab, setActiveTab] = useState('explore');
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedRoutine, setSelectedRoutine] = useState(null);
    const [isAICoachOpen, setIsAICoachOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [localUser, setLocalUser] = useState(user);

    // Sync localUser when context/prop user updates (e.g. after refreshProfile)
    useEffect(() => {
        if (user) setLocalUser(user);
    }, [user]);
    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setSelectedCategory(null);
        setSelectedRoutine(null);
    };

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
                        onClick={() => handleTabChange('explore')}
                        className={`flex-none px-6 py-2.5 rounded-lg font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 snap-start ${activeTab === 'explore'
                            ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg'
                            : 'text-slate-500 hover:text-slate-300'
                            }`}
                    >
                        <Target size={16} /> Explorar
                    </button>
                    <button
                        onClick={() => handleTabChange('routines')}
                        className={`flex-none px-6 py-2.5 rounded-lg font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 snap-start ${activeTab === 'routines'
                            ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg'
                            : 'text-slate-500 hover:text-slate-300'
                            }`}
                    >
                        <Clock size={16} /> Rutinas
                    </button>
                    <button
                        onClick={() => handleTabChange('challenge')}
                        className={`flex-none px-6 py-2.5 rounded-lg font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 snap-start ${activeTab === 'challenge'
                            ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg'
                            : 'text-slate-500 hover:text-slate-300'
                            }`}
                    >
                        <Flame size={16} /> Reto
                    </button>
                    <button
                        onClick={() => handleTabChange('favorites')}
                        className={`flex-none px-6 py-2.5 rounded-lg font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 snap-start ${activeTab === 'favorites'
                            ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg'
                            : 'text-slate-500 hover:text-slate-300'
                            }`}
                    >
                        <Heart size={16} /> Favoritos
                    </button>
                    <button
                        onClick={() => handleTabChange('garden')}
                        className={`flex-none px-6 py-2.5 rounded-lg font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 snap-start ${activeTab === 'garden'
                            ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg'
                            : 'text-slate-500 hover:text-slate-300'
                            }`}
                    >
                        <Gem size={16} /> Jardín
                    </button>
                    <button
                        onClick={() => handleTabChange('stats')}
                        className={`flex-none px-6 py-2.5 rounded-lg font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 snap-start ${activeTab === 'stats'
                            ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg'
                            : 'text-slate-500 hover:text-slate-300'
                            }`}
                    >
                        <BarChart3 size={16} /> Progreso
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

            {/* Floating AI Button - Crystal Guardian entry point */}
            <button
                onClick={() => setIsAICoachOpen(true)}
                className="fixed bottom-6 right-6 p-4 md:px-6 md:py-4 rounded-full bg-slate-900 text-indigo-400 shadow-[0_10px_40px_rgba(0,0,0,0.5)] hover:scale-110 active:scale-90 transition-all z-[2500] animate-float flex items-center gap-3 border-2 border-indigo-500/50"
            >
                <div className="relative">
                    <Gem size={24} fill="currentColor" className="drop-shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
                    <Sparkles size={12} className="absolute -top-1 -right-1 text-white animate-pulse" />
                </div>
                <span className="hidden md:block font-black text-sm uppercase tracking-widest text-white">Guardián IA</span>
                <div className="absolute top-0 right-0 w-4 h-4 bg-indigo-500 rounded-full border-4 border-[#1a1a3e] animate-pulse"></div>
            </button>

            <AICoach isOpen={isAICoachOpen} onClose={() => setIsAICoachOpen(false)} />

            <ProfileSettings
                isOpen={isProfileOpen}
                onClose={() => setIsProfileOpen(false)}
                user={localUser}
                onUpdate={(updated) => setLocalUser(updated)}
            />

            {/* Tab Content - Key forces fresh mount and animation */}
            <div key={activeTab} className="w-full pb-20">
                {activeTab === 'explore' && !selectedCategory && (
                    <HabitExplorer
                        onSelectCategory={(cat) => setSelectedCategory(cat)}
                    />
                )}
                {activeTab === 'routines' && (
                    <RoutineDetail
                        onBack={() => handleTabChange('explore')}
                        onStart={() => {
                            setSelectedCategory('calm');
                            setActiveTab('explore');
                        }}
                    />
                )}
                {activeTab === 'explore' && selectedCategory && (
                    <div className="px-4 animate-slide-up">
                        <button
                            onClick={() => setSelectedCategory(null)}
                            className="mb-4 text-indigo-400 text-xs font-bold uppercase flex items-center gap-1"
                        >
                            ← Volver a Explorar
                        </button>
                        <HabitGenerator initialCategory={selectedCategory} />
                    </div>
                )}
                {activeTab === 'challenge' && <DailyChallenge />}
                {activeTab === 'favorites' && <Favorites />}
                {activeTab === 'garden' && <CrystalGarden />}
                {activeTab === 'stats' && (
                    <div className="space-y-6">
                        <StatsDetails stats={{
                            streak: localUser.streak || 0,
                            totalMinutes: (localUser.total_completed || 0) * 3, // Approx 3m per habit
                            points: localUser.xp || 0
                        }} />
                        <History />
                    </div>
                )}
            </div>
        </div>
    );
}
