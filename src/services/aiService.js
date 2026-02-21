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

    let activeGenAI = new GoogleGenerativeAI(apiKey);

    // Prioritize gemini-2.0-flash (only model confirmed available on this account)
    const modelOptions = [
        "gemini-2.0-flash",
        "gemini-2.0-flash-exp",
        "gemini-2.0-flash-lite",
        "gemini-1.5-flash",
        "gemini-pro"
    ];

    for (const modelId of modelOptions) {
        try {
            console.log(`Intentando SDK: ${modelId}...`);
            const model = activeGenAI.getGenerativeModel({ model: modelId });

            const chatHistory = [
                {
                    role: "user",
                    parts: [{ text: SYSTEM_PROMPT + "\n\nResponde 'ENTENDIDO' como Coach." }],
                },
                {
                    role: "model",
                    parts: [{ text: "ENTENDIDO. Sistema de Guardián 2.0 activo. ¿Qué meta vamos a conquistar hoy? ⚡💎" }],
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
                generationConfig: { maxOutputTokens: 1000 }
            });

            const result = await chat.sendMessage(userMessage);
            const response = await result.response;
            return response.text();
        } catch (error) {
            console.warn(`SDK falló (${modelId}):`, error.message);
            if (!error.message.includes("404") && !error.message.includes("quota") && !error.message.includes("not found")) break;
        }
    }

    // --- REST BRIDGE v5.6 - gemini-2.0-flash priority ---
    console.log("Activando PUENTE REST v5.6...");
    let restDiagMsg = "";

    const restModels = ["gemini-2.0-flash", "gemini-2.0-flash-exp", "gemini-2.0-flash-lite"];
    const apiVersions = ["v1beta", "v1"];

    for (const v of apiVersions) {
        for (const mId of restModels) {
            try {
                const restUrl = `https://generativelanguage.googleapis.com/${v}/models/${mId}:generateContent?key=${apiKey}`;
                const restResponse = await fetch(restUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{ parts: [{ text: SYSTEM_PROMPT + "\n\nUser: " + userMessage }] }]
                    })
                });

                const restData = await restResponse.json();

                if (restData.candidates?.[0]?.content?.parts?.[0]?.text) {
                    return restData.candidates[0].content.parts[0].text;
                }

                if (restData.error) {
                    restDiagMsg += `[${mId}: ${restData.error.message.substring(0, 50)}] `;
                }
            } catch (e) {
                restDiagMsg += `[${mId}: Error Red] `;
            }
        }
    }

    // Check if it's a rate limit issue (temporary) vs permanent block
    const isRateLimit = restDiagMsg.includes("quota") || restDiagMsg.includes("exceeded");

    if (isRateLimit) {
        throw new Error(`⏱️ LÍMITE POR MINUTO ALCANZADO: La cuenta gratuita de Google permite ~15 mensajes por minuto. Por favor, espera 60 segundos y vuelve a intentarlo. ¡El Guardián estará listo! 💎`);
    }

    throw new Error(`Error de conexión con Google. Detalles: ${restDiagMsg}. Intenta de nuevo en 1 minuto.`);
};
