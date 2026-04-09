import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Store, 
  CheckCircle2, 
  Info, 
  Pencil, 
  Utensils, 
  Palette, 
  Home, 
  Wrench, 
  Music, 
  ShoppingBag, 
  Sparkles,
  Sun,
  Moon,
  Coffee,
  Calendar,
  Zap,
  ChevronRight,
  Camera,
  MapPin,
  Users,
  Trophy,
  DollarSign
} from 'lucide-react';

export default function MerchantRegistration() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    businessName: 'Antojitos Doña Mary',
    olaNumber: '',
    description: 'Hacemos tacos de guisado desde hace 20 años, con tortilla azul hecha a mano y salsa de molcajete. ¡Todo casero!',
    categories: ['Comida y bebida'],
    schedule: ['Mañana'],
    languages: ['Español'],
    productName: 'Taco de Guisado Especial',
    price: '25',
    capacity: '6-20',
    address: 'Calle Amado Nervo 42, Col. Tepito'
  });

  const toggleItem = (field, item) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(item)
        ? prev[field].filter(i => i !== item)
        : [...prev[field], item]
    }));
  };

  const nextStep = () => setStep(prev => Math.min(prev + 1, 5));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  if (step === 5) {
    return (
      <div className="min-h-screen bg-[#F2F1EC] flex flex-col items-center justify-center py-10 font-sans">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-[390px] h-[800px] max-h-[90vh] bg-[#0056b3] rounded-[3rem] shadow-2xl overflow-hidden flex flex-col border-[12px] border-[#101A3F] relative"
        >
          <div className="flex-1 flex flex-col items-center text-center px-6 pt-24">
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="w-24 h-24 bg-[#f7e300] rounded-full flex items-center justify-center mb-6 shadow-xl"
            >
              <Trophy className="w-12 h-12 text-[#101A3F]" />
            </motion.div>
            
            <h1 className="text-[#f7e300] text-3xl font-black mb-2 uppercase tracking-tight">¡Golazo, {formData.businessName.split(' ')[2] || formData.businessName}!</h1>
            <p className="text-white text-sm font-bold opacity-80 mb-8">Tu negocio ya está en la cancha.<br/>Los turistas del Mundial pueden encontrarte.</p>

            <div className="w-full bg-white/10 backdrop-blur-md rounded-3xl p-5 text-left border border-white/20 mb-6">
              <p className="text-[10px] text-white/60 mb-3 font-black uppercase tracking-widest">Tu Resumen</p>
              <div className="space-y-4">
                 <div className="flex justify-between border-b border-white/10 pb-2">
                    <span className="text-white/70 text-xs font-bold">Negocio</span>
                    <span className="text-white text-xs font-black">{formData.businessName}</span>
                 </div>
                 <div className="flex justify-between border-b border-white/10 pb-2">
                    <span className="text-white/70 text-xs font-bold">Categoría</span>
                    <span className="text-white text-xs font-black">{formData.categories[0]}</span>
                 </div>
                 <div className="flex justify-between border-b border-white/10 pb-2">
                    <span className="text-white/70 text-xs font-bold">Capacidad</span>
                    <span className="text-white text-xs font-black">{formData.capacity} personas</span>
                 </div>
              </div>

               <div className="mt-6 bg-[#f7e300] p-3 rounded-2xl flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#101A3F] rounded-full flex items-center justify-center shrink-0">
                    <Sparkles className="w-4 h-4 text-[#f7e300]" />
                  </div>
                  <p className="text-[#101A3F] text-[10px] font-black leading-tight">Sello de Confianza Coppel activado — los turistas te ven primero.</p>
               </div>
            </div>

            <div className="w-full space-y-3">
               <button 
                  onClick={() => navigate('/dashboard')}
                  className="w-full bg-white text-[#0056b3] py-4 rounded-2xl font-black text-sm shadow-xl"
               >
                 Ver mi negocio en el mapa
               </button>
            </div>
          </div>
        </motion.div>
        <p className="mt-4 text-[#A19D98] text-[11px] font-bold">¡Alta completa — golazo!</p>
      </div>
    );
  }

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

        {/* --- HEADER --- */}
        <div className="bg-[#0056b3] pt-12 pb-6 px-6 relative z-10 w-full shrink-0">
          <div className="flex items-center gap-2 justify-center mb-1">
            <div className="flex gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#f7e300]"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-[#f7e300]"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-[#f7e300]"></span>
            </div>
            <h2 className="text-white font-bold text-sm tracking-wide">Fundación Coppel</h2>
          </div>
          <p className="text-center text-blue-200 text-[10px] uppercase tracking-widest font-black mb-6">
            Barrio Mundial - Ola México
          </p>

          <AnimatePresence mode="wait">
            <motion.div 
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <h1 className="text-white text-[24px] font-black leading-tight mb-1">
                {step === 1 ? '¡Hora de salir a la cancha!' : 
                 step === 2 ? '¿En qué posición juegas?' :
                 step === 3 ? '¿Cuál es tu jugada?' : 
                 '¿Cuántos caben en tu cancha?'}
              </h1>
              <p className="text-blue-200 text-xs mb-6">
                {step === 1 ? 'Registra tu negocio en 4 pasos muy fáciles' : 
                 step === 2 ? 'Dinos qué tipo de negocio tienes y cuándo abren.' : 
                 step === 3 ? 'Sube tu producto estrella para que los turistas lo vean.' : 
                 'Así no te mandamos más gente de la que puedes atender.'}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* PROGRESS INDICATOR */}
          <div className="flex justify-between items-start relative px-4">
            <div className="absolute top-4 left-8 right-8 h-[2px] bg-blue-400/40 -z-10"></div>
            
            {[1, 2, 3, 4].map((num) => (
              <div key={num} className="flex flex-col items-center gap-1 bg-[#0056b3]">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm transition-colors border-2 ${
                  step === num ? 'bg-[#f7e300] text-[#0056b3] border-[#f7e300]' : 
                  step > num ? 'bg-white text-[#0056b3] border-white' : 
                  'bg-[#0056b3] text-blue-300 border-blue-400'
                }`}>
                  {step > num ? <CheckCircle2 className="w-5 h-5" /> : num}
                </div>
                <span className={`text-[9px] text-center w-12 font-medium leading-tight ${step >= num ? 'text-white' : 'text-blue-300'}`}>
                  {num === 1 ? 'Tu negocio' : num === 2 ? 'Tu jugada' : num === 3 ? 'Tu menú' : 'Tu cancha'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* --- CONTENT --- */}
        <div className="flex-1 bg-white overflow-y-auto px-6 py-8 pb-32">
          
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col gap-6"
              >
                <div>
                  <h3 className="text-[#101A3F] font-black text-[14px]">¿Cómo se llama tu negocio?</h3>
                  <p className="text-zinc-400 text-[10px] mb-3">El nombre que conocen tus vecinos y el que verán tus clientes</p>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Store className="h-4 w-4 text-orange-400" />
                    </div>
                    <input 
                      type="text" 
                      value={formData.businessName}
                      onChange={(e) => setFormData({...formData, businessName: e.target.value})}
                      className="w-full bg-gray-50 border border-zinc-200 rounded-2xl py-3.5 pl-11 pr-12 text-sm font-bold text-[#101A3F] focus:outline-none focus:ring-2 focus:ring-[#0056b3]/10"
                    />
                  </div>
                </div>

                <div>
                  <h3 className="text-[#101A3F] font-black text-[14px]">¿Tienes número Ola México?</h3>
                  <div className="relative mt-3">
                    <input 
                      type="text" 
                      placeholder="EJ: OLA-2025-00412"
                      className="w-full bg-gray-50 border border-zinc-200 rounded-2xl py-3.5 pl-4 pr-4 text-sm font-bold text-[#101A3F] placeholder:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-[#0056b3]/10"
                    />
                  </div>
                </div>

                <div className="bg-[#f7e300]/20 border border-[#f7e300]/40 rounded-2xl p-4 flex gap-3">
                  <div className="w-6 h-6 bg-[#f7e300] rounded-full flex items-center justify-center shrink-0">
                    <Info className="w-3.5 h-3.5 text-[#0056b3]" strokeWidth={3} />
                  </div>
                  <p className="text-[10px] text-[#0056b3] leading-relaxed font-bold">
                    Con tu número Ola México obtienes el <span className="underline">Sello de Confianza Coppel</span>.
                  </p>
                </div>

                <div>
                   <h3 className="text-[#101A3F] font-black text-[14px]">Descripción breve</h3>
                   <textarea 
                      className="w-full bg-gray-50 border border-zinc-200 rounded-2xl p-4 text-xs font-bold text-[#101A3F] mt-2 focus:outline-none"
                      rows={3}
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                   />
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col gap-8"
              >
                <div>
                  <h3 className="text-[#101A3F] font-black text-[14px]">Categoría de negocio</h3>
                  <div className="grid grid-cols-2 gap-3 mt-4">
                    {[
                      { id: 'Comida y bebida', icon: Utensils, color: 'text-blue-500' },
                      { id: 'Artesanías', icon: Palette, color: 'text-orange-500' },
                      { id: 'Hospedaje', icon: Home, color: 'text-green-500' },
                      { id: 'Servicios', icon: Wrench, color: 'text-purple-500' }
                    ].map((cat) => (
                      <button 
                        key={cat.id}
                        onClick={() => toggleItem('categories', cat.id)}
                        className={`px-3 py-4 rounded-2xl flex flex-col items-center gap-2 transition-all border ${
                          formData.categories.includes(cat.id) ? 'border-[#0056b3] bg-blue-50 ring-2 ring-blue-100' : 'border-zinc-100 bg-white'
                        }`}
                      >
                        <cat.icon className={`w-6 h-6 ${cat.color}`} />
                        <span className="text-[10px] font-black text-[#101A3F]">{cat.id}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-[#101A3F] font-black text-[14px]">Horarios de atención</h3>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {['Mañana', 'Tarde', 'Noche', 'Findes'].map((item) => (
                      <button 
                        key={item}
                        onClick={() => toggleItem('schedule', item)}
                        className={`px-6 py-2.5 rounded-full text-[10px] font-black border transition-all ${
                          formData.schedule.includes(item) 
                            ? 'bg-[#f7e300] text-[#101A3F] border-[#f7e300]' 
                            : 'bg-zinc-50 text-zinc-400 border-zinc-100'
                        }`}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div 
                key="step3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col gap-6"
              >
                <div>
                   <h3 className="text-[#101A3F] font-black text-[14px]">¿Qué vendes?</h3>
                   <p className="text-zinc-400 text-[10px] mb-4">Dinos cuál es tu producto o servicio estrella.</p>
                   
                   <div className="space-y-4">
                      <div className="bg-zinc-50 border-2 border-dashed border-zinc-200 rounded-3xl h-40 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-zinc-100 transition-colors">
                         <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                            <Camera className="w-6 h-6 text-[#0056b3]" />
                         </div>
                         <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Subir foto del producto</span>
                      </div>

                      <div className="relative">
                         <input 
                            type="text" 
                            placeholder="Nombre del producto estrella"
                            value={formData.productName}
                            onChange={(e) => setFormData({...formData, productName: e.target.value})}
                            className="w-full bg-gray-50 border border-zinc-200 rounded-2xl py-4 px-5 text-sm font-bold text-[#101A3F] focus:outline-none"
                         />
                      </div>

                      <div className="relative">
                         <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                            <DollarSign className="w-4 h-4 text-zinc-400" />
                         </div>
                         <input 
                            type="number" 
                            placeholder="Precio promedio (MXN)"
                            value={formData.price}
                            onChange={(e) => setFormData({...formData, price: e.target.value})}
                            className="w-full bg-gray-50 border border-zinc-200 rounded-2xl py-4 pl-10 pr-5 text-sm font-bold text-[#101A3F] focus:outline-none"
                         />
                      </div>
                   </div>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div 
                key="step4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col gap-6"
              >
                <div>
                   <h3 className="text-[#101A3F] font-black text-[14px]">¿Cuántos caben a la vez?</h3>
                   <div className="grid grid-cols-3 gap-3 mt-4">
                      {[
                        { id: '1-5', label: 'Pequeña cancha' },
                        { id: '6-20', label: 'Cancha mediana' },
                        { id: '20+', label: 'Gran estadio' }
                      ].map(cap => (
                        <button 
                           key={cap.id}
                           onClick={() => setFormData({...formData, capacity: cap.id})}
                           className={`p-3 rounded-2xl flex flex-col items-center gap-1 border transition-all ${
                             formData.capacity === cap.id ? 'border-[#0056b3] bg-blue-50 ring-2 ring-blue-100' : 'border-zinc-100 bg-white'
                           }`}
                        >
                           <span className="text-sm font-black text-[#101A3F]">{cap.id}</span>
                           <span className="text-[8px] font-bold text-zinc-400 text-center leading-tight uppercase tracking-tighter">{cap.label}</span>
                        </button>
                      ))}
                   </div>
                </div>

                <div>
                   <h3 className="text-[#101A3F] font-black text-[14px]">¿Dónde está tu negocio?</h3>
                   <div className="mt-4 relative bg-zinc-100 rounded-3xl h-32 overflow-hidden border border-zinc-200">
                      <div className="absolute inset-0 flex items-center justify-center opacity-30">
                         <Store className="w-12 h-12 text-[#101A3F]" />
                      </div>
                      <div className="absolute bottom-2 right-2 bg-white/80 backdrop-blur-sm px-2 py-1 rounded-lg text-[8px] font-bold text-[#101A3F]">
                         VISTA PREVIA MAPA
                      </div>
                   </div>
                   <div className="mt-4 bg-white border border-green-500/30 p-4 rounded-2xl flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                         <MapPin className="w-4 h-4 text-green-600" />
                      </div>
                      <div className="flex-1">
                         <p className="text-[10px] font-black text-[#101A3F]">{formData.address}</p>
                         <p className="text-[8px] font-bold text-green-600 uppercase">A 250m de Estadio Azteca</p>
                      </div>
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                   </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

        {/* --- BOTTOM NAVIGATION --- */}
        <div className="absolute bottom-0 left-0 w-full p-6 bg-white z-20 flex flex-col gap-3">
          <button 
            onClick={nextStep}
            className="w-full bg-[#0056b3] hover:bg-blue-800 text-white py-4 rounded-2xl flex items-center justify-center gap-2 font-black text-sm transition-all active:scale-[0.98] shadow-lg shadow-blue-500/20"
          >
            {step === 4 ? 'Publicar mi negocio' : 'Siguiente paso'} <ChevronRight className="w-4 h-4" />
          </button>
          
          {step > 1 && (
            <button 
              onClick={prevStep}
              className="w-full text-zinc-400 py-1 font-bold text-[10px] flex items-center justify-center gap-1 hover:text-zinc-600 transition-colors uppercase tracking-widest"
            >
              ← Regresar
            </button>
          )}
        </div>

      </motion.div>
      
      {/* Footer Label */}
      <p className="mt-4 text-[#A19D98] text-[11px] font-bold uppercase tracking-widest">
         Paso {step} — {
           step === 1 ? 'Tu negocio' : 
           step === 2 ? 'Tu jugada' : 
           step === 3 ? 'Tu menú' : 
           step === 4 ? 'Tu cancha' : ''
         }
      </p>

    </div>
  );
}
