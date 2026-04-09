import { fetchEconomy, redeemInvitationCode } from '../services/economyService';

export default function FidelityHub() {
  const navigate = useNavigate();
  const [economy, setEconomy] = useState(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEconomy = async () => {
      const data = await fetchEconomy();
      setEconomy(data);
      setLoading(false);
    };
    loadEconomy();
  }, []);

  const handleCopy = () => {
    if (!economy?.referral_code) return;
    navigator.clipboard.writeText(economy.referral_code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center text-sm font-bold text-white opacity-90 hover:opacity-100 transition-opacity"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </button>
            <div className="bg-[#f7e300] text-[#0056b3] px-3 py-1 rounded-full text-xs font-black flex items-center gap-1 shadow-sm">
              <Key className="w-3 h-3" />
              {loading ? '...' : (economy?.keys_balance || 0)} Llaves
            </div>
          </div>
          <h1 className="text-white text-[22px] font-black leading-none mb-1">Fidelity Hub</h1>
          <p className="text-blue-200 text-[10px] leading-tight w-4/5">
            Canjea tus llaves por beneficios reales dentro del Barrio Mundial.
          </p>
        </div>

        {/* CONTENT */}
        <div className="flex-1 bg-[#F8FAFC] overflow-y-auto px-5 py-5 pb-24 flex flex-col gap-4">

          {/* MODO INVITACIÓN */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-zinc-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3 opacity-5">
              <Share2 className="w-20 h-20" />
            </div>
            <p className="text-[10px] font-black text-[#0056b3] uppercase tracking-widest mb-2">Modo Invitación</p>
            <p className="font-bold text-gray-800 text-sm leading-tight mb-4">
              Invita a un amigo y ambos ganan <span className="text-[#0056b3]">5 Llaves</span>.
            </p>
            
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-blue-50 border border-blue-100 rounded-xl p-3 text-center font-mono font-bold text-[#0056b3] text-xs tracking-wider">
                  {loading ? 'CARGANDO...' : (economy?.referral_code || 'ERROR')}
                </div>
                <button
                  onClick={handleCopy}
                  className="bg-[#0056b3] hover:bg-blue-800 transition-colors text-white w-11 h-11 flex items-center justify-center rounded-xl shadow-md shrink-0"
                  title="Copiar Código"
                >
                  {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button className="bg-[#25D366] text-white py-3 rounded-xl font-bold text-[10px] flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-all">
                  <Share2 className="w-3.5 h-3.5" />
                  WhatsApp
                </button>
                <button className="bg-gray-100 text-gray-700 py-3 rounded-xl font-bold text-[10px] flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-all">
                  <Share2 className="w-3.5 h-3.5" />
                  Más Redes
                </button>
              </div>
            </div>

            {/* Guest Summary */}
            <div className="mt-5 pt-4 border-t border-gray-100">
              <div className="flex justify-between items-center mb-2">
                <p className="text-[9px] font-bold text-gray-400 uppercase">Amigos Invitados</p>
                <span className="text-[9px] font-black text-[#0056b3] bg-blue-50 px-2 py-0.5 rounded-full">2/10</span>
              </div>
              <div className="flex -space-x-2 overflow-hidden">
                {[1, 2].map((i) => (
                  <div key={i} className="inline-block h-6 w-6 rounded-full ring-2 ring-white bg-gray-200 flex items-center justify-center">
                    <User className="w-3 h-3 text-gray-400" />
                  </div>
                ))}
                <div className="inline-block h-6 w-6 rounded-full ring-2 ring-white bg-blue-50 flex items-center justify-center text-[8px] font-bold text-[#0056b3]">
                  +
                </div>
              </div>
            </div>
          </div>

          {/* SECCIÓN PROMOCIONES */}
          <h2 className="text-[10px] font-black text-zinc-400 tracking-widest uppercase flex items-center gap-2">
            <Gift className="w-3 h-3 text-[#0056b3]" />
            Promociones Chidas
          </h2>

          {/* Ruta del Gol */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-zinc-100 flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <span className="bg-green-100 text-green-700 px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border border-green-200">
                Ruta del Gol
              </span>
              <span className="text-[9px] font-bold text-zinc-400">Progreso: 1/3</span>
            </div>
            <h3 className="font-black text-[#0056b3] text-base">20% de Descuento</h3>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Visita 3 puestos de comida local en la zona Phygital y desbloquea un 20% de descuento automático en tu cuarta compra.
            </p>
            <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
              <div className="bg-[#f7e300] h-full w-1/3 rounded-full"></div>
            </div>
          </div>

          {/* Pase de Visitante */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-zinc-100 flex flex-col gap-3">
            <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border border-purple-200 w-fit">
              Beneficio Turista
            </span>
            <h3 className="font-black text-[#0056b3] text-base">Pase de Visitante</h3>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Descuento exclusivo para visitantes en artesanías. Identifícate con tu perfil digital en los locales marcados con <span className="font-bold text-[#0056b3]">Ola México</span>.
            </p>
            <button
              onClick={() => navigate('/mapa')}
              className="w-full border-2 border-[#0056b3] text-[#0056b3] hover:bg-[#0056b3] hover:text-white transition-colors py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2"
            >
              <MapPin className="w-4 h-4" /> Ver stands participantes
            </button>
          </div>

        </div>

        {/* BOTTOM NAV */}
        <div className="absolute bottom-0 left-0 w-full h-[70px] bg-white border-t border-zinc-100 grid grid-cols-4 px-2 pb-2 rounded-b-3xl z-40">
          <button onClick={() => navigate('/dashboard')} className="flex flex-col items-center justify-center gap-1 text-zinc-400 hover:text-zinc-600 transition-colors pt-1">
            <Calendar className="w-5 h-5" strokeWidth={2} />
            <span className="text-[9px] font-semibold">Inicio</span>
          </button>
          <button onClick={() => navigate('/mapa')} className="flex flex-col items-center justify-center gap-1 text-zinc-400 hover:text-zinc-600 transition-colors pt-1">
            <MapIcon className="w-5 h-5" strokeWidth={2} />
            <span className="text-[9px] font-semibold">Mapa</span>
          </button>
          <button className="flex flex-col items-center justify-center gap-1 text-[#0056b3] pt-1">
            <Bookmark className="w-5 h-5" fill="currentColor" strokeWidth={1} />
            <span className="text-[9px] font-bold">Rewards</span>
          </button>
          <button onClick={() => navigate('/onboarding-turista')} className="flex flex-col items-center justify-center gap-1 text-zinc-400 hover:text-zinc-600 transition-colors pt-1">
            <User className="w-5 h-5" strokeWidth={2.5} />
            <span className="text-[9px] font-semibold">Perfil</span>
          </button>
        </div>

      </motion.div>

      <p className="mt-4 text-[#A19D98] text-[11px] font-bold">
        Fidelity Hub · Barrio Mundial 2026
      </p>

    </div>
  );
}
