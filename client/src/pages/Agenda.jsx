import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Map as MapIcon, Bookmark, User, ArrowRight } from 'lucide-react';

// Hardcoded schedule data based on mockup
const AGENDA_ITEMS = [
  {
    time: "09:00 - 09:45",
    type: "Keynote", // yellow/green
    typeBg: "bg-green-700",
    stage: "Main Stage",
    stageBg: "bg-green-900",
    title: "El futuro del desarrollo con IA"
  },
  {
    time: "10:00 - 11:30",
    type: "Taller", // green
    typeBg: "bg-emerald-600",
    stage: "Workshop 1",
    stageBg: "bg-emerald-900",
    title: "Construyendo Edge Functions hands-on"
  },
  {
    time: "12:00 - 12:45",
    type: "Conferencia", // Blue
    typeBg: "bg-blue-600",
    stage: "Dev Stage",
    stageBg: "bg-[#101A3F]",
    title: "Arquitecturas serverless en 2026"
  },
  {
    time: "13:00 - 14:00",
    type: "Descanso", // yellow
    typeBg: "bg-transparent text-zinc-500 border border-zinc-200", 
    stage: "Zona Comidas",
    stageBg: "bg-transparent text-zinc-500",
    title: "Almuerzo libre y Networking"
  },
  {
    time: "14:30 - 15:15",
    type: "Panel", // Purple 
    typeBg: "bg-indigo-600",
    stage: "Business Stage",
    stageBg: "bg-[#101A3F]",
    title: "Open source y modelos de negocio"
  }
];

export default function Agenda() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F2F1EC] flex flex-col items-center justify-center py-10 font-sans">
      
      {/* Mobile Frame Container */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-[390px] h-[800px] max-h-[90vh] bg-white rounded-[3rem] shadow-2xl shadow-indigo-900/20 overflow-hidden flex flex-col border-[12px] border-[#101A3F] relative"
      >
        
        {/* Fake Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-6 bg-[#101A3F] rounded-b-3xl z-50 flex items-center justify-center">
           <div className="w-12 h-1.5 bg-zinc-800 rounded-full"></div>
        </div>

        {/* --- HEADER AZUL --- */}
        <div className="bg-[#1C36C6] pt-12 pb-6 px-6 relative z-10 w-full shrink-0">
          <div className="flex items-center gap-2 mb-4">
            <div className="flex gap-1">
              <span className="w-2 h-2 rounded-full bg-[#FFD100]"></span>
              <span className="w-2 h-2 rounded-full bg-[#FFD100]"></span>
              <span className="w-2 h-2 rounded-full bg-[#FFD100]"></span>
            </div>
            <h2 className="text-white font-bold text-xs tracking-wide">
              Fundaci{'\u00f3'}n Coppel
              <span className="block text-[8px] opacity-70 font-normal">Barrio Mundial - Ola M{'\u00e9'}xico</span>
            </h2>
          </div>

          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-white text-[22px] font-black leading-none mb-1">
                Mi ruta IA
              </h1>
              <p className="text-indigo-200 text-[10px] leading-tight w-3/4">
                Agenda para Desarrollador - 8 actividades
              </p>
            </div>
            
            {/* 94% Match Pill */}
            <div className="bg-[#FFD100] px-3 py-1.5 rounded-xl flex flex-col items-center justify-center leading-none shadow-sm h-min">
              <span className="font-black text-[#101A3F] text-sm">94%</span>
              <span className="font-bold text-[#101A3F] text-[8px]">match</span>
            </div>
          </div>
        </div>

        {/* --- TIMELINE CONTENT --- */}
        <div className="flex-1 bg-[#F8FAFC] overflow-y-auto px-5 py-6 pb-24 custom-scrollbar">
          
          <h3 className="text-[10px] font-black text-zinc-400 tracking-widest uppercase mb-4">
            Mañana
          </h3>

          <div className="flex flex-col gap-3">
            {AGENDA_ITEMS.map((item, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-4 shadow-sm border border-zinc-100 flex flex-col">
                <div className="flex justify-between items-center w-full mb-3">
                   <div className="flex items-center gap-2">
                     <span className="text-xs font-bold text-[#101A3F]">{item.time}</span>
                   </div>
                   <div className="flex items-center gap-1 shrink-0">
                     <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md text-white ${item.typeBg}`}>
                       {item.type}
                     </span>
                     <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md text-white ${item.stageBg}`}>
                       {item.stage}
                     </span>
                   </div>
                </div>
                <h4 className="text-[13px] font-bold text-[#101A3F] leading-tight">
                  {item.title}
                </h4>
              </div>
            ))}
          </div>
          
          <p className="text-center text-xs text-zinc-400 font-medium py-4">
            + 3 actividades m{'\u00e1'}s generadas por IA
          </p>

          <button 
            onClick={() => navigate('/mapa')}
            className="w-full bg-[#1C36C6] hover:bg-[#102290] text-white py-3.5 rounded-xl flex items-center justify-center gap-2 font-black text-sm transition-all mt-2 shadow-md shadow-indigo-500/20"
          >
            Ver en mapa <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* --- BOTTOM NAV (Mock) --- */}
        <div className="absolute bottom-0 left-0 w-full h-[70px] bg-white border-t border-zinc-100 grid grid-cols-4 px-2 pb-2 rounded-b-3xl">
          <button className="flex flex-col items-center justify-center gap-1 text-[#1C36C6] pt-1">
             <Calendar className="w-5 h-5" fill="currentColor" strokeWidth={1} />
             <span className="text-[9px] font-bold">Agenda</span>
          </button>
          <button onClick={() => navigate('/mapa')} className="flex flex-col items-center justify-center gap-1 text-zinc-400 hover:text-zinc-600 transition-colors pt-1">
             <MapIcon className="w-5 h-5" strokeWidth={2} />
             <span className="text-[9px] font-semibold">Mapa</span>
          </button>
          <button className="flex flex-col items-center justify-center gap-1 text-zinc-400 hover:text-zinc-600 transition-colors pt-1">
             <Bookmark className="w-5 h-5" fill="currentColor" strokeWidth={1} />
             <span className="text-[9px] font-semibold">Guardados</span>
          </button>
          <button onClick={() => navigate('/onboarding-turista')} className="flex flex-col items-center justify-center gap-1 text-zinc-400 hover:text-zinc-600 transition-colors pt-1">
             <User className="w-5 h-5" strokeWidth={2.5} />
             <span className="text-[9px] font-semibold">Perfil</span>
          </button>
        </div>

      </motion.div>
      
      <p className="mt-4 text-[#A19D98] text-[11px] font-bold">
         Agenda personalizada por IA
      </p>

    </div>
  );
}
