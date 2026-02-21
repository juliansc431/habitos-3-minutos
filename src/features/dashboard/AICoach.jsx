import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, X, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { chatWithCoach } from '../../services/aiService';

export default function AICoach({ isOpen, onClose }) {
    const [messages, setMessages] = useState([
        { role: 'assistant', content: '¡Hola! Soy tu Guardián de Cristal. Estoy aquí para canalizar tu energía y perfeccionar tus hábitos. ¿En qué podemos trabajar hoy? 💎✨' }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [error, setError] = useState(null);
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || isTyping) return;

        const userMsg = { role: 'user', content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);
        setError(null);

        try {
            const aiResponse = await chatWithCoach(input, messages);
            setMessages(prev => [...prev, { role: 'assistant', content: aiResponse }]);
        } catch (err) {
            console.error('AI Error:', err);
            if (err.message === "API_KEY_MISSING") {
                setError("La esencia del guardián aún no ha sido activada (Falta API Key).");
            } else {
                setError(`Error de canalización: ${err.message || 'Desconocido'}`);
            }
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[3000] flex items-end md:items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 100 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 100 }}
                        className="relative w-full max-w-lg h-[80vh] md:h-[600px] flex flex-col glass-panel rounded-[3rem] overflow-hidden border-indigo-500/30 shadow-[0_0_100px_rgba(79,70,229,0.2)]"
                    >
                        {/* Character Visualization Area */}
                        <div className="h-40 relative flex items-center justify-center overflow-hidden bg-gradient-to-b from-indigo-600/20 to-transparent">
                            {/* Animated Background Particles */}
                            {[...Array(6)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    animate={{
                                        y: [0, -100],
                                        opacity: [0, 1, 0],
                                        scale: [0, 1.5, 0]
                                    }}
                                    transition={{
                                        duration: 3 + Math.random() * 2,
                                        repeat: Infinity,
                                        delay: i * 0.5
                                    }}
                                    className="absolute w-1 h-1 bg-indigo-400 rounded-full"
                                    style={{ left: `${15 + i * 15}%`, top: '80%' }}
                                />
                            ))}

                            {/* The Crystal Guardian */}
                            <motion.div
                                animate={{
                                    y: [0, -10, 0],
                                    rotate: [0, 5, -5, 0]
                                }}
                                transition={{
                                    duration: 4,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                                className="relative z-10"
                            >
                                <div className="w-20 h-20 relative">
                                    {/* Core */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-400 to-purple-600 rounded-2xl rotate-45 blur-sm opacity-50 animate-pulse" />
                                    <div className="absolute inset-2 bg-white rounded-2xl rotate-45 shadow-[0_0_30px_rgba(255,255,255,0.8)] flex items-center justify-center overflow-hidden">
                                        <div className="w-full h-full bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 relative">
                                            {/* "Eye" */}
                                            <motion.div
                                                animate={{
                                                    scaleY: [1, 0.1, 1],
                                                }}
                                                transition={{
                                                    duration: 4,
                                                    repeat: Infinity,
                                                    repeatDelay: 2
                                                }}
                                                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-2 bg-slate-900 rounded-full"
                                            />
                                        </div>
                                    </div>
                                    {/* Floating Orbits */}
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                                        className="absolute -inset-4 border border-indigo-400/30 rounded-full"
                                    />
                                </div>
                            </motion.div>

                            <button onClick={onClose} className="absolute top-6 right-6 p-2 bg-white/5 hover:bg-white/10 rounded-full text-white/50 transition-all">
                                <X size={20} />
                            </button>

                            <div className="absolute bottom-4 text-center">
                                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-indigo-300">Guardián de Hábitos</h3>
                                <div className="flex items-center justify-center gap-1">
                                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                                    <span className="text-[10px] text-slate-400 font-bold uppercase">Entidad Conectada</span>
                                </div>
                            </div>
                        </div>

                        {/* Chat Messages */}
                        <div
                            ref={scrollRef}
                            className="flex-1 overflow-y-auto p-6 space-y-6"
                            style={{ scrollBehavior: 'smooth' }}
                        >
                            {messages.map((msg, i) => (
                                <motion.div
                                    initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    key={i}
                                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`max-w-[85%] p-4 rounded-3xl relative ${msg.role === 'user'
                                        ? 'bg-gradient-to-br from-indigo-600 to-purple-700 text-white rounded-tr-none shadow-xl'
                                        : 'bg-white/5 text-slate-100 rounded-tl-none border border-white/10'
                                        }`}>
                                        <p className="text-sm leading-relaxed font-medium">{msg.content}</p>
                                        <span className="text-[8px] opacity-40 mt-2 block font-black uppercase tracking-widest text-right">
                                            {msg.role === 'user' ? 'Tú' : 'Guardián'}
                                        </span>
                                    </div>
                                </motion.div>
                            ))}
                            {isTyping && (
                                <div className="flex justify-start">
                                    <div className="bg-white/5 p-4 rounded-3xl rounded-tl-none border border-white/10 flex gap-1.5">
                                        <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 0.6 }} className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                                        <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                                        <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                                    </div>
                                </div>
                            )}
                            {error && (
                                <div className="flex flex-col items-center gap-4 p-4">
                                    <div className="bg-red-500/10 border border-red-500/20 rounded-2xl px-4 py-3 flex flex-col items-center gap-2 text-red-300 text-[10px] font-bold uppercase tracking-wider text-center max-w-xs">
                                        <div className="flex items-center gap-2">
                                            <AlertCircle size={14} />
                                            <span>Error de Canalización Astral</span>
                                        </div>
                                        <p className="opacity-60 normal-case font-medium leading-tight">{error}</p>
                                    </div>
                                    <button
                                        onClick={() => {
                                            setError(null);
                                            handleSend({ preventDefault: () => { }, target: { value: messages[messages.length - 1]?.content } });
                                        }}
                                        className="px-6 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-indigo-300 transition-all active:scale-95"
                                    >
                                        Reintentar Conexión
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Footer Input */}
                        <div className="p-6 bg-slate-950/50 backdrop-blur-xl border-t border-white/5 relative">
                            <form onSubmit={handleSend} className="relative group">
                                <input
                                    type="text"
                                    placeholder="Canaliza tu consulta..."
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-6 pr-14 text-sm text-white focus:outline-none focus:border-indigo-500/50 focus:bg-white/10 transition-all placeholder:text-slate-600"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                />
                                <button
                                    type="submit"
                                    disabled={isTyping}
                                    className="absolute right-2 top-2 bottom-2 px-4 bg-indigo-600 text-white rounded-xl hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg flex items-center justify-center shadow-indigo-500/20"
                                >
                                    <Send size={18} />
                                </button>
                            </form>
                            <div className="absolute -bottom-1 left-0 right-0 text-center">
                                <span className="text-[7px] text-white/10 font-black tracking-[0.3em] uppercase">Guardian Protocol v6.1 Thinking Fix</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
