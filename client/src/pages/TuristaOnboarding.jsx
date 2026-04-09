import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../api/supabase';
import { 
  Building2, 
  HeartPulse, 
  Rocket,
  Mic2,
  Users,
  CheckCircle2,
  Zap,
  Volume2,
  Briefcase,
  Palette,
  Code,
  ArrowLeft,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function TuristaOnboarding() {
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  // Selection states
  const [interests, setInterests] = useState([]);
  const [activityTypes, setActivityTypes] = useState([]);
  const [participation, setParticipation] = useState([]);
  const [languages, setLanguages] = useState(['es']);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        // En demo, si no hay auth, permitimos para testing pero asignamos un ID falso
        setUserId('demo-user');
      } else {
        setUserId(user.id);
      }
    };
    checkUser();
  }, [navigate]);

  const toggleArrayItem = (setter, stateArray, item) => {
    setter(
      stateArray.includes(item)
        ? stateArray.filter(i => i !== item)
        : [...stateArray, item]
    );
  };

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
    else handleFinish();
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
    else navigate('/dashboard');
  };

  const handleFinish = async () => {
    setSaving(true);
    // Simular guardado real
    await new Promise(r => setTimeout(r, 1500));
    
    if (userId && userId !== 'demo-user') {
      const gustosStr = [...interests, ...activityTypes].join(', ');
      await supabase
        .from('profiles')
        .update({ gustos: gustosStr })
        .eq('id', userId);
    }
    
    navigate('/agenda');
  };

  // UI Components for Steps
  const renderStepIndicators = () => (
    <div className="flex justify-between items-start relative px-2 mb-6">
      <div className="absolute top-4 left-6 right-6 h-[2px] bg-indigo-500/40 -z-0"></div>
      {[1, 2, 3, 4].map((s) => (
        <div key={s} className="flex flex-col items-center gap-1 relative z-10 bg-[#1C36C6]">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm transition-all duration-300 ${
            step >= s ? 'bg-[#FFD100] text-[#1C36C6]' : 'border-2 border-indigo-400 text-white'
          }`}>
            {step > s ? <CheckCircle2 className="w-4 h-4" /> : s}
          </div>
          <span className={`text-[8px] text-center w-12 font-bold uppercase transition-colors ${
            step === s ? 'text-white' : 'text-indigo-400'
          }`}>
            {s === 1 ? 'Perfil' : s === 2 ? 'Gusto' : s === 3 ? 'Modo' : 'Idioma'}
          </span>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F2F1EC] flex flex-col items-center justify-center py-10 font-sans">
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-[390px] h-[800px] max-h-[90vh] bg-white rounded-[3rem] shadow-2xl shadow-indigo-900/20 overflow-hidden flex flex-col border-[12px] border-[#101A3F] relative"
      >
        
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-6 bg-[#101A3F] rounded-b-3xl z-50"></div>

        {/* HEADER */}
        <div className="bg-[#1C36C6] pt-12 pb-6 px-6 relative z-10 shrink-0">
          <div className="flex items-center gap-2 justify-center mb-1">
            <span className="bg-[#FFD100] px-2 py-0.5 rounded text-[8px] font-black text-[#1C36C6]">2026</span>
            <h2 className="text-white font-bold text-sm">Barrio Mundial</h2>
          </div>
          <p className="text-center text-indigo-300 text-[9px] uppercase tracking-widest font-black mb-6">
            Touring Experience
          </p>

          <h1 className="text-white text-[24px] font-black leading-tight mb-2">
            {step === 1 && "¿Cuál es tu rol?"}
            {step === 2 && "¿Qué te apasiona?"}
            {step === 3 && "¿Cómo participas?"}
            {step === 4 && "¿Qué idioma hablas?"}
          </h1>
          
          {renderStepIndicators()}
        </div>

        {/* CONTENT */}
        <div className="flex-1 bg-white overflow-hidden relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              className="h-full overflow-y-auto px-6 py-6 pb-24"
            >
              {step === 1 && (
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: 'dev', name: 'Dev', icon: Code, col: 'indigo' },
                    { id: 'ent', name: 'Emprende', icon: Rocket, col: 'rose' },
                    { id: 'inv', name: 'Inversor', icon: Briefcase, col: 'purple' },
                    { id: 'cre', name: 'Creador', icon: Palette, col: 'orange' },
                    { id: 'sal', name: 'Salud', icon: HeartPulse, col: 'pink' },
                    { id: 'neg', name: 'Negocios', icon: Building2, col: 'teal' }
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => toggleArrayItem(setInterests, interests, item.id)}
                      className={`p-4 rounded-3xl flex flex-col items-center gap-2 transition-all border shadow-sm ${
                        interests.includes(item.id) 
                          ? 'border-[#1C36C6] bg-indigo-50/50' 
                          : 'border-zinc-100 bg-white hover:border-zinc-200'
                      }`}
                    >
                      <item.icon className={`w-6 h-6 text-${item.col}-500`} />
                      <span className="text-[11px] font-bold text-[#101A3F]">{item.name}</span>
                    </button>
                  ))}
                </div>
              )}

              {step === 2 && (
                <div className="flex flex-col gap-3">
                  {[
                    { id: 'key', name: 'Keynotes', icon: Mic2 },
                    { id: 'tal', name: 'Talleres', icon: CheckCircle2 },
                    { id: 'pan', name: 'Paneles', icon: Users },
                    { id: 'con', name: 'Conferencias', icon: Volume2 }
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => toggleArrayItem(setActivityTypes, activityTypes, item.id)}
                      className={`p-4 rounded-2xl flex items-center justify-between border transition-all ${
                        activityTypes.includes(item.id)
                          ? 'border-[#1C36C6] bg-indigo-50/50 ring-1 ring-[#1C36C6]'
                          : 'border-zinc-100 bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon className="w-5 h-5 text-indigo-500" />
                        <span className="font-bold text-sm text-[#101A3F]">{item.name}</span>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        activityTypes.includes(item.id) ? 'border-[#1C36C6] bg-[#1C36C6]' : 'border-zinc-200'
                      }`}>
                        {activityTypes.includes(item.id) && <div className="w-2 h-2 bg-white rounded-full" />}
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {step === 3 && (
                <div className="grid grid-cols-1 gap-3">
                  {[
                    { id: 'pre', name: 'Presencial', desc: 'En Expo Santa Fe' },
                    { id: 'onl', name: 'En Línea', desc: 'Desde cualquier lugar' },
                    { id: 'mix', name: 'Mixto', desc: 'Presencial y digital' }
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setParticipation([item.id])}
                      className={`p-5 rounded-3xl border-2 text-left transition-all ${
                        participation.includes(item.id)
                          ? 'border-[#FFD100] bg-yellow-50/30'
                          : 'border-zinc-100'
                      }`}
                    >
                      <p className="font-black text-[#101A3F] text-base mb-1">{item.name}</p>
                      <p className="text-xs text-zinc-400 font-medium">{item.desc}</p>
                    </button>
                  ))}
                </div>
              )}

              {step === 4 && (
                <div className="flex flex-col gap-4">
                   <p className="text-zinc-500 text-xs text-center mb-2 px-4">
                    Adaptaremos el contenido de tu agenda al idioma de tu preferencia.
                  </p>
                  <div className="grid grid-cols-1 gap-2">
                    {[
                      { id: 'es', name: 'Español', flag: '🇲🇽' },
                      { id: 'en', name: 'English', flag: '🇺🇸' },
                      { id: 'pt', name: 'Português', flag: '🇧🇷' }
                    ].map((lang) => (
                      <button
                        key={lang.id}
                        onClick={() => setLanguages([lang.id])}
                        className={`p-4 rounded-2xl flex items-center justify-between border-2 transition-all ${
                          languages.includes(lang.id) ? 'border-[#1C36C6] bg-indigo-50' : 'border-zinc-100'
                        }`}
                      >
                        <span className="font-bold text-sm flex items-center gap-3">
                          <span className="text-xl">{lang.flag}</span> {lang.name}
                        </span>
                        {languages.includes(lang.id) && <CheckCircle2 className="w-5 h-5 text-[#1C36C6]" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* FOOTER ACTIONS */}
        <div className="absolute bottom-0 left-0 w-full p-6 bg-white border-t border-zinc-50 flex items-center gap-3 z-50">
          <button 
            onClick={handleBack}
            className="w-14 h-14 rounded-2xl border-2 border-zinc-100 flex items-center justify-center text-zinc-400 hover:bg-zinc-50"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          
          <button 
            onClick={handleNext}
            disabled={saving}
            className="flex-1 bg-[#1C36C6] text-white py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-200 active:scale-95 transition-all"
          >
            {saving ? 'Generando...' : step === 4 ? 'Finalizar' : 'Siguiente'}
            {!saving && <ChevronRight className="w-4 h-4" />}
          </button>
        </div>

      </motion.div>
      
      <p className="mt-4 text-[#A19D98] text-[11px] font-bold">
         {saving ? 'Casi listo...' : `Paso ${step} — Personalizando tu Barrio`}
      </p>

    </div>
  );
}
