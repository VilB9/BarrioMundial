import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  fetchEconomy, 
  deductUsage, 
  deductVisualUsage, 
  deductRegenerateUsage,
  redeemInvitationCode,
  godModeRefill
} from '../services/economyService';
import { generateCampaign } from '../services/geminiService';
import { generateVisual } from '../services/visualService';
import { 
  Bot, 
  Key, 
  Coins, 
  Mic, 
  Send, 
  RefreshCw, 
  AlertTriangle, 
  ImageIcon, 
  Download, 
  CheckCircle, 
  RotateCcw,
  ArrowLeft,
  Share2,
  Zap,
  Gift,
  Award,
  Video,
  Play,
  FileText
} from 'lucide-react';
import { downloadMarketingKit } from '../utils/downloadHelper';

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

// ── Imagen de mejor calidad segun categoria detectada (Fallback) ──────────────
function getContextualImage(context) {
  const c = context.toLowerCase();
  if (c.includes('taco') || c.includes('bistec') || c.includes('pastor') || c.includes('comida')) return 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&q=90&w=1200';
  if (c.includes('hambur') || c.includes('burger')) return 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=90&w=1200';
  if (c.includes('pizza')) return 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=90&w=1200';
  if (c.includes('joya') || c.includes('oro') || c.includes('plata')) return 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=90&w=1200';
  if (c.includes('ropa') || c.includes('playera') || c.includes('fashion')) return 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&q=90&w=1200';
  if (c.includes('caf[eé]') || c.includes('postre')) return 'https://images.unsplash.com/photo-1509042223450-4860df8903ec?auto=format&fit=crop&q=90&w=1200';
  return 'https://images.unsplash.com/photo-1600880210819-3506c74bc933?auto=format&fit=crop&q=90&w=1200'; // Modern business/artisan context
}

function parseAIResponse(text) {
  const hasStructure = /TITULO:|TÍTULO:/i.test(text);
  if (!hasStructure) return { raw: text };

  const titulo = text.split(/TITULO:|TÍTULO:/i)[1]?.split(/COPY_REDES:|COPY:/i)[0]?.trim() || '';
  const copy = text.split(/COPY_REDES:|COPY:/i)[1]?.split(/PROMPT_VISUAL_DETALLADO:|PROMPT_VISUAL:|PROMPT DE IMAGEN:/i)[0]?.trim() || '';
  const prompt = text.split(/PROMPT_VISUAL_DETALLADO:|PROMPT_VISUAL:|PROMPT DE IMAGEN:/i)[1]?.trim() || '';

  return { titulo, copy, prompt };
}

const WELCOME_MESSAGE = {
  role: 'system',
  content: '¡Hola! Soy **Coppelito** 🚀 tu Director de Arte de Coppel Emprende.\n\nPara crear tu campaña de marketing personalizada necesito 5 datos:\n\n1. ¿Cómo se llama tu negocio?\n2. ¿Qué vendes?\n3. ¿Quién es tu cliente?\n4. ¿Cuál es tu oferta de hoy?\n5. ¿Qué tono prefieres?\n\n¡Estoy listo para activar el motor **Nano Banana 2**! 🎨',
};

