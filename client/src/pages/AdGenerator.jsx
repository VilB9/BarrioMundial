import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles, Send, Copy, CheckCircle2, Megaphone } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdGenerator() {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedAd, setGeneratedAd] = useState('');
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    if (!prompt.trim()) return;
    
    setIsLoading(true);
    setGeneratedAd('');
    
    // Simulating Gemini API Call
    setTimeout(() => {
      setGeneratedAd(`¡Hey Talentos! 🚀 ¿Caminando mucho por la Genius Arena? Haz una parada técnica en **${prompt}**.\n\nMuestra este post y obtén un 15% de descuento enseñando que vienes del Hackathon Coppel. \n\n📍 Búscanos en el mapa de Barrio Mundial.\n#CoppelConnect #Hackathon2026 #TalentLand`);
      setIsLoading(false);
      setPrompt('');
    }, 2000);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedAd);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col h-screen">
      
      {/* Header Locatario */}
      <div className="bg-[#1C1F2E] text-white pt-12 pb-6 px-6 shrink-0 relative shadow-md">
        <div className="flex items-center justify-between mb-4">
          <button 
            onClick={() => navigate('/dashboard')}
            className="flex items-center text-sm font-bold opacity-90 hover:opacity-100 transition-opacity"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Panel Locatario
          </button>
          <div className="bg-[#f7e300] text-[#1C1F2E] p-1.5 rounded-lg shadow-sm">
             <Megaphone className="w-4 h-4" />
          </div>
        </div>
        <h1 className="text-2xl font-black mb-1 flex items-center gap-2">
          Ad Generator <Sparkles className="w-5 h-5 text-[#f7e300]" />
        </h1>
        <p className="text-gray-400 text-xs">Crea publicidad atractiva para tus redes sociales impulsada por IA, optimizada para atraer turistas del Mundial.</p>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto px-6 py-6 pb-32 flex flex-col gap-6">
        
        {/* Intro MSG */}
        <div className="bg-white border border-gray-200 rounded-3xl rounded-tl-sm p-4 w-4/5 shadow-sm">
          <p className="text-sm text-gray-700">¡Hola! Soy tu asistente de marketing Coppel AI. Dime sobre qué quieres hacer tu promoción hoy. Por ejemplo: <span className="font-bold">"Tacos de cochinita con 20% descuento"</span>.</p>
        </div>

        {/* Generated Ad Result */}
        {isLoading && (
          <div className="self-end w-4/5 bg-blue-50 border border-[#0056b3]/20 rounded-3xl rounded-tr-sm p-4 flex items-center justify-center">
             <Sparkles className="w-5 h-5 text-[#0056b3] animate-pulse" />
             <span className="ml-2 text-[#0056b3] font-bold text-sm">Generando copy mágico...</span>
          </div>
        )}

        {generatedAd && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="self-end w-11/12 bg-white rounded-3xl rounded-tr-sm p-5 shadow-md border-l-4 border-l-[#0056b3] relative"
          >
             <p className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">{generatedAd}</p>
             
             <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end">
                <button 
                  onClick={handleCopy}
                  className="flex items-center gap-2 text-[#0056b3] font-bold text-sm hover:underline"
                >
                  {copied ? (
                    <><CheckCircle2 className="w-4 h-4" /> ¡Copiado al portapapeles!</>
                  ) : (
                    <><Copy className="w-4 h-4" /> Copiar texto</>
                  )}
                </button>
             </div>
          </motion.div>
        )}

      </div>

      {/* Input Area flotante */}
      <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-gray-50 via-gray-50 to-transparent pt-12 pb-8 px-6">
         <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-2 flex items-center">
            <input 
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
              placeholder="¿Qué vendemos hoy?"
              className="flex-1 bg-transparent outline-none px-4 text-sm text-gray-800"
            />
            <button 
              onClick={handleGenerate}
              disabled={isLoading || !prompt.trim()}
              className="w-12 h-12 bg-[#0056b3] text-white rounded-2xl flex items-center justify-center disabled:opacity-50 transition-opacity shrink-0 shadow-sm hover:bg-blue-800"
            >
              <Send className="w-5 h-5 ml-1" />
            </button>
         </div>
      </div>

    </div>
  );
}
