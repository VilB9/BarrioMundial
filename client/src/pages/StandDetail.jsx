import { useState } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { ArrowLeft, Heart, Map as MapIcon, Zap, MapPin, CheckCircle2, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function StandDetail() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { id } = useParams();

  const [saved, setSaved] = useState(false);

  // Payload for demo matching screenshot exactly
  const mockStand = {
    title: "Pitch: Descubriendo tu Barrio",
    subtitle: "Evento Destacado - Main Stage",
    tipo: "Pitch",
    area: "Main Stage",
    modalidad: "Presencial",
    horario: "09:00 - 10:00",
    lugar: "Escenario Principal",
    idioma: "Español",
    cupoActual: 345,
    cupoMax: 400,
    afinidad: 100,
    ponente: {
      nombre: "Equipo Hackathon",
      cargo: "Participantes Elite",
      iniciales: "EH"
    },
    descripcion: "Presentación final del proyecto 'Descubriendo tu Barrio' ante el jurado de Fundación Coppel y líderes de tecnología. Demostración en vivo de la plataforma Phygital, ruteo geolocalizado en recintos e Inteligencia Artificial."
  };

  const standData = state?.stand || mockStand;

  const handleReturn = () => {
    navigate('/agenda');
  };

  const handleGoToMap = () => {
    navigate('/mapa', { state: { trackedStandId: id || "supabase-workshop" } });
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

        {/* CONTENIDO INTERNO DESLIZABLE */}
        <div className="flex-1 w-full bg-white relative overflow-y-auto no-scrollbar pb-32 pt-10">
          
          {/* Header Superior Azul Institucional */}
          <div className="w-full bg-[#1C36C6] px-6 pt-6 pb-8 text-white shrink-0 rounded-b-[2.5rem] shadow-lg shadow-indigo-900/10">
            {/* Navegación arriba */}
            <button 
              onClick={handleReturn}
              className="flex items-center text-[10px] uppercase tracking-widest font-black opacity-80 hover:opacity-100 transition-opacity mb-6"
            >
              <ArrowLeft className="w-3.5 h-3.5 mr-2" />
              Volver a mi agenda
            </button>

            {/* Etiquetas */}
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-3 py-1 text-[9px] font-black rounded-lg border border-white/30 text-white bg-white/10 uppercase tracking-widest">
                {standData.tipo}
              </span>
              <span className="px-3 py-1 text-[9px] font-black rounded-lg bg-[#FFD100] text-[#1C36C6] uppercase tracking-widest">
                {standData.area}
              </span>
              <span className="px-3 py-1 text-[9px] font-black rounded-lg border border-white/30 text-white bg-white/10 uppercase tracking-widest flex items-center">
                <MapPin className="w-3 h-3 mr-1" />
                {standData.modalidad}
              </span>
            </div>

            <h1 className="text-[26px] font-black leading-tight mb-2">
              {standData.title}
            </h1>
            <p className="text-xs text-indigo-100 opacity-90 font-medium mb-6">
              {standData.subtitle}
            </p>

            <button 
              onClick={() => navigate('/completada')}
              className="flex items-center text-[10px] font-black uppercase tracking-[0.15em] text-[#FFD100] hover:text-white transition-colors"
            >
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Hacer Check-In en el Stand
            </button>
          </div>

          {/* Información Detallada (Fondo Blanco) */}
          <div className="w-full px-6 pt-8 flex flex-col gap-5">
            
            {/* Grid de tarjetas estadísticas */}
            <div className="grid grid-cols-2 gap-4">
              <div className="border border-zinc-100 rounded-2xl p-4 flex flex-col bg-zinc-50/50 shadow-sm">
                <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-1.5">Horario</span>
                <span className="font-black text-[#101A3F] text-sm">{standData.horario}</span>
              </div>
              <div className="border border-zinc-100 rounded-2xl p-4 flex flex-col bg-zinc-50/50 shadow-sm">
                <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-1.5">Lugar</span>
                <span className="font-black text-[#101A3F] text-sm">{standData.lugar}</span>
              </div>
              <div className="border border-zinc-100 rounded-2xl p-4 flex flex-col bg-zinc-50/50 shadow-sm">
                <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-1.5">Idioma</span>
                <span className="font-black text-[#101A3F] text-sm flex items-center">
                  <span className="mr-1.5">🇲🇽</span> {standData.idioma}
                </span>
              </div>
              <div className="border border-zinc-100 rounded-2xl p-4 flex flex-col bg-zinc-50/50 shadow-sm">
                <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-1.5">Cupo</span>
                <span className="font-black text-[#F97316] text-sm">{standData.cupoActual} <span className="text-zinc-300">/ {standData.cupoMax}</span></span>
              </div>
            </div>

            {/* Afinidad de Perfil con Estilo IA */}
            <div className="bg-[#1C36C6]/5 border border-[#1C36C6]/10 rounded-[2rem] p-6 shadow-sm mt-2 relative overflow-hidden">
              <div className="absolute right-[-20px] top-[-20px] opacity-5">
                <Zap className="w-32 h-32 text-[#1C36C6]" fill="currentColor" />
              </div>
              <h3 className="text-[10px] font-black text-[#1C36C6] uppercase tracking-widest mb-4 flex items-center gap-2">
                <Zap className="w-3 h-3 fill-[#1C36C6]" /> Match con tu perfil
              </h3>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex-1 bg-zinc-100 h-2.5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${standData.afinidad}%` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="h-full bg-[#1C36C6] rounded-full relative"
                  >
                     <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                  </motion.div>
                </div>
                <span className="text-[#1C36C6] font-black text-lg">{standData.afinidad}%</span>
              </div>
              <div className="flex flex-wrap gap-2 text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
                <span className="bg-white px-2 py-0.5 rounded border border-zinc-100">{standData.tipo}</span>
                <span className="bg-white px-2 py-0.5 rounded border border-zinc-100">{standData.area}</span>
              </div>
            </div>

            {/* Ponente */}
            <div className="border border-zinc-100 rounded-[2rem] p-5 shadow-sm flex items-center gap-4 bg-white">
              <div className="w-14 h-14 bg-[#1C36C6] rounded-2xl flex items-center justify-center text-[#FFD100] font-black text-xl shadow-lg shadow-indigo-900/20 shrink-0">
                {standData.ponente.iniciales}
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.1em] mb-1">Speaker</span>
                <span className="font-black text-[#101A3F] text-base leading-none mb-1">{standData.ponente.nombre}</span>
                <span className="text-xs text-zinc-500 font-medium">{standData.ponente.cargo}</span>
              </div>
            </div>

            {/* Descripción */}
            <div className="mt-4 mb-12 px-2">
              <h3 className="text-sm font-black text-[#101A3F] mb-3 uppercase tracking-wider">Acerca del evento</h3>
              <p className="text-sm text-zinc-600 leading-relaxed font-medium">
                {standData.descripcion}
              </p>
            </div>

          </div>
        </div>

        {/* FOOTER ACTIONS - FIXED */}
        <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-white via-white to-transparent pt-12 z-20 flex flex-col gap-3">
          <button 
            onClick={() => navigate('/agenda')}
            className="w-full bg-[#1C36C6] text-white py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/30 active:scale-95 transition-all"
          >
             Agregar a mi agenda
             <Zap className="w-4 h-4 fill-[#FFD100] text-[#FFD100] animate-pulse" />
          </button>
          
          <button 
            onClick={handleGoToMap}
            className="w-full bg-white border-2 border-zinc-100 text-[#101A3F] py-3.5 rounded-2xl font-black text-sm flex items-center justify-center gap-2 hover:bg-zinc-50 active:scale-95 transition-all"
          >
             Ver ruta en mapa
             <MapIcon className="w-4 h-4" />
          </button>
        </div>

      </motion.div>
    </div>
  );
}