const ChatbotCoppelito = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingVisual, setIsGeneratingVisual] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [economy, setEconomy] = useState({ coins_balance: 99, keys_balance: 5, daily_uses: 3 });
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchEconomy().then(setEconomy).catch(() => {});
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isGenerating, isGeneratingVisual]);

  const handleSend = async () => {
    if (!input.trim() || isGenerating) return;
    const userText = input.trim();
    setInput('');
    setErrorMessage(null);

    // Detección de aprobación tipo "Nano Banana 2: Sí"
    const isApproval = /^(s[iíI]|yes|ok|dale|adelante|gen[eé]ra|hazlo|va|listo|perfect)[\.\!]*$/i.test(userText);

    if (isApproval) {
      let lastCampaignIdx = -1;
      for (let i = messages.length - 1; i >= 0; i--) {
        if (messages[i].role === 'system' && /TITULO:/i.test(messages[i].content) && !messages[i].visual) {
          lastCampaignIdx = i;
          break;
        }
      }
      if (lastCampaignIdx !== -1) {
        handleGenerateImage(lastCampaignIdx, messages[lastCampaignIdx].content);
        return;
      }
    }

    const userMsg = { role: 'user', content: userText };
    setMessages(prev => [...prev, userMsg]);
    setIsGenerating(true);

    try {
      const newEconomy = await deductUsage(economy);
      setEconomy(newEconomy);

      const aiText = await generateCampaign(userText, [...messages, userMsg]);
      setMessages(prev => [...prev, { role: 'system', content: aiText }]);
    } catch (err) {
      setErrorMessage(err.message || 'Error en Gemini. Intentando respaldo...');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateImage = async (msgIdx, aiContent, isRegenerate = false) => {
    setIsGeneratingVisual(true);
    const tempId = Date.now();
    
    const botResponse = {
      id: tempId,
      role: 'system',
      content: `Ok. Activando motor Nano Banana 2... Generando arte comercial (85mm, f/1.8, comercial, iluminación de estudio profesional).`,
      isVisualGenerating: true 
    };
    
    setMessages(prev => [...prev, botResponse]);

    // Pequeña pausa para efecto de "activación"
    await new Promise(r => setTimeout(r, 600));

    // Consolidar contexto ANTES del try
    const fullContext = messages.map(m => m.content).join(' ') + ' ' + aiContent;

    try {
      const newEc = isRegenerate ? await deductRegenerateUsage(economy) : await deductVisualUsage(economy);
      setEconomy(newEc);

        const visualPrompt = aiContent.split(/PROMPT_VISUAL_DETALLADO:|PROMPT_VISUAL:|PROMPT DE IMAGEN:/i)[1]?.trim() || '';

        if (fullContext.includes('hambur') || fullContext.includes('burger')) {
          productCore = 'a juicy gourmet hamburger with melted cheese, fresh charcoal-grilled meat, lettuce and tomato, steam rising, on a wooden board';
          categoryModifier = 'Professional food photography, macro shot, vibrant appetizing colors. ';
        } else if (fullContext.includes('taco') || fullContext.includes('bistec') || fullContext.includes('pastor')) {
          productCore = 'authentic Mexican street tacos with fresh cilantro, diced onion, lime wedges and red spicy salsa on a rustic plate';
          categoryModifier = 'Vibrant street food photography, warm cinematic lighting, authentic Mexican texture. ';
        } else if (fullContext.includes('pizza')) {
          productCore = 'extra large pizza with melted mozzarella cheese pull and pepperoni, Italian style in stone oven';
          categoryModifier = 'Food commercial photography, sharp focus. ';
        } else if (fullContext.includes('joya') || fullContext.includes('plata') || fullContext.includes('oro')) {
          productCore = 'premium high-end jewelry, gold and silver artisan design, brilliant gemstone';
          categoryModifier = 'Luxury jewelry macro photography, dark silk background, brilliant sparkles. ';
        } else if (fullContext.includes('ropa') || fullContext.includes('moda') || fullContext.includes('playera')) {
          productCore = 'high-end clothing collection styled on a minimal set';
          categoryModifier = 'Professional fashion photography, high contrast lighting. ';
        }

        const finalPrompt = `${categoryModifier}Subject: ${productCore}. Professional advertising style, sharp focus, creamy bokeh, 8k photorealistic. Authentic atmosphere. NO text in image.`;

        const url = await generateVisual(finalPrompt, 'image');
        const cacheBustedUrl = `${url}&t=${Date.now()}`;

        setMessages(prev => prev.map(m => 
            m.id === tempId ? { 
                ...m, 
                visual: cacheBustedUrl, 
                campaign: parseAIResponse(aiContent),
                isVisualGenerating: false,
                content: `Ok. ¡Arte generado! 🎨\n\nEste es el resultado con motor Nano Banana 2 (85mm, f/1.8, comercial).`
            } : m
        ));
    } catch (err) {
        const fallbackUrl = getContextualImage(fullContext);
        setMessages(prev => prev.map(m => 
            m.id === tempId ? { 
                ...m, 
                visual: `${fallbackUrl}?t=${Date.now()}`,
                isVisualGenerating: false 
            } : m
        ));
    } finally {
        setIsGeneratingVisual(false);
    }
  };


  const handleDownload = (msg) => {
    downloadFile(msg.visual, `Publicidad_BarrioMundial.png`);
  };

  return (
    <div className="flex flex-col h-screen bg-[#F2F1EC] font-sans p-2 md:p-4 overflow-hidden">
      {/* MOBILE FRAME - Estilo Barrio Mundial */}
      <div className="flex-1 max-w-md mx-auto w-full bg-white rounded-[3rem] border-[12px] border-[#101A3F] shadow-2xl relative overflow-hidden flex flex-col">
        
        {/* HEADER INSTITUCIONAL */}
        <header className="bg-[#0056b3] text-white px-6 py-5 flex justify-between items-center shrink-0 z-20 shadow-lg border-b-2 border-[#f7e300]/30">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <Bot className="w-8 h-8 text-[#f7e300]" />
            <div>
              <h1 className="text-base font-black leading-none uppercase tracking-tighter italic">Coppelito</h1>
              <span className="text-[10px] text-[#f7e300] font-bold tracking-widest uppercase">Nano Banana 2.1</span>
            </div>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => {
                const dummyCode = `COPPEL-${Math.random().toString(36).substring(7).toUpperCase()}`;
                navigator.clipboard.writeText(`¡Genera publicidad gratis con Coppelito! Usa mi código: ${dummyCode}`);
                alert('¡Link de invitación copiado! Compártelo para ganar 10 monedas.');
              }}
              className="p-2 bg-[#f7e300] text-[#0056b3] rounded-full hover:scale-110 active:scale-90 transition-all shadow-md group relative"
            >
              <Gift className="w-4 h-4" />
              <span className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border border-white"></span>
            </button>
            <div 
              onClick={async () => {
                const refreshed = await godModeRefill();
                setEconomy(refreshed);
              }}
              className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full border border-white/20 cursor-pointer hover:bg-white/20 transition-all active:scale-95"
            >
              <Coins className="w-4 h-4 text-[#f7e300]" />
              <span className="text-xs font-black">{economy.coins_balance}</span>
            </div>
          </div>
        </header>

        {/* CHAT AREA */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-5 bg-white">
          <AnimatePresence>
            {errorMessage && (
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border-l-4 border-red-500 p-3 rounded-lg flex items-center gap-3 text-xs text-red-700"
              >
                <AlertTriangle className="w-4 h-4 shrink-0" />
                {errorMessage}
              </motion.div>
            )}

            {messages.map((msg, idx) => {
              const isUser = msg.role === 'user';
              const parsed = isUser ? null : parseAIResponse(msg.content);

              return (
                <motion.div 
                  initial={{ opacity: 0, x: isUser ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={idx} 
                  className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] rounded-[2rem] shadow-md overflow-hidden ${isUser ? 'bg-[#0056b3] text-white rounded-tr-sm' : 'bg-gray-50 border border-gray-100 rounded-tl-sm'}`}>
                    
                    <div className="p-4">
                      {isUser ? (
                        <p className="text-sm font-bold leading-relaxed">{msg.content}</p>
                      ) : (
                        <div className="flex flex-col gap-3">
                          {!isUser && (
                            <div className="flex items-center gap-2 mb-1">
                                <Bot className="w-4 h-4 text-[#1C36C6]" />
                                <span className="text-[10px] font-black text-[#1C36C6] uppercase tracking-widest">Director de Arte</span>
                            </div>
                          )}
                          {parsed.titulo && (
                            <div className="bg-[#1C36C6]/5 border-l-4 border-[#1C36C6] p-3 rounded-r-xl">
                              <p className="font-black text-sm text-gray-900 leading-tight italic">"{parsed.titulo}"</p>
                            </div>
                          )}
                          <p className={`text-sm ${parsed.titulo ? 'text-gray-600' : 'text-gray-800 font-medium'}`}>
                            {parsed.copy || parsed.raw}
                          </p>

                          {!msg.visual && !isGeneratingVisual && !isGenerating && parsed.titulo && (
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => handleGenerateImage(idx, msg.content)}
                              className="mt-3 w-full bg-[#f7e300] text-[#131E44] font-black py-4 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-lg border-b-4 border-black/10 transition-all group"
                            >
                              <ImageIcon className="w-5 h-5 group-hover:rotate-12" />
                              CREAR ARTE CON NANO BANANA 2
                            </motion.button>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Loader Visual */}
                    {msg.isVisualGenerating && (
                      <div className="p-8 flex flex-col items-center justify-center gap-3 bg-gray-50 border-t border-gray-100">
                         <div className="w-8 h-8 border-4 border-[#0056b3] border-t-transparent rounded-full animate-spin"></div>
                         <p className="text-[10px] font-bold text-[#0056b3] animate-pulse">RENDERIZANDO ARTE 85mm...</p>
                      </div>
                    )}

                    {msg.visual && (
                      <div className="border-t border-gray-100 relative bg-gray-200">
                        <img 
                          src={msg.visual} 
                          alt="AI Art" 
                          className="w-full h-auto object-cover min-h-[200px]" 
                          onError={e => {
                            e.target.src = getContextualImage(msg.content);
                          }}
                        />
                        <div className="absolute top-3 right-3 bg-[#f7e300] text-[#0056b3] px-3 py-1.5 rounded-full text-[9px] font-black flex items-center gap-1.5 shadow-2xl border border-[#0056b3]/20 animate-bounce cursor-default select-none z-30">
                          <CheckCircle className="w-3 h-3" />
                          VERIFICADO POR COPPEL EMPRENDE
                        </div>
                         <div className="p-3">
                               <button 
                                   onClick={() => handleDownload(msg)}
                                   className="w-full bg-[#0056b3] text-white text-xs font-black py-4 rounded-xl flex items-center justify-center gap-2 shadow-xl hover:scale-[1.02] active:scale-95 transition-all border-b-4 border-black/20"
                               >
                                   <Download className="w-4 h-4 text-[#f7e300]" />
                                   DESCARGAR IMAGEN PUBLICITARIA
                               </button>

                           <button 
                               onClick={() => handleGenerateImage(idx, msg.content, true)}
                               disabled={isGeneratingVisual}
                               className="mt-2 w-full p-3 bg-gray-50 border border-gray-100 rounded-xl hover:bg-gray-200 transition-all flex items-center justify-center gap-2 text-[10px] font-bold text-gray-400"
                           >
                               <RotateCcw className={`w-3 h-3 ${isGeneratingVisual ? 'animate-spin' : ''}`} />
                               REGENERAR ARTE
                           </button>
                         </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {(isGenerating || isGeneratingVisual) && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex justify-start"
            >
              <div className="bg-white px-4 py-3 rounded-2xl shadow-md border border-gray-100 flex flex-col gap-2 min-w-[200px]">
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-[#1C36C6] animate-spin" />
                  <span className="text-[11px] text-gray-400 font-black uppercase tracking-widest">{isGeneratingVisual ? 'Renderizando...' : 'Analizando...'}</span>
                </div>
                {isGeneratingVisual && (
                    <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: '100%' }}
                            transition={{ duration: 2.5 }}
                            className="h-full bg-[#f7e300]"
                        />
                    </div>
                )}
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* INPUT AREA */}
        <footer className="bg-white border-t border-gray-100 p-5 shrink-0 z-20">
          <div className="flex items-center gap-3 bg-gray-50 rounded-[2rem] px-4 py-2 border-2 border-transparent focus-within:border-[#1C36C6] focus-within:bg-white transition-all shadow-inner">
            <button 
                className={`p-2 transition-all ${isRecording ? 'text-red-500' : 'text-gray-400 hover:text-[#1C36C6]'}`}
                onClick={() => setIsRecording(!isRecording)}
            >
              <Mic className={`w-5 h-5 ${isRecording ? 'animate-pulse' : ''}`} />
            </button>
            <input 
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder={isRecording ? '🎙 Escuchando...' : "Habla con Coppelito..."}
              className="flex-1 bg-transparent py-3 text-sm font-bold outline-none placeholder:text-gray-300"
            />
            <button 
              onClick={handleSend}
              disabled={!input.trim() || isGenerating}
              className="p-3 bg-[#1C36C6] text-[#f7e300] rounded-2xl disabled:opacity-30 active:scale-90 transition-all shadow-lg"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </footer>

      </div>
    </div>
  );
};

export default ChatbotCoppelito;
