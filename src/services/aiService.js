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
    // CRITICAL: Trim and Validate API Key
    const rawKey = import.meta.env.VITE_GEMINI_API_KEY;
    const apiKey = rawKey ? rawKey.trim() : null;

    if (!apiKey) {
        throw new Error("Clave API NO DETECTADA. Revisa las variables en Vercel (VITE_GEMINI_API_KEY).");
    }

    // Google API Keys always start with AIza
    if (!apiKey.startsWith("AIza")) {
        throw new Error(`Clave API INVÁLIDA: Comienza por '${apiKey.substring(0, 4)}...', pero debe empezar por 'AIza'. Revisa lo que pegaste en Vercel.`);
    }

    if (apiKey.length < 35) {
        throw new Error(`Clave API INCOMPLETA: Tiene ${apiKey.length} caracteres. Verifica que la copiaste entera de Google AI Studio.`);
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
            },
        });

        const result = await chat.sendMessage(userMessage);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Gemini Details:", error);

        const errorMsg = error.message || "";
        if (errorMsg.includes("404")) {
            throw new Error("Error 404 (Google): Recurso no encontrado. Esto suele pasar si el modelo está deshabilitado para tu llave o la región no tiene servicio.");
        }

        // Final desperate attempt without chat session
        try {
            const basicModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            const directResult = await basicModel.generateContent(userMessage);
            return directResult.response.text();
        } catch (f) {
            throw new Error(`Fallo de conexión: ${errorMsg}`);
        }
    }
};
