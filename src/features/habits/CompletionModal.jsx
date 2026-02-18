import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Trophy } from 'lucide-react';
import { useCelebration } from '../../hooks/useCelebration';

const Confetti = () => {
    const particles = Array.from({ length: 40 });
    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {particles.map((_, i) => (
                <motion.div
                    key={i}
                    initial={{
                        top: "50%",
                        left: "50%",
                        scale: 0,
                        rotate: 0,
                        opacity: 1
                    }}
                    animate={{
                        top: `${Math.random() * 100}%`,
                        left: `${Math.random() * 100}%`,
                        scale: Math.random() * 1.5 + 0.5,
                        rotate: Math.random() * 360,
                        opacity: 0
                    }}
                    transition={{
                        duration: Math.random() * 2 + 1,
                        ease: "easeOut",
                        delay: Math.random() * 0.2
                    }}
                    className="absolute w-2 h-2 rounded-full"
                    style={{
                        backgroundColor: ['#10b981', '#34d399', '#facc15', '#6366f1', '#a855f7'][Math.floor(Math.random() * 5)]
                    }}
                />
            ))}
        </div>
    );
};

export default function CompletionModal({ isOpen, onClose, xpEarned, newStreak }) {
    const { playSuccessSound } = useCelebration();
    const [showConfetti, setShowConfetti] = useState(false);

    useEffect(() => {
        if (isOpen) {
            playSuccessSound();
            setShowConfetti(true);
            const timer = setTimeout(() => setShowConfetti(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [isOpen, playSuccessSound]);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-[2000] p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    {showConfetti && <Confetti />}

                    <motion.div
                        initial={{ scale: 0.5, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.5, opacity: 0, y: 20 }}
                        className="relative bg-gradient-to-b from-emerald-500/20 to-teal-500/10 border-2 border-emerald-500/50 rounded-[2.5rem] p-10 text-center max-w-sm w-full shadow-[0_0_50px_rgba(16,185,129,0.3)] backdrop-blur-xl"
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="text-7xl mb-6 filter drop-shadow-lg"
                        >
                            🎉
                        </motion.div>
                        <h2 className="text-3xl font-black mb-6 text-emerald-400 leading-tight">¡Hábito Completado!</h2>

                        <div className="space-y-6 mb-10 text-slate-100">
                            <div className="flex items-center justify-center gap-3 text-3xl font-black">
                                <Star className="text-yellow-400 fill-yellow-400" size={32} />
                                <span className="drop-shadow-sm">+{xpEarned} Puntos</span>
                            </div>
                            <div className="inline-block px-6 py-2 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 text-xl font-black text-emerald-300">
                                🔥 Racha de {newStreak} días
                            </div>
                        </div>

                        <button
                            onClick={onClose}
                            className="w-full py-5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white rounded-2xl font-black text-xl shadow-xl shadow-emerald-500/30 transition-all active:scale-95 flex items-center justify-center gap-3"
                        >
                            <Trophy size={24} />
                            Continuar
                        </button>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
