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

    // Lista de modelos a probar por orden de preferencia
    const modelOptions = [
        "gemini-1.5-flash",
        "gemini-1.5-flash-8b",
        "gemini-1.0-pro"
    ];

    let lastError = null;

    for (const modelId of modelOptions) {
        try {
            const model = genAI.getGenerativeModel({ model: modelId });

            // Re-build history for each attempt
            const chatHistory = [
                {
                    role: "user",
                    parts: [{ text: SYSTEM_PROMPT + "\n\nResponde 'ENTENDIDO' como Coach." }],
                },
                {
                    role: "model",
                    parts: [{ text: "ENTENDIDO. Guardián activado." }],
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
            console.warn(`Falló el modelo ${modelId}:`, error.message);
            lastError = error;
            // Si el error no es un 404 (ej: falta de llave), no seguimos probando
            if (!error.message.includes("404")) break;
        }
    }

    // Si llegamos aquí, todos fallaron
    const errorDetail = lastError?.message || "Error desconocido";
    if (errorDetail.includes("404")) {
        throw new Error("ERROR GOOGLE: Tu cuenta no tiene acceso a los modelos Gemini. Por favor, crea una NUEVA API KEY en AI Studio y asegúrate de no tener restricciones de país.");
    }
    throw new Error(`Fallo de conexión: ${errorDetail}`);
};
