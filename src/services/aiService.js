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

    // Models to try - SDK Stage
    const modelOptions = [
        "models/gemini-1.5-flash-8b",
        "models/gemini-1.5-flash",
        "models/gemini-2.0-flash",
        "gemini-1.5-flash-8b",
        "gemini-1.5-flash",
        "gemini-pro"
    ];

    let lastError = null;

    for (const modelId of modelOptions) {
        try {
            console.log(`Intentando SDK: ${modelId}...`);
            const model = genAI.getGenerativeModel({ model: modelId });

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
            console.warn(`SDK falló:`, error.message);
            lastError = error;
            if (!error.message.includes("404") && !error.message.includes("quota")) break;
        }
    }

    // --- HYPER REST BRIDGE v5.4 ---
    console.log("Activando PUENTE REST v5.4...");
    const restModels = ["gemini-1.5-flash", "gemini-1.5-flash-8b", "gemini-2.0-flash"];
    const apiVersions = ["v1beta", "v1"];
    let restDiagMsg = "";

    for (const v of apiVersions) {
        for (const mId of restModels) {
            try {
                const cleanId = mId.startsWith("models/") ? mId : `models/${mId}`;
                const restUrl = `https://generativelanguage.googleapis.com/${v}/${cleanId}:generateContent?key=${apiKey}`;

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
                    restDiagMsg += `[${mId}: ${restData.error.message.substring(0, 40)}] `;
                }
            } catch (e) {
                restDiagMsg += `[${mId}: Error Red] `;
            }
        }
    }

    throw new Error(`BLOQUEO DE CUOTA (Limit 0): Google ha inhabilitado esta cuenta para usar IAs gratis. Detalles: ${restDiagMsg}. SOLUCIÓN DEFINITIVA: Crea una nueva API KEY con UN CORREO DE GOOGLE DISTINTO.`);
};
