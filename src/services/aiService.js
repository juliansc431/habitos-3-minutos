// aiService.js — REST directo a Gemini API (sin SDK, compatible con gemini-3-flash-preview)
// v6.0 — Direct REST, no SDK dependency

const SYSTEM_PROMPT = `Eres el "Coach de Micro-Hábitos Express", un asistente motivador y directo.

REGLA DE RESPUESTA:
- Responde en máximo 3-4 oraciones. Nunca más.
- Para saludos ("hola"): Una bienvenida breve y UNA pregunta. Sin listas.
- Cuando el usuario pida un hábito: Descríbelo brevemente y haz una pregunta de seguimiento.
- Usa 1-2 emojis por respuesta (⚡, 🧠, 💎).
- NO uses negritas, listas numeradas ni subtítulos.
- La app se llama "Hábitos 3 Minutos" (los usuarios ganan XP y Cristales).`;

const GEMINI_MODEL = "gemini-3-flash-preview";
const API_BASE = "https://generativelanguage.googleapis.com/v1beta/models";

export const chatWithCoach = async (userMessage, history = []) => {
    const rawKey = import.meta.env.VITE_GEMINI_API_KEY;
    const apiKey = rawKey ? rawKey.trim() : null;

    if (!apiKey) throw new Error("Llave API no configurada en Vercel.");
    if (!apiKey.startsWith("AIza")) throw new Error("Llave API inválida.");

    // Build conversation history for the API
    const contents = [];

    // Add system context as first user turn (Gemini 1.x style)
    contents.push({
        role: "user",
        parts: [{ text: SYSTEM_PROMPT + "\n\nConfirma con 'ENTENDIDO'." }]
    });
    contents.push({
        role: "model",
        parts: [{ text: "ENTENDIDO. ¿En qué hábito trabajamos hoy? 💎" }]
    });

    // Add conversation history (skip the first welcome message)
    for (let i = 1; i < history.length; i++) {
        const msg = history[i];
        contents.push({
            role: msg.role === "assistant" ? "model" : "user",
            parts: [{ text: msg.content }]
        });
    }

    // Add current user message
    contents.push({
        role: "user",
        parts: [{ text: userMessage }]
    });

    const url = `${API_BASE}/${GEMINI_MODEL}:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            contents,
            generationConfig: {
                maxOutputTokens: 400,
                temperature: 0.7,
            }
        })
    });

    if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        const errMsg = errData?.error?.message || `HTTP ${response.status}`;
        throw new Error(`API Error: ${errMsg}`);
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) throw new Error("Respuesta vacía del modelo.");

    return text;
};
