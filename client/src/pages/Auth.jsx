import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../api/supabase';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { Map, Briefcase, ChevronRight, User } from 'lucide-react';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('turista'); // 'turista' or 'emprendedor'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        
        // Fetch role
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .single();

        if (profile?.role === 'emprendedor') {
          navigate('/registro-negocio');
        } else {
          navigate('/onboarding-turista');
        }
      } else {
        // Register
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;

        if (data.user) {
          // Insert profile using supabase directly 
          const { error: profileError } = await supabase
            .from('profiles')
            .insert([
              { id: data.user.id, email: email, full_name: fullName, role: role }
            ]);

          if (profileError) throw profileError;

          if (role === 'emprendedor') {
            navigate('/registro-negocio');
          } else {
            navigate('/onboarding-turista');
          }
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bgGlobal flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-coppelYellow/10 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/4"></div>
      <div className="absolute bottom-0 left-0 w-[40rem] h-[40rem] bg-coppelBlue/5 rounded-full blur-[100px] pointer-events-none translate-y-1/4 -translate-x-1/4"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md z-10"
      >
        <div className="bg-white border border-zinc-100 p-8 rounded-[2rem] shadow-coppel-strong relative overflow-hidden">
          
          {/* Header decorativo Coppel superior */}
          <div className="absolute top-0 left-0 w-full flex">
            <div className="h-1.5 flex-1 bg-coppelYellow"></div>
            <div className="h-1.5 flex-[3] bg-coppelBlue"></div>
          </div>

          <div className="text-center mb-8 mt-2">
            <h2 className="text-sm font-bold tracking-widest text-zinc-400 uppercase mb-2">{"Fundaci\u00f3n Coppel"}</h2>
            <h1 className="text-3xl font-black tracking-tight text-coppelBlue mb-1">
              Descubriendo tu Barrio
            </h1>
            <p className="text-zinc-500 font-medium">Plataforma Phygital Mundial 2026</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 font-medium p-3 rounded-xl mb-6 text-sm text-center shadow-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-5">
            
            {!isLogin && (
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-coppelBlue mb-1.5">Nombre Completo</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 h-5 w-5" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-3 pl-10 pr-4 text-zinc-800 focus:outline-none focus:border-coppelBlue focus:ring-2 focus:ring-coppelBlue/20 transition-all shadow-sm"
                      placeholder={"Juan P\u00e9rez"}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-coppelBlue mb-3">Selecciona tu Rol</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setRole('turista')}
                      className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all ${
                        role === 'turista' 
                          ? 'border-coppelBlue bg-coppelBlueLight text-coppelBlue shadow-sm' 
                          : 'border-zinc-100 bg-zinc-50 text-zinc-400 hover:border-zinc-200'
                      }`}
                    >
                      <Map className="mb-2 h-6 w-6" />
                      <span className="text-sm font-bold">Turista</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole('emprendedor')}
                      className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all ${
                        role === 'emprendedor' 
                          ? 'border-coppelBlue bg-coppelBlueLight text-coppelBlue shadow-sm' 
                          : 'border-zinc-100 bg-zinc-50 text-zinc-400 hover:border-zinc-200'
                      }`}
                    >
                      <Briefcase className="mb-2 h-6 w-6" />
                      <span className="text-sm font-bold">Emprendedor</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-coppelBlue mb-1.5">{"Correo Electr\u00f3nico"}</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-3 px-4 text-zinc-800 focus:outline-none focus:border-coppelBlue focus:ring-2 focus:ring-coppelBlue/20 transition-all shadow-sm"
                placeholder="correo@ejemplo.com"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-coppelBlue mb-1.5">{"Contrase\u00f1a"}</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-3 px-4 text-zinc-800 focus:outline-none focus:border-coppelBlue focus:ring-2 focus:ring-coppelBlue/20 transition-all shadow-sm"
                placeholder={'\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022'}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-coppelBlue text-white font-black py-4 px-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-[#002B88] hover:shadow-coppel transition-all mt-6 disabled:opacity-50"
            >
              {loading ? 'Procesando...' : isLogin ? 'Iniciar Sesi\u00f3n' : 'Crear Cuenta'}
              {!loading && <ChevronRight className="h-5 w-5" />}
            </button>

          </form>

          <div className="mt-8 text-center border-t border-zinc-100 pt-6">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError(null);
              }}
              className="text-coppelBlue font-bold hover:text-coppelYellow transition-colors text-sm underline decoration-coppelBlue/30 underline-offset-4"
            >
              {isLogin ? '\u00bfNo tienes cuenta? Reg\u00edstrate aqu\u00ed' : '\u00bfYa tienes cuenta? Inicia sesi\u00f3n'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
