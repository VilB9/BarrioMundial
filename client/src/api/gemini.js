import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = "AIzaSyBlKdxDC5RIM3gVmmge5mUBmG4KBwAfQQQ";
const genAI = new GoogleGenerativeAI(apiKey);

export async function getAIRecommendations(userProfile, userLocation, stands) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" }); // Fast and cheap for this

    const prompt = `
Eres la IA de recomendación premium de 'Coppel Connect'.
Tengo un usuario con el rol: ${userProfile.role}.
Está ubicado actualmente en estas coordenadas GPS: [${userLocation.join(', ')}].

Estas son las opciones de stands en el Mundial:
${JSON.stringify(stands, null, 2)}

Tu objetivo es puntuar cada stand indicando qué porcentaje de compatibilidad tiene con este usuario (del 0 al 100).
Si el stand está relacionado al perfil del usuario, deberías dar un puntaje alto (mayor a 94).
También justifícalo con una frase corta e impactante ("Hizo match porque...").

DEBES devolver ESTRICTAMENTE un Array en formato JSON válido. 
Cada objeto debe tener esta estructura exacta:
[
  { 
    "id": "el_id_del_stand_exacto", 
    "score": 98, 
    "reason": "Frase de justificación estilo cyberpunk/IA" 
  }
]

¡No devuelvas NADA más que el arreglo en formato JSON! Ni siquiera markdown (\`\`\`json). Devuelve solo el string puro parsable con JSON.parse().
`;

    const result = await model.generateContent(prompt);
    let text = result.response.text();
    // Limpieza de formato markdown si lo envía
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();

    const parsedData = JSON.parse(text);
    return parsedData;

  } catch (error) {
    console.error("Error en Gemini API:", error);
    // Fallback if AI fails
    return stands.map(s => ({ id: s.id, score: Math.floor(Math.random() * 30 + 60), reason: "Error satelital." }));
  }
}
