import { Send, Bot, User, Sparkles, X, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { chatWithCoach } from '../../services/aiService';

export default function AICoach({ isOpen, onClose }) {
    const [messages, setMessages] = useState([
        { role: 'assistant', content: '¡Hola! Soy tu coach de Micro-Hábitos. ¿En qué puedo ayudarte a mejorar tu rutina hoy? ⚡' }
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
                setError("La API Key no está configurada. Por favor, añádela en el archivo .env.");
            } else {
                setError("Lo siento, hubo un problema conectando con mi cerebro artificial. Inténtalo de nuevo.");
            }
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="fixed bottom-24 right-4 left-4 md:left-auto md:w-96 z-[3000] flex flex-col h-[500px] glass-panel rounded-3xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.5)] border-indigo-500/30"
                >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-700 p-4 flex items-center justify-between text-white">
                        <div className="flex items-center gap-3">
                            <div className="bg-white/20 p-2 rounded-full animate-pulse">
                                <Bot size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold flex items-center gap-1">
                                    Coach IA <Sparkles size={14} className="text-yellow-300" />
                                </h3>
                                <p className="text-[10px] text-indigo-200">En línea para ayudarte</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="hover:bg-white/10 p-1 rounded-full transition-colors">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Chat Messages */}
                    <div
                        ref={scrollRef}
                        className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-900/50 backdrop-blur-2xl"
                        style={{ scrollBehavior: 'smooth' }}
                    >
                        {messages.map((msg, i) => (
                            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] p-3 rounded-2xl flex gap-3 ${msg.role === 'user'
                                    ? 'bg-indigo-600 text-white rounded-tr-none'
                                    : 'bg-slate-800 text-slate-100 rounded-tl-none border border-slate-700'
                                    }`}>
                                    {msg.role === 'assistant' && <Bot size={18} className="shrink-0 mt-1 text-indigo-400" />}
                                    <p className="text-sm leading-relaxed">{msg.content}</p>
                                </div>
                            </div>
                        ))}
                        {isTyping && (
                            <div className="flex justify-start">
                                <div className="bg-slate-800 p-3 rounded-2xl rounded-tl-none border border-slate-700 flex gap-2">
                                    <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></div>
                                    <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:-.3s]"></div>
                                    <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:-.5s]"></div>
                                </div>
                            </div>
                        )}
                        {error && (
                            <div className="flex justify-center flex-col items-center gap-2 p-4 bg-red-500/10 rounded-2xl border border-red-500/20 text-red-300 text-[10px] text-center">
                                <AlertCircle size={16} />
                                {error}
                            </div>
                        )}
                    </div>

                    {/* Footer Input */}
                    <form onSubmit={handleSend} className="p-4 bg-slate-900/80 border-t border-slate-800">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Escribe tu duda..."
                                className="w-full bg-slate-800/50 border border-slate-700 rounded-xl py-3 pl-4 pr-12 text-sm text-white focus:outline-none focus:border-indigo-500 transition-all"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                            />
                            <button
                                type="submit"
                                className="absolute right-2 top-2 p-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-colors shadow-lg"
                            >
                                <Send size={18} />
                            </button>
                        </div>
                    </form>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
