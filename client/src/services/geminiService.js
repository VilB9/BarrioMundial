/**
 * geminiService.js
 * Motor de IA Principal - Coppelito (Coppel Emprende)
 * Director de Arte Senior + Estratega de Marketing
 */

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const SYSTEM_PROMPT = `Eres el "Director de Arte Senior y Estratega de Marketing" de Coppel Emprende.
Tu misión: Tomar la información del negocio del locatario y generar campañas publicitarias de revista de alto nivel.

FLUJO DE TRABAJO:

FASE 1 - DIAGNÓSTICO (solo si no tienes suficiente info del negocio):
Haz exactamente 5 preguntas cortas y motivadoras:
1. ¿Cómo se llama tu negocio?
2. ¿Qué vendes? (describe tu producto estrella)
3. ¿Quién es tu cliente ideal?
4. ¿Cuál es tu oferta bomba de hoy?
5. ¿Tono preferido? (Divertido / Elegante / Pro)

FASE 2 - CAMPAÑA (cuando ya tengas los datos del negocio):
Genera la campaña en este formato EXACTO:

TITULO: [Título poderoso con el nombre REAL del negocio]
COPY_REDES: [Copy persuasivo AIDA con emojis, máx 4 líneas, hashtags al final]
PROMPT_VISUAL_DETALLADO: [Descripción técnica fotográfica ESPECÍFICA del producto real del usuario. Describe exactamente cómo se ve el producto: colores, texturas, presentación. Usa términos técnicos de fotografía: 85mm, f/1.8, comercial, iluminación de estudio profesional.]

Después del bloque anterior, SIEMPRE agrega esta pregunta de confirmación:
"¿Te gusta esta propuesta? ✅ Responde **sí** para que Nano Banana 2 genere tu arte visual, o dime qué ajustar."

REGLAS:
- NUNCA uses el nombre "Tu Negocio" o "Tu Local". Usa el nombre REAL que te dijo el usuario.
- NUNCA menciones ejemplos específicos como "tacos" a menos que sea el producto REAL del usuario.
- El PROMPT_VISUAL debe ser ultra-específico al producto real.
- Sé entusiasta, eres su aliado comercial.`;

// ── Llamada a Gemini con failover ────────────────────────────────────────────
export const generateCampaign = async (userMessage, history = []) => {
  const models = ['gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-1.5-flash-8b'];

  // Construir historial para contexto (últimos 6 mensajes)
  const chatHistory = history.slice(-6).map(msg => ({
    role: msg.role === 'user' ? 'user' : 'model',
    parts: [{ text: msg.content }],
  }));

  for (const model of models) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${API_KEY}`;

      const body = {
        system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: [
          ...chatHistory,
          { role: 'user', parts: [{ text: userMessage }] },
        ],
        generationConfig: {
          temperature: 0.9,
          maxOutputTokens: 1024,
        },
      };

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        const data = await res.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) return text;
      }

      console.warn(`[Coppelito] ${model} falló (${res.status}), intentando siguiente...`);
    } catch (err) {
      console.error(`[Coppelito] Error con ${model}:`, err.message);
    }
  }

  // ── Fallback inteligente: extraer datos reales del usuario ───────────────
  const fullContext = [userMessage, ...history.map(m => m.content)].join('\n');

  let businessName = '';
  let product = '';

  const inlineNameMatch = fullContext.match(/\*[^*]*(?:llama|nombre|local|negocio)[^*]*\*\??\.?\s*([A-Za-z0-9áéíóúüñÁÉÍÓÚÜÑ][^.\n*]{1,30}?)(?:\s*\d|\.|\*|$)/i);
  const inlineProductMatch = fullContext.match(/\*[^*]*(?:vend[eé]|producto|ofr)[^*]*\*\??\.?\s*([A-Za-z0-9áéíóúüñÁÉÍÓÚÜÑ][^.\n*0-9]{2,40}?)(?:\s*\d|\*|$)/i);

  if (inlineNameMatch?.[1]) businessName = inlineNameMatch[1].replace(/[*.]/g, '').trim();
  if (inlineProductMatch?.[1]) product = inlineProductMatch[1].replace(/[*.]/g, '').trim();

  if (!businessName) {
    const namePatterns = [
      /(?:me llamo|llamo|se llama|soy|somos)\s+([A-Za-z0-9áéíóúüñ][^.,\n?!*\d]{1,28})/i,
      /(?:^|\n)\s*1[.):\s]+([A-Za-z0-9áéíóúüñ][^.,\n?!*2-9]{1,28})/im,
    ];
    for (const p of namePatterns) {
      const m = fullContext.match(p);
      const c = m?.[1]?.replace(/[*.]/g, '').trim();
      if (c && c.length > 1) { businessName = c; break; }
    }
  }

  if (!product) {
    const productPatterns = [
      /(?:vend[eo]|vendemos|ofrezco)\s+([^.,\n?!*]{3,45})/i,
      /(?:^|\n)\s*2[.):\s]+([^.,\n?!*\d]{3,40})/im,
    ];
    for (const p of productPatterns) {
      const m = fullContext.match(p);
      const c = m?.[1]?.replace(/[*.]/g, '').trim();
      if (c && c.length > 2) { product = c; break; }
    }
  }

  if (!businessName) businessName = 'tu negocio';
  if (!product) product = 'tus productos';

  let visualStyle = `${product} presented beautifully`;
  const lp = product.toLowerCase();
  if (lp.includes('hambur') || lp.includes('burger')) {
    visualStyle = 'a juicy gourmet hamburger with melted cheese, fresh lettuce, tomato and secret sauce, steam rising, on a wooden board';
  } else if (lp.includes('pizza')) {
    visualStyle = 'a hot gourmet pizza slice with melted mozzarella cheese pull, fresh basil and crispy crust';
  } else if (lp.includes('joya') || lp.includes('plata') || lp.includes('aretes')) {
    visualStyle = `handcrafted ${product} in sterling silver with beautiful artisan details, on dark velvet`;
  } else if (lp.includes('ropa') || lp.includes('playera') || lp.includes('tenis')) {
    visualStyle = `${product} styled beautifully on a clean white background with dramatic lighting`;
  }

  return `TITULO: 🚀 ¡${businessName} tiene lo mejor para ti!
COPY_REDES: En ${businessName} encuentras ${product} de la más alta calidad. ¡Esta oferta no dura para siempre! Ven hoy y sorpréndete 🔥 #CoppelEmprende #${businessName.replace(/\s+/g, '')} #CalidadGarantizada
PROMPT_VISUAL_DETALLADO: Professional high-end commercial photography, 85mm lens f/1.8, sharp focus on ${visualStyle}, creamy bokeh background, advertising studio lighting. Authentic Mexican atmosphere. Subtle 2026 World Cup elements in background. 8k photorealistic, vibrant natural colors, luxury commercial vibe, no text in image.

¿Te gusta esta propuesta? ✅ Responde **sí** para que Nano Banana 2 genere tu arte visual, o dime qué ajustar.`;
};
