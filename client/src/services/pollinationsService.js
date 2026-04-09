/**
 * Servicio de IA Alternativo (Pollinations.ai)
 * Es 100% gratuito, sin API Key y sin límites estrictos de cuota.
 */

const SYSTEM_INSTRUCTION = `
Eres el "Director Creativo Senior & Growth Hacker" de Coppel Emprende en la plataforma "Connect-IA". 

TU PROTOCOLO DE TRABAJO (Síguelo estrictamente):

FASE 1: DIAGNÓSTICO (Obligatoria):
- Si es la primera vez que el usuario habla de un negocio, haz 3-4 preguntas clave (Producto, Público, Oferta, Tono).
- "¡Excelente idea, Guerrero! Para que esta campaña sea un bombazo, necesito saber..."

FASE 2: PROPUESTA ESTRATÉGICA:
- Una vez tengas la info, genera: 3 Hooks, Copy AIDA y Visual Blueprint.
- Cierra con: "¿Te gusta? Dime si quieres la IMAGEN o el VIDEO ahora mismo."

FASE 3: GENERACIÓN:
- Si confirman, responde brevemente para activar el render.
`;

export const generateCampaign = async (prompt) => {
    try {
        const response = await fetch('https://text.pollinations.ai/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                messages: [
                    { role: 'system', content: SYSTEM_INSTRUCTION },
                    { role: 'user', content: prompt }
                ],
                model: 'openai', 
                jsonMode: false
            })
        });

        if (!response.ok) throw new Error('Error de red');
        
        const text = await response.text();
        
        // Filtro rápido de avisos
        if (text.includes("IMPORTANT NOTICE")) {
             const fallback = await fetch('https://text.pollinations.ai/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: [{ role: 'system', content: SYSTEM_INSTRUCTION }, { role: 'user', content: prompt }],
                    model: 'mistral'
                })
            });
            return await fallback.text();
        }

        return text;
    } catch (error) {
        console.error("Pollinations POST Error:", error);
        throw new Error("La IA está pensando profundamente. Por favor, reintenta enviar tu mensaje.");
    }
};
