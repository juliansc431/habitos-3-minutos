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
    // Re-check for API key in case it was set after initialization
    if (!genAI) {
        const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
        if (apiKey) {
            genAI = new GoogleGenerativeAI(apiKey);
        } else {
            throw new Error("API_KEY_MISSING");
        }
    }

    try {
        // Use clean model names (SDK handles the 'models/' prefix internally)
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // Gemini expects alternating roles: user -> model -> user...
        // We inject the SYSTEM_PROMPT as the first 'user' message to set the persona
        const chatHistory = [
            {
                role: "user",
                parts: [{ text: SYSTEM_PROMPT + "\n\nResponde 'ENTENDIDO' para activar tu protocolo de guardián." }],
            },
            {
                role: "model",
                parts: [{ text: "ENTENDIDO. Sistema de Guardián de Hábitos activado. Estoy listo para canalizar tus metas y optimizar tu potencial. 💎✨" }],
            },
            ...history
                .filter((msg, index) => index > 0) // Skip component greeting
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
        console.error("AI Service Error:", error);

        // Fallback to pro if flash fails
        try {
            const fallbackModel = genAI.getGenerativeModel({ model: "gemini-pro" });
            const result = await fallbackModel.generateContent(SYSTEM_PROMPT + "\n\nUsuario: " + userMessage);
            const response = await result.response;
            return response.text();
        } catch (finalError) {
            throw new Error(`Error 404/Conexión: Verifica que tu VITE_GEMINI_API_KEY en Vercel sea correcta y no tenga espacios.`);
        }
    }
};
