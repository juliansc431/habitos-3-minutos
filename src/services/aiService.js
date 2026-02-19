import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

const SYSTEM_PROMPT = `
Eres el "Coach de Micro-Hábitos Express", un experto en neurociencia aplicada, psicología del comportamiento y el método de Hábitos Atómicos. 
Tu objetivo es ayudar al usuario a construir rutinas poderosas de máximo 3 minutos.

Reglas de Oro:
1. Sé extremadamente motivador, profesional y científico. 
2. Todas tus recomendaciones deben poder realizarse en menos de 3 minutos.
3. Usa un lenguaje "premium" pero cercano.
4. Si el usuario te pregunta algo fuera de hábitos, salud mental o productividad, redirígelo gentilmente al propósito de la app.
5. Usa emojis científicos y de energía (⚡, 🧠, 🧪, 💎) para enfatizar.

Contexto de la app:
- La app se llama "Hábitos 3 Minutos".
- Los usuarios ganan XP y Cristales por completar tareas.
- El enfoque es: "Pequeñas acciones, grandes resultados".
`;

export const chatWithCoach = async (userMessage, history = []) => {
    const rawKey = import.meta.env.VITE_GEMINI_API_KEY;
    const apiKey = rawKey ? rawKey.trim() : null;

    if (!apiKey) throw new Error("Llave API no detectada en Vercel.");
    if (!apiKey.startsWith("AIza")) throw new Error("Llave API inválida (debe empezar por AIza).");

    if (!genAI || (genAI.apiKey !== apiKey)) {
        genAI = new GoogleGenerativeAI(apiKey);
    }

    // Models to try
    const modelOptions = [
        "gemini-1.5-flash",
        "gemini-pro"
    ];

    let lastError = null;

    for (const modelId of modelOptions) {
        try {
            const model = genAI.getGenerativeModel({ model: modelId });

            const chatHistory = [
                {
                    role: "user",
                    parts: [{ text: SYSTEM_PROMPT + "\n\nResponde 'ENTENDIDO' como Coach." }],
                },
                {
                    role: "model",
                    parts: [{ text: "ENTENDIDO. ¿Qué hábito vamos a potenciar? ⚡✨" }],
                },
                ...history
                    .filter((msg, index) => index > 0)
                    .map(msg => ({
                        role: msg.role === 'assistant' ? 'model' : 'user',
                        parts: [{ text: msg.content }],
                    }))
            ];

            const chat = model.startChat({
                history: chatHistory,
                generationConfig: { maxOutputTokens: 800 }
            });

            const result = await chat.sendMessage(userMessage);
            const response = await result.response;
            return response.text();
        } catch (error) {
            console.warn(`Model ${modelId} failed:`, error.message);
            lastError = error;
            if (!error.message.includes("404")) break;
        }
    }

    // --- NEW DIAGNOSTIC v4.5 ---
    let extraInfo = "";
    try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
        const devResponse = await fetch(url);
        const data = await devResponse.json();

        if (data.error) {
            extraInfo = `GOOGLE DIJO: ${data.error.message} (${data.error.status})`;
        } else if (data.models) {
            const list = data.models.map(m => m.name.replace('models/', '')).slice(0, 5).join(', ');
            extraInfo = `Modelos Permitidos: [${list}]`;
        } else {
            extraInfo = "Google no devolvió lista de modelos ni error claro.";
        }
    } catch (e) {
        extraInfo = "Error al intentar consultar modelos (Posible bloqueo de red o CORS).";
    }

    if (lastError?.message.includes("404")) {
        throw new Error(`BLOQUEO 404: Google no encuentra el servicio para tu llave. ${extraInfo}. Sugerencia: Crea la llave en un NUEVO PROYECTO en AI Studio.`);
    }

    throw new Error(`Fallo de conexión: ${lastError?.message || "Desconocido"}. ${extraInfo}`);
};
