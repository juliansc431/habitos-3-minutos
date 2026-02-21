import { GoogleGenerativeAI } from "@google/generative-ai";

const SYSTEM_PROMPT = `
Eres el "Coach de Micro-Hábitos Express", un asistente de hábitos conciso y motivador.

REGLA ABSOLUTA DE BREVEDAD (JAMÁS la rompas):
- MÁXIMO 2 oraciones por respuesta. Nunca más.
- Saludo simple ("hola", "hi"): UNA oración de bienvenida + UNA pregunta corta. Ejemplo: "¡Hola! ¿En qué hábito trabajamos hoy? 💎"
- NUNCA hagas listas numeradas a menos que el usuario las pida explícitamente.
- NUNCA uses subtítulos ni negritas en exceso.
- Sé como un mensaje de WhatsApp: breve, directo y cálido.

Tu rol:
- Experto en hábitos de 3 minutos.
- Usa 1-2 emojis máximo (⚡, 🧠, 💎).
- Redirige temas off-topic con UNA frase.
- La app se llama "Hábitos 3 Minutos" (XP y Cristales por completar tareas).
`;

// Truncates model response to first 1-2 natural sentences (no lists, no markdown headers)
const truncateResponse = (text) => {
    if (!text) return text;

    // Remove markdown headers (###, ##, #)
    let clean = text.replace(/^#{1,3}\s+.*/gm, '').trim();

    // Remove numbered/bullet lists - take only text before first list item
    const listStart = clean.search(/\n\s*[\d]+\.\s|\n\s*[-*]\s/);
    if (listStart > 0) {
        clean = clean.substring(0, listStart).trim();
    }

    // Take only first paragraph (before double newline)
    const firstParagraph = clean.split(/\n\n/)[0].trim();

    // Find first sentence end (keep max 2 sentences)
    const sentenceEnd = firstParagraph.search(/[.!?][^.!?]{0,5}[.!?]|[.!?]\s/);
    if (sentenceEnd > 20) {
        // Find end of second sentence
        const secondEnd = firstParagraph.search(new RegExp(`[^]{${sentenceEnd + 1}}[.!?]`));
        if (secondEnd > sentenceEnd && secondEnd < 350) {
            clean = firstParagraph.substring(0, secondEnd + 1).trim();
        } else {
            clean = firstParagraph.substring(0, sentenceEnd + 1).trim();
        }
    } else {
        clean = firstParagraph;
    }

    // Clean up excessive bold markdown
    clean = clean.replace(/\*\*(.*?)\*\*/g, '$1');

    // Hard cap at 300 chars as final safety net
    if (clean.length > 320) {
        const cutAt = clean.lastIndexOf(' ', 317);
        clean = clean.substring(0, cutAt > 200 ? cutAt : 317) + '…';
    }

    return clean;
};

export const chatWithCoach = async (userMessage, history = []) => {

    const rawKey = import.meta.env.VITE_GEMINI_API_KEY;
    const apiKey = rawKey ? rawKey.trim() : null;

    if (!apiKey) throw new Error("Llave API no detectada en Vercel.");
    if (!apiKey.startsWith("AIza")) throw new Error("Llave API inválida (debe empezar por AIza).");

    const activeGenAI = new GoogleGenerativeAI(apiKey);

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

    // Try all known variants - gemini-3-flash confirmed active in AI Studio!
    const modelOptions = [
        "gemini-3-flash-preview",
        "gemini-3.0-flash-preview",
        "gemini-2.5-flash-preview",
        "gemini-2.0-flash",
        "gemini-2.0-flash-lite",
        "gemini-2.0-flash-exp",
        "gemini-1.5-flash",
    ];

    let diagDetails = "";

    for (const modelId of modelOptions) {
        try {
            console.log(`SDK → ${modelId}...`);
            const model = activeGenAI.getGenerativeModel({ model: modelId });
            const chat = model.startChat({
                history: chatHistory,
                generationConfig: { maxOutputTokens: 200, temperature: 0.7 }
            });
            const result = await chat.sendMessage(userMessage);
            const fullText = result.response.text();
            return truncateResponse(fullText);

        } catch (error) {
            const msg = error.message || "";
            console.warn(`SDK falló (${modelId}): ${msg.substring(0, 80)}`);
            diagDetails += `[SDK-${modelId}: ${msg.substring(0, 40)}] `;
            // Only skip to next model if it's a retriable error
            const isRetriable = msg.includes("404") || msg.includes("quota") ||
                msg.includes("not found") || msg.includes("RESOURCE_EXHAUSTED");
            if (!isRetriable) break;
        }
    }

    // REST Bridge v5.7
    console.log("REST Bridge v5.7...");
    const restConfigs = [
        { v: "v1beta", m: "gemini-2.0-flash" },
        { v: "v1beta", m: "gemini-2.0-flash-lite" },
        { v: "v1beta", m: "gemini-2.0-flash-exp" },
        { v: "v1beta", m: "gemini-1.5-flash" },
        { v: "v1", m: "gemini-2.0-flash" },
        { v: "v1", m: "gemini-2.0-flash-lite" },
    ];

    for (const { v, m } of restConfigs) {
        try {
            const url = `https://generativelanguage.googleapis.com/${v}/models/${m}:generateContent?key=${apiKey}`;
            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: SYSTEM_PROMPT + "\n\nUser: " + userMessage }] }]
                })
            });
            const data = await res.json();
            if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
                return data.candidates[0].content.parts[0].text;
            }
            if (data.error) {
                diagDetails += `[REST-${m}: ${data.error.message.substring(0, 50)}] `;
            }
        } catch (e) {
            diagDetails += `[REST-${m}: network] `;
        }
    }

    // Classify error for user-friendly message
    const isQuota = diagDetails.toLowerCase().includes("quota") || diagDetails.toLowerCase().includes("exhausted");
    const isNotFound = diagDetails.toLowerCase().includes("not found");

    if (isQuota) {
        throw new Error(`CUOTA AGOTADA: La cuenta tiene cuota insuficiente. Diagnóstico: ${diagDetails}. Solución: Ve a https://console.cloud.google.com/ → APIs → Gemini API → verifica que esté HABILITADA y que el proyecto ${diagDetails.match(/project[s/: ]*(\d+)/)?.[1] || "nuevo"} no tenga restricciones.`);
    }
    if (isNotFound) {
        throw new Error(`MODELOS NO DISPONIBLES: ${diagDetails}. El proyecto de Google Cloud puede necesitar activar la Gemini API manualmente en: console.cloud.google.com`);
    }
    throw new Error(`Error de conexión. Detalles: ${diagDetails}`);
};
