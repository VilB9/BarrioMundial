/**
 * Servico para generar visuales (Imágenes y simulaciones de Video)
 */

export const generateVisual = async (prompt) => {
    // Para imágenes usamos Pollinations.ai (gratis y rápido para demos)
    const seed = Math.floor(Math.random() * 100000);
    // Limpiamos el prompt para URL
    const encodedPrompt = encodeURIComponent(prompt.substring(0, 500));
    // Simplificamos URL para evitar errores de autenticación o internos
    return `https://image.pollinations.ai/prompt/${encodedPrompt}?seed=${seed}&nologo=true`;
};
