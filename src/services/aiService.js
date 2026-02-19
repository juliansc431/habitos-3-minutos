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
    // CRITICAL: Trim the API Key to remove hidden spaces (common Vercel issue)
    const rawKey = import.meta.env.VITE_GEMINI_API_KEY;
    const apiKey = rawKey ? rawKey.trim() : null;

    if (!apiKey) {
        throw new Error("Clave API no encontrada. Verifica que VITE_GEMINI_API_KEY esté en Vercel.");
    }

    if (apiKey.length < 30) {
        throw new Error(`Clave API muy corta (${apiKey.length} carc.). Revisa que esté completa en Vercel.`);
    }

    // Initialize or refresh the client
    if (!genAI || (genAI.apiKey !== apiKey)) {
        genAI = new GoogleGenerativeAI(apiKey);
    }

    try {
        // Use the most direct and stable model identifier
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const chatHistory = [
            {
                role: "user",
                parts: [{ text: SYSTEM_PROMPT + "\n\nResponde 'ENTENDIDO' como Coach." }],
            },
            {
                role: "model",
                parts: [{ text: "ENTENDIDO. Guardián activado. ¿Qué hábito vamos a potenciar? ⚡✨" }],
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
            generationConfig: {
                maxOutputTokens: 800,
                temperature: 0.7,
            },
        });

        const result = await chat.sendMessage(userMessage);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Gemini Error:", error);

        // Final fallback trying to use generateContent directly (bypassing chat session)
        try {
            const basicModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            const directResult = await basicModel.generateContent(userMessage);
            return directResult.response.text();
        } catch (fallbackError) {
            const errorMsg = error.message || "";
            if (errorMsg.includes("404")) {
                throw new Error("Error 404: Google no encuentra el modelo. Esto suele ser por espacios extras en la API Key o región no soportada.");
            }
            throw new Error(`Fallo de conexión: ${errorMsg}`);
        }
    }
};
