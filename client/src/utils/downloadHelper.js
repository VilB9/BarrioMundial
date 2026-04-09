/**
 * Utilidad para descargar archivos (imágenes, videos, texto)
 */

export const downloadFile = async (url, fileName) => {
  try {
    // Si es una imagen (lo más común aquí), intentamos capturarla vía Canvas
    // para evitar redirecciones de API y problemas de CORS en el fetch
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = url;
    
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
    });

    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = fileName.endsWith('.png') ? fileName : `${fileName}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.warn('Canvas download failed, trying direct link:', error);
    // Fallback de último recurso: abrir en nueva pestaña
    window.open(url, '_blank');
    alert('👉 Haz clic derecho en la imagen y selecciona "Guardar imagen como..."');
  }
};

export const downloadTextFile = (content, fileName) => {
  const blob = new Blob([content], { type: 'text/plain' });
  const url = window.URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

export const downloadMarketingKit = async (campaign) => {
  const { titulo, visual } = campaign;
  const projectName = titulo.replace(/[^a-z0-9]/gi, '_').toLowerCase();

  // 1. Descargar Imagen
  if (visual) {
    await downloadFile(visual, `${projectName}_imagen.png`);
  }
};
