import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Map as MapIcon, Calendar, Gift, Key, ChevronRight, User, Bookmark, Store, LogOut, Bot } from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [llaves] = useState(15);
  const [isMerchant, setIsMerchant] = useState(false);

  useEffect(() => {
    // 1. Check URL for explicit role change
    const params = new URLSearchParams(location.search);
    const roleParam = params.get('role');
    
    // 2. Read from localStorage for persistence
    const savedRole = localStorage.getItem('user_role');

    if (roleParam === 'merchant') {
      setIsMerchant(true);
      localStorage.setItem('user_role', 'merchant');
      // Clean URL to prevent re-triggering logic unnecessarily
      navigate('/dashboard', { replace: true });
    } else if (savedRole === 'merchant') {
      setIsMerchant(true);
    } else {
      setIsMerchant(false);
    }
  }, [location, navigate]);

  const handleLogoutMerchant = () => {
    localStorage.removeItem('user_role');
    setIsMerchant(false);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#F2F1EC] flex flex-col items-center justify-center py-10 font-sans">

      {/* Mobile Frame */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-[390px] h-[800px] max-h-[90vh] bg-white rounded-[3rem] shadow-2xl shadow-blue-900/20 overflow-hidden flex flex-col border-[12px] border-[#101A3F] relative"
      >

        {/* Fake Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-6 bg-[#101A3F] rounded-b-3xl z-50 flex items-center justify-center">
          <div className="w-12 h-1.5 bg-zinc-800 rounded-full"></div>
        </div>

        {/* HEADER */}
        <div className="bg-[#0056b3] pt-10 pb-6 px-6 relative z-10 w-full shrink-0">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-blue-200 text-[10px] font-semibold">
                  {isMerchant ? 'Bienvenido Socio Coppel' : 'Bienvenido visitante'}
                </p>
                <h1 className="text-white font-black text-lg leading-none">
                  {isMerchant ? 'Emprendedor' : 'Turista'}
                </h1>
              </div>
            </div>
            {isMerchant ? (
              <button 
                onClick={handleLogoutMerchant}
                className="w-8 h-8 bg-black/20 rounded-full flex items-center justify-center text-white/70 hover:text-white transition-colors"
                title="Cerrar Sessión Socio"
              >
                <LogOut className="w-4 h-4" />
              </button>
            ) : (
              <div className="font-extrabold italic text-xs text-right leading-tight text-[#f7e300]">
                Coppel<br />Connect
              </div>
            )}
          </div>

          {/* Saldo Card */}
          <div className="bg-white rounded-2xl p-4 flex items-center justify-between shadow-sm">
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                {isMerchant ? 'Llaves acumuladas' : 'Saldo disponible'}
              </p>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-black text-[#0056b3]">{llaves}</span>
                <span className="text-gray-400 font-bold text-sm mb-0.5">Llaves</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-[#f7e300] rounded-2xl flex items-center justify-center shadow-inner">
              <Key className="w-6 h-6 text-[#0056b3]" strokeWidth={2.5} />
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div className="flex-1 bg-[#F8FAFC] overflow-y-auto px-5 py-5 pb-24 flex flex-col gap-4">

          <h2 className="text-[10px] font-black text-zinc-400 tracking-widest uppercase">
            {isMerchant ? 'Gestión de Negocio' : 'Accesos Rápidos'}
          </h2>

          {isMerchant && (
            <motion.button
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              onClick={() => navigate('/registro-comerciante')}
              className="bg-white rounded-2xl p-5 shadow-lg border-2 border-[#f7e300] flex items-center justify-between group hover:border-[#0056b3] transition-all w-full relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-1">
                 <span className="bg-[#f7e300] text-[#0056b3] text-[7px] font-black px-1.5 py-0.5 rounded-bl-lg uppercase">Nuevo Flow</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-yellow-50 rounded-2xl flex items-center justify-center text-[#0056b3] shadow-inner">
                  <Store className="w-6 h-6 text-orange-500" strokeWidth={2.5} />
                </div>
                <div className="text-left">
                  <p className="font-black text-[#101A3F] text-base leading-tight">Registro de Negocio</p>
                  <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-tighter mt-0.5">Módulos 1 y 2 · ¡Empieza aquí!</p>
                </div>
              </div>
              <div className="w-8 h-8 rounded-full bg-zinc-50 flex items-center justify-center group-hover:bg-[#0056b3] transition-colors">
                <ChevronRight className="w-5 h-5 text-zinc-300 group-hover:text-white" />
              </div>
            </motion.button>
          )}

          {isMerchant && (
            <motion.button
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              onClick={() => navigate('/chatbot')}
              className="bg-[#0056b3] rounded-2xl p-5 shadow-lg border-2 border-white/20 flex items-center justify-between group hover:bg-[#004494] transition-all w-full relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-1">
                 <span className="bg-[#f7e300] text-[#0056b3] text-[7px] font-black px-1.5 py-0.5 rounded-bl-lg uppercase">IA Powered</span>
              </div>
              <div className="flex items-center gap-4 text-white">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center shadow-inner">
                  <Bot className="w-6 h-6 text-[#f7e300]" strokeWidth={2.5} />
                </div>
                <div className="text-left">
                  <p className="font-black text-white text-base leading-tight">Coppelito Chatbot</p>
                  <p className="text-[10px] text-blue-200 font-bold uppercase tracking-tighter mt-0.5">Director de Arte · Nano Banana 2</p>
                </div>
              </div>
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-[#f7e300] transition-colors">
                <ChevronRight className="w-5 h-5 text-white group-hover:text-[#0056b3]" />
              </div>
            </motion.button>
          )}

          {/* Mapa */}
          <button
            onClick={() => navigate('/mapa')}
            className="bg-white rounded-2xl p-4 shadow-sm border border-zinc-100 flex items-center justify-between group hover:shadow-md transition-shadow w-full"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-[#0056b3]">
                <MapIcon className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="font-bold text-[#101A3F] text-sm">Mapa del Evento</p>
                <p className="text-[10px] text-zinc-400">Ver stands cerca de mí</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-zinc-300 group-hover:text-[#0056b3] transition-colors" />
          </button>

          {/* Agenda */}
          <button
            onClick={() => navigate('/agenda')}
            className="bg-white rounded-2xl p-4 shadow-sm border border-zinc-100 flex items-center justify-between group hover:shadow-md transition-shadow w-full"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-[#0056b3]">
                <Calendar className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="font-bold text-[#101A3F] text-sm">Mi Agenda</p>
                <p className="text-[10px] text-zinc-400">Ruta personalizada y eventos</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-zinc-300 group-hover:text-[#0056b3] transition-colors" />
          </button>

          {/* Fidelity Hub Banner */}
          <div
            onClick={() => navigate('/fidelity')}
            className="mt-2 bg-[#0056b3] rounded-3xl p-5 text-white shadow-lg relative overflow-hidden cursor-pointer hover:scale-[1.02] transition-transform"
          >
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
            <Gift className="absolute right-3 bottom-2 w-20 h-20 text-white/5 pointer-events-none" />

            <div className="mb-2 relative z-10">
              <span className="px-2 py-1 bg-[#f7e300] text-[#0056b3] text-[9px] font-black uppercase tracking-widest rounded-lg">
                Rewards
              </span>
            </div>
            <h2 className="text-xl font-black mb-1 relative z-10">
              {isMerchant ? 'Beneficios Socio' : 'Fidelity Hub'}
            </h2>
            <p className="text-blue-200 text-xs w-3/4 relative z-10">
              {isMerchant 
                ? 'Accede a financiamiento y beneficios para tu negocio' 
                : 'Canjea tus Llaves y sube de nivel en Barrio Mundial'}
            </p>
          </div>

          <div className="h-4 w-full shrink-0"></div>

        </div>

        {/* BOTTOM NAV */}
        <div className="absolute bottom-0 left-0 w-full h-[70px] bg-white border-t border-zinc-100 grid grid-cols-4 px-2 pb-2 rounded-b-3xl z-40">
          <button onClick={() => navigate('/dashboard')} className="flex flex-col items-center justify-center gap-1 text-[#0056b3] pt-1">
            <Calendar className="w-5 h-5" fill="currentColor" strokeWidth={1} />
            <span className="text-[9px] font-bold">Inicio</span>
          </button>
          <button onClick={() => navigate('/mapa')} className="flex flex-col items-center justify-center gap-1 text-zinc-400 hover:text-zinc-600 transition-colors pt-1">
            <MapIcon className="w-5 h-5" strokeWidth={2} />
            <span className="text-[9px] font-semibold">Mapa</span>
          </button>
          <button onClick={() => navigate('/fidelity')} className="flex flex-col items-center justify-center gap-1 text-zinc-400 hover:text-zinc-600 transition-colors pt-1">
            <Bookmark className="w-5 h-5" strokeWidth={2.5} />
            <span className="text-[9px] font-semibold">Rewards</span>
          </button>
          <button onClick={() => navigate('/onboarding-turista')} className="flex flex-col items-center justify-center gap-1 text-zinc-400 hover:text-zinc-600 transition-colors pt-1">
            <User className="w-5 h-5" strokeWidth={2.5} />
            <span className="text-[9px] font-semibold">Perfil</span>
          </button>
        </div>

      </motion.div>

      <p className="mt-4 text-[#A19D98] text-[11px] font-bold">
        Coppel Connect · {isMerchant ? 'Portal Socio Emprendedor' : 'Barrio Mundial 2026'}
      </p>

    </div>
  );
}
