const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

export const generateCampaign = async (prompt, history = []) => {
    if (!API_KEY) {
        throw new Error("VITE_OPENAI_API_KEY no encontrada en .env");
    }

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-4o",
                messages: [
                    { role: "system", content: "Eres el Director Creativo Senior de Coppel Emprende. Responde SIEMPRE en este formato: TITULO: ..., COPY_REDES: ..., PROMPT_VISUAL_DETALLADO: ..." },
                    ...history.slice(-3).map(m => ({ role: m.role === 'user' ? 'user' : 'assistant', content: m.content })),
                    { role: "user", content: prompt }
                ],
                temperature: 0.7
            })
        });

        const data = await response.json();
        if (data.error) throw new Error(data.error.message);
        return data.choices[0].message.content;
    } catch (error) {
        console.error("OpenAI Error:", error);
        throw error;
    }
};
