import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Star, Camera, ShieldCheck, Trophy, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ActivityComplete() {
  const navigate = useNavigate();
  const [rating, setRating] = useState(4);
  const [review, setReview] = useState('¡La taquería estuvo increíble! Los tacos de guisado con tortilla azul son únicos. Muy amables con los clientes internacionales.');
  const [showSuccess, setShowSuccess] = useState(false);

  const handlePublish = async () => {
    setShowSuccess(true);
    await new Promise(r => setTimeout(r, 2000));
    navigate('/agenda');
  };

  return (
    <div className="min-h-screen bg-[#F2F1EC] font-sans flex items-center justify-center py-6">
      
      {/* Marco del celular institucional */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-[390px] h-[800px] max-h-[90vh] bg-white rounded-[3rem] shadow-2xl shadow-indigo-900/20 overflow-hidden flex flex-col border-[12px] border-[#101A3F] relative"
      >
        
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-6 bg-[#101A3F] rounded-b-3xl z-50"></div>

        {/* CONTENIDO INTERNO */}
        <div className="flex-1 w-full bg-[#F8FAFC] relative overflow-y-auto no-scrollbar pb-10 flex flex-col pt-10">
          
          {/* Header Superior Blanco Institucional */}
          <div className="w-full bg-white px-6 py-5 shrink-0 flex items-center justify-between shadow-sm relative z-10 border-b border-zinc-50">
            <button 
              onClick={() => navigate('/agenda')}
              className="flex items-center text-[#1C36C6] text-sm font-black tracking-tight hover:opacity-80 transition-opacity"
            >
              <ArrowLeft className="w-4 h-4 mr-2" strokeWidth={3} />
              Review de Actividad
            </button>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center text-[#1C36C6] border border-indigo-100">
               <User className="w-5 h-5" strokeWidth={2.5} />
            </div>
          </div>

          <div className="px-6 py-6 flex flex-col gap-5">
            
            {/* Banner de Establecimiento */}
            <motion.div 
               initial={{ y: 20, opacity: 0 }}
               animate={{ y: 0, opacity: 1 }}
               className="w-full bg-[#FFD100] rounded-[2.5rem] p-6 flex flex-col items-center text-center shadow-lg shadow-yellow-900/10 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-full bg-white/10 pointer-events-none"></div>
              
              <div className="w-20 h-20 bg-white rounded-[2rem] shadow-lg flex items-center justify-center text-4xl mb-4 relative z-10">
                 🌮
              </div>
              <h2 className="text-[#101A3F] font-black text-xl leading-tight mb-3 relative z-10">
                 Taquería El Barrio
              </h2>
              <div className="bg-[#1C36C6] text-white text-[9px] font-black px-4 py-1.5 rounded-full flex items-center gap-2 shadow-md uppercase tracking-[0.1em] relative z-10">
                 <ShieldCheck className="w-3.5 h-3.5" />
                 Sello Ola México 2026
              </div>
            </motion.div>

            {/* Sistema de Calificación (Rating) */}
            <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-zinc-100 flex flex-col items-center">
              <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-4">Califica tu experiencia</p>
              <div className="flex gap-2.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button 
                    key={star} 
                    onClick={() => setRating(star)}
                    className={`transition-all hover:scale-110 active:scale-90 ${star <= rating ? 'text-[#FFD100]' : 'text-zinc-100'}`}
                  >
                    <Star className="w-9 h-9" fill="currentColor" strokeWidth={1.5} stroke="currentColor" />
                  </button>
                ))}
              </div>
            </div>

            {/* Input de reseña */}
            <div className="bg-white rounded-[2rem] p-5 shadow-sm border border-zinc-100 flex flex-col">
               <textarea 
                 value={review}
                 onChange={(e) => setReview(e.target.value)}
                 className="w-full text-sm text-[#101A3F] font-medium resize-none outline-none min-h-[90px] placeholder:text-zinc-300"
                 placeholder="Escribe tu reseña aquí..."
               />
            </div>

            {/* Subir foto */}
            <button className="bg-white border-2 border-dashed border-zinc-200 rounded-[2rem] p-6 flex flex-col items-center justify-center text-center text-zinc-400 hover:border-[#1C36C6] hover:bg-indigo-50/30 transition-all group">
               <div className="w-14 h-14 bg-zinc-50 rounded-2xl flex items-center justify-center mb-3 group-hover:bg-[#1C36C6] group-hover:text-white transition-all shadow-sm">
                  <Camera className="w-6 h-6" />
               </div>
               <span className="font-black text-sm text-[#101A3F] mb-1">Galería de fotos</span>
               <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Ayuda a otros turistas</span>
            </button>

            {/* Banner de Semillas (Gamificación) */}
            <div className="bg-[#1C36C6] rounded-[2rem] p-5 shadow-lg text-white flex items-center gap-4 relative overflow-hidden mt-2">
               <div className="absolute right-[-10px] top-[-20px] opacity-10">
                 <Trophy className="w-32 h-32" />
               </div>
               <div className="w-14 h-14 bg-[#FFD100] rounded-2xl flex items-center justify-center text-[#1C36C6] shrink-0 shadow-inner">
                 <Trophy className="w-7 h-7" fill="currentColor" />
               </div>
               <div>
                  <p className="text-xs font-black text-[#FFD100] uppercase tracking-widest mb-1">Recompensa</p>
                  <p className="text-[13px] font-bold leading-tight">
                    ¡Gana <span className="text-[#FFD100] font-black">35 Semillas</span> al publicar! Esto desbloquea beneficios exclusivos.
                  </p>
               </div>
            </div>

            {/* Botones Finales */}
            <div className="flex flex-col gap-3 mt-4">
               <button 
                  onClick={handlePublish}
                  className="w-full bg-[#1C36C6] text-white py-4.5 rounded-[1.25rem] font-black text-sm transition-all active:scale-95 shadow-xl shadow-indigo-900/20"
               >
                 Publicar Review +35 🌱
               </button>
               
               <button 
                  onClick={() => navigate('/agenda')}
                  className="w-full bg-white border-2 border-zinc-100 text-zinc-400 hover:text-[#101A3F] py-3.5 rounded-[1.25rem] font-black text-[11px] uppercase tracking-widest transition-all"
               >
                 Volver a mi agenda
               </button>
            </div>

          </div>

          {/* Overlay de éxito */}
          <AnimatePresence>
            {showSuccess && (
               <motion.div 
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 className="absolute inset-0 z-[100] bg-white flex flex-col items-center justify-center p-8 text-center"
               >
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-24 h-24 bg-[#FFD100] rounded-full flex items-center justify-center mb-6 shadow-xl"
                  >
                     <CheckCircle2 className="w-12 h-12 text-[#1C36C6]" />
                  </motion.div>
                  <h2 className="text-2xl font-black text-[#101A3F] mb-2">¡Review Publicado!</h2>
                  <p className="text-sm text-zinc-500 font-medium">+35 Semillas añadidas a tu perfil de Turista.</p>
               </motion.div>
            )}
          </AnimatePresence>

        </div>
      </motion.div>
    </div>
  );
}
