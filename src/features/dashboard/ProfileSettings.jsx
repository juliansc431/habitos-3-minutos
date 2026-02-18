import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const AVATARS = ['🦸', '🧘', '🧠', '🚀', '🔥', '✨', '⚡', '🌈', '🥑', '🎯', '💎', '🎨'];

export default function ProfileSettings({ isOpen, onClose, user, onUpdate }) {
    const [username, setUsername] = useState(user.username || '');
    const [selectedAvatar, setSelectedAvatar] = useState(user.avatar || '🦸');
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const { error } = await supabase
                .from('profiles')
                .update({ username, avatar: selectedAvatar })
                .eq('id', user.id);

            if (error) throw error;

            onUpdate({ ...user, username, avatar: selectedAvatar });
            onClose();
        } catch (err) {
            console.error('Error updating profile:', err);
            alert('Error al guardar los cambios. Verifica tu conexión.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-[4000] p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-md"
                    />

                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 30 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 30 }}
                        className="relative bg-[#1a1a3e] border border-white/10 rounded-[2.5rem] p-8 max-w-sm w-full shadow-2xl"
                    >
                        <button onClick={onClose} className="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors">
                            <X size={24} />
                        </button>

                        <h2 className="text-2xl font-bold text-white mb-8">Editar Perfil</h2>

                        <div className="space-y-8">
                            <div className="text-center">
                                <div className="text-7xl mb-6 bg-indigo-500/10 w-32 h-32 flex items-center justify-center rounded-[2rem] mx-auto border border-white/5">
                                    {selectedAvatar}
                                </div>
                                <div className="grid grid-cols-4 gap-3 bg-white/5 p-4 rounded-3xl">
                                    {AVATARS.map(emoji => (
                                        <button
                                            key={emoji}
                                            onClick={() => setSelectedAvatar(emoji)}
                                            className={`text-2xl p-2 rounded-xl transition-all hover:scale-125 ${selectedAvatar === emoji ? 'bg-indigo-600 scale-110 shadow-lg' : 'hover:bg-white/5'
                                                }`}
                                        >
                                            {emoji}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-2">Nombre de usuario</label>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full bg-slate-800/50 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-indigo-500 font-medium"
                                    placeholder="Tu nombre..."
                                />
                            </div>

                            <button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="w-full py-5 bg-gradient-to-r from-indigo-600 to-purple-600 disabled:opacity-50 text-white font-bold rounded-2xl shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2"
                            >
                                {isSaving ? 'Guardando...' : <>✨ Guardar Cambios</>}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
