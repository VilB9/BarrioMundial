import { useState, useEffect, useRef } from 'react';
import { supabase } from '../api/supabase';
import { getAIRecommendations } from '../api/gemini';
import { MapContainer, ImageOverlay, Marker, Popup, useMap, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
// eslint-disable-next-line no-unused-vars
import { fetchEconomy, earnKeyViaQR } from '../services/economyService';

// Fix typical leaflet marker issue in react
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Helper to recenter map dynamically once
function MapUpdater({ location }) {
  const map = useMap();
  const hasCentered = useRef(false);
  useEffect(() => {
    if (location && !hasCentered.current) {
      hasCentered.current = true;
      // Usar animacion más sutil en live tracking y saltar despues de la primera vez
      map.flyTo(location, map.getZoom(), { animate: true, duration: 0.5 });
    }
  }, [location, map]);
  return null;
}

export default function Map() {
  const [profile, setProfile] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [recommendedStands, setRecommendedStands] = useState([]);
  const [aiLoading, setAiLoading] = useState(true);
  const [activeRoute, setActiveRoute] = useState(null); // [lat, lng] del stand seleccionado
  const [arrivedStand, setArrivedStand] = useState(null); // Estado para detectar si llegaste
  const [economy, setEconomy] = useState({ keys_balance: 0 });

  
  const hasFetchedData = useRef(false);
  const navigate = useNavigate();
  useEffect(() => {
    let watchId;
    
    const initApp = async () => {
      // No login required - we use a guest profile
      const guestProfile = { interests: ['tecnologia', 'innovacion', 'negocios'], role: 'turista' };
      setProfile(guestProfile);

      // Fetch Geolocation LIVE
      if (navigator.geolocation) {
        watchId = navigator.geolocation.watchPosition(
          async (position) => {
            // Coordenada fija del HACKATHON en la Genius Arena
            const loc = [19.363050, -99.262950];
            setUserLocation(loc);
            
            if (!hasFetchedData.current) {
              hasFetchedData.current = true;
              
              // Fetch stands from Supabase
              const { data: realStands } = await supabase
                .from('stands')
                .select('*');
                
              const standsBase = realStands && realStands.length > 0 ? realStands : [];

              const EXPO_MIN_LAT = 19.362900;
              const EXPO_MAX_LAT = 19.363500;
              const EXPO_MIN_LNG = -99.263100;
              const EXPO_MAX_LNG = -99.262400;

              const getHash = (str) => {
                let hash = 0;
                for (let i = 0; i < str.length; i++) {
                  hash = Math.imul(31, hash) + str.charCodeAt(i) | 0;
                }
                return Math.abs(hash);
              };

              const dynamicStands = standsBase.map((s) => {
                const seed = getHash(s.id?.toString() || s.name || 'default');
                const pLat = (seed % 10000) / 10000;
                const pLng = ((seed * 7) % 10000) / 10000;
                return {
                  ...s,
                  location: [
                    EXPO_MIN_LAT + pLat * (EXPO_MAX_LAT - EXPO_MIN_LAT),
                    EXPO_MIN_LNG + pLng * (EXPO_MAX_LNG - EXPO_MIN_LNG)
                  ]
                };
              });

              try {
                const fallbackTimer = setTimeout(() => {
                  setAiLoading(false);
                }, 8000);

                const standsToAnalyze = dynamicStands.slice(0, 25);
                const aiMatches = await getAIRecommendations(guestProfile, loc, standsToAnalyze);
                clearTimeout(fallbackTimer);
                
                const finalStands = dynamicStands.map(s => {
                  const aiResult = aiMatches.find(a => a?.id === s.id) || { score: Math.floor(Math.random() * 30 + 50), reason: "Descubierto por ti" };
                  return { ...s, score: aiResult.score, reason: aiResult.reason };
                });
                
                setRecommendedStands(finalStands);
              } catch (err) {
                console.error(err);
              } finally {
                setAiLoading(false);
              }
            }
          },
          (error) => {
            console.error("GPS Error", error);
            if (!hasFetchedData.current) {
              hasFetchedData.current = true;
              setUserLocation([19.363050, -99.262950]);
              setAiLoading(false);
            }
          },
          { enableHighAccuracy: true, maximumAge: 5000, timeout: 10000 }
        );
      } else {
        setUserLocation([19.363000, -99.262750]);
        setAiLoading(false);
      }
      // Fetch economy for overlay
      fetchEconomy().then(setEconomy).catch(() => {});
    };
    initApp();
    
    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId);
    };
  }, [navigate]);

  const handleLogout = () => {
    navigate('/dashboard');
  };

  // FunciÃ³n Haversine para medir distancia hiper-precisa (en metros)
  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3;
    const p1 = lat1 * Math.PI/180;
    const p2 = lat2 * Math.PI/180;
    const dp = (lat2-lat1) * Math.PI/180;
    const dl = (lon2-lon1) * Math.PI/180;

    const a = Math.sin(dp/2) * Math.sin(dp/2) +
              Math.cos(p1) * Math.cos(p2) *
              Math.sin(dl/2) * Math.sin(dl/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Efecto hiper-preciso: SÃ³lo rastrea si el turista ESTÃ EN RUTA hacia un stand especÃ­fico
  useEffect(() => {
    if (userLocation && activeRoute && activeRoute.location) {
      const distance = getDistance(
        userLocation[0], userLocation[1],
        activeRoute.location[0], activeRoute.location[1]
      );
      
      // Si estÃ¡ a menos de 15 metros del stand al que decidiÃ³ ir
      if (distance <= 15) {
        setArrivedStand(activeRoute); // Lanza la alerta
        setActiveRoute(null); // Apaga la lÃ­nea punteada
      }
    }
  }, [userLocation, activeRoute]);

  // Diseño de Marcador Visible (Alto Contraste)
  const createCustomIcon = (score) => {
    const isRecommended = score >= 94;
    // Colores brillantes para que resalten en el fondo oscuro del mapa
    const baseColor = isRecommended ? '#FFD100' : '#FFFFFF'; 
    const strokeColor = isRecommended ? '#FFFFFF' : '#0033A0'; 
    const dropShadow = 'drop-shadow-[0_0_8px_rgba(255,255,255,0.7)]';
    
    return L.divIcon({
      html: `
        <div class="relative flex items-center justify-center w-8 h-8 ${dropShadow}">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="${baseColor}" stroke="${strokeColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="relative z-10"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3" fill="${strokeColor}"></circle></svg>
          ${isRecommended ? `<div class="absolute -top-1 -right-1 w-3 h-3 bg-[#22C55E] rounded-full border-2 border-white shadow-[0_0_5px_rgba(34,197,94,1)]"></div>` : ''}
        </div>
      `,
      className: 'bg-transparent',
      iconSize: [32, 32],
      iconAnchor: [16, 32]
    });
  };

  const handleRouteTracing = (location) => {
    setActiveRoute(location);
  };

  if (!profile || !userLocation) return (
    <div className="min-h-screen bg-[#F2F1EC] flex flex-col items-center justify-center gap-4 font-sans">
      <Crosshair className="w-12 h-12 text-[#1C36C6] animate-ping" />
      <p className="text-[#1C36C6] text-sm font-semibold tracking-widest uppercase">{"Activando Navegaci\u00f3n..."}</p>
    </div>
  );

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
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-6 bg-[#101A3F] rounded-b-3xl z-[2000] flex items-center justify-center">
           <div className="w-12 h-1.5 bg-zinc-800 rounded-full"></div>
        </div>

        {/* --- NAVAL HEADER (Coppel Connect) --- */}
        <div className="bg-[#0056b3] pt-12 pb-5 px-6 relative z-[1000] w-full shrink-0">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex gap-1">
              <span className="w-2 h-2 rounded-full bg-[#f7e300]"></span>
              <span className="w-2 h-2 rounded-full bg-[#f7e300]"></span>
              <span className="w-2 h-2 rounded-full bg-[#f7e300]"></span>
            </div>
            <h2 className="text-white font-bold text-xs tracking-wide leading-tight uppercase">
              COPPEL CONNECT 2026
              <span className="block text-[8px] opacity-70 font-normal mt-0.5 tracking-[0.2em]">SISTEMA DE NAVEGACI{'\u00d3'}N NAVAL</span>
            </h2>
          </div>

          <div className="flex justify-between items-end mt-4">
            <div>
              <h1 className="text-white text-xl font-black leading-none mb-1 italic uppercase tracking-tighter">
                Mapa Naval
              </h1>
              <p className="text-[#f7e300] text-[10px] font-bold uppercase tracking-widest">
                Genius Arena (Fundaci{'\u00f3'}n Coppel)
              </p>
            </div>
            {/* Overlay Flotante de Llaves */}
            <div className="bg-[#f7e300] border-2 border-[#101A3F] px-4 py-2 rounded-2xl flex flex-col items-center shadow-lg transform rotate-2">
              <div className="flex items-center gap-1">
                <Zap className="w-3 h-3 text-[#0056b3] fill-[#0056b3]" />
                <span className="font-black text-[#0056b3] text-sm leading-none">{economy.keys_balance}</span>
              </div>
              <span className="text-[8px] font-black text-[#0056b3] uppercase">Llaves</span>
            </div>
          </div>
        </div>

        {/* AI Loading HUD overlay - Estilo Corporativo */}
        <AnimatePresence>
          {aiLoading && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, filter: "blur(10px)" }}
              className="absolute inset-0 z-[2000] flex flex-col items-center justify-center bg-white/80 backdrop-blur-md pointer-events-none mt-32"
            >
              <div className="bg-white p-8 rounded-3xl shadow-lg flex flex-col items-center max-w-[80%] text-center border-t-4 border-[#1C36C6]">
                <div className="w-12 h-12 mb-4 relative">
                  <div className="absolute inset-0 border-4 border-zinc-100 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-[#1C36C6] border-t-transparent rounded-full animate-spin"></div>
                </div>
                <h2 className="text-[#1C36C6] font-bold text-sm mb-2">Calculando ruta...</h2>
                <div className="w-full h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[#FFD100] w-1/2 animate-pulse"></div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ALERTA DE LLEGADA / CHECK-IN TIEMPO REAL */}
        <AnimatePresence>
          {arrivedStand && (
            <motion.div 
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="absolute bottom-8 left-1/2 -translate-x-1/2 w-11/12 max-w-sm z-[2500]"
            >
              <div className="bg-white border-4 border-[#FFD100] p-5 rounded-3xl shadow-2xl flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center mb-3 shadow-sm animate-bounce">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-black text-[#1C36C6] tracking-tight mb-1">
                  {'\u00a1Has Llegado!'}
                </h3>
                <button 
                  onClick={async () => {
                    const updated = await earnKeyViaQR(economy);
                    setEconomy(updated);
                    setArrivedStand(null);
                    alert('¡Llave obtenida! 🗝️ Gracias por visitar un negocio de Coppel Emprende.');
                  }}
                  className="w-full bg-[#f7e300] text-[#0056b3] font-black py-4 rounded-xl hover:scale-105 active:scale-95 transition-all shadow-lg flex items-center justify-center gap-2 border-b-4 border-black/10"
                >
                  <Zap className="w-5 h-5 fill-[#0056b3]" />
                  ESCANEAR QR COPPEL ( +1 LLAVE )
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* CONTENIDO INTERACTIVO (MAPA + TARJETAS) */}
        <div className="flex-1 relative flex flex-col bg-white overflow-hidden pb-[70px]">
          
          {/* EL CONTENEDOR DEL MAPA (Ocupa aprox 55-60% del espacio) */}
          <div className="relative w-full h-[60%] shrink-0">
            <MapContainer 
              center={userLocation || [19.3632, -99.2627]} 
              zoom={19} 
              minZoom={17}
              maxZoom={21}
              maxBounds={[
                [19.362700, -99.263300],
                [19.363700, -99.262200]
              ]}
              zoomControl={false}
              className="w-full h-full z-0 bg-[#0c152e]" /* matching el fondo de la expo oscura */
            >
              <MapUpdater location={userLocation} />
              
              <ImageOverlay
                url="/mapa-expo.png"
                bounds={[
                  [19.362900, -99.263100],
                  [19.363500, -99.262400]
                ]}
              />
              
              {/* Ruta Activa */}
              {activeRoute && activeRoute.location && userLocation && (
                <Polyline 
                  positions={[userLocation, activeRoute.location]} 
                  pathOptions={{ 
                    color: '#FFD100', // Amarillo brillante visible
                    weight: 5, 
                    dashArray: '10, 10', 
                    opacity: 1, 
                    lineCap: 'round',
                    lineJoin: 'round'
                  }} 
                />
              )}

              {/* Posici{'\u00f3'}n de Usuario */}
              {userLocation && (
                <Marker 
                  position={userLocation}
                  icon={L.divIcon({
                    html: `
                      <div class="relative flex items-center justify-center w-6 h-6 drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">
                        <div class="absolute w-full h-full rounded-full bg-white opacity-40 animate-ping"></div>
                        <div class="w-4 h-4 bg-[#22C55E] rounded-full border-[3px] border-white shadow-sm relative z-10"></div>
                      </div>
                    `,
                    className: 'bg-transparent',
                    iconSize: [24, 24]
                  })}
                >
                  <Popup><div className="font-bold text-xs text-[#1C36C6]">{'\u00a1Aqu\u00ed est\u00e1s t\u00fa!'}</div></Popup>
                </Marker>
              )}

              {/* Stands Recomendados */}
              {!aiLoading && recommendedStands.filter(s => s.score > 50).slice(0, 15).map((stand) => (
                <Marker 
                  key={stand.id} 
                  position={stand.location}
                  icon={createCustomIcon(stand.score)}
                >
                  <Popup className="custom-popup rounded-2xl overflow-hidden shadow-2xl">
                    <div className="p-2 min-w-[170px]">
                      <div className="flex items-start justify-between gap-1 mb-2">
                        <h3 className="font-black text-xs text-[#1C36C6] leading-tight">{stand.name}</h3>
                        {stand.score >= 94 && <Sparkles className="w-3 h-3 text-[#FFD100] shrink-0" />}
                      </div>
                      <div className="text-[10px] text-zinc-500 mb-2 space-y-0.5 bg-[#F8FAFC] p-1.5 rounded-lg">
                        <p className="font-bold text-zinc-700">{stand.category}</p>
                      </div>
                      <button 
                        onClick={() => handleRouteTracing(stand)}
                        className="w-full flex items-center justify-center gap-1 bg-[#1C36C6] text-white font-bold text-[10px] py-1.5 rounded-lg transition-colors shadow-sm"
                      >
                        <MapPin className="w-3 h-3" /> Trazar
                      </button>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>

            {/* OVERLAY SOBRE EL MAPA (El banner de la parada actual estilo Apple Maps / Screenshot) */}
            <div className="absolute left-0 bottom-[-16px] w-full px-4 z-[1000]">
               <div onClick={() => navigate('/detalle')} className="bg-white rounded-[1.2rem] shadow-[0_8px_30px_rgba(28,54,198,0.2)] border-2 border-[#1C36C6] p-3.5 flex items-center justify-between pointer-events-auto cursor-pointer hover:bg-indigo-50 transition-all scale-100 hover:scale-[1.02]">
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-2xl bg-[#FFD100] text-[#1C36C6] flex items-center justify-center shrink-0 shadow-inner">
                       <Sparkles className="w-5 h-5 fill-[#1C36C6]" />
                     </div>
                     <div>
                       <h3 className="font-black text-[#101A3F] text-xs leading-tight mb-0.5">Pitch: Descubriendo tu Barrio</h3>
                       <p className="text-[9px] text-[#1C36C6] font-bold">Main Stage {'\u00b7'} 09:00 {'\u00b7'} Evento Destacado</p>
                     </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-[#1C36C6]" />
               </div>
            </div>
          </div>

          {/* PARADAS INFERIORES */}
          <div className="pt-9 pb-4 px-6 flex-1 w-full bg-white overflow-hidden flex flex-col justify-center">
            <h3 className="text-[9px] font-black text-zinc-400 tracking-widest uppercase mb-3">
               PR{'\u00d3'}XIMAS PARADAS EN TU RUTA
            </h3>
            
            <div className="flex gap-2.5 overflow-x-auto pb-4 snap-x custom-scrollbar">
              {/* Pitch */}
              <div onClick={() => navigate('/detalle')} className="border border-[#1C36C6] rounded-2xl p-3 min-w-[110px] shrink-0 snap-start bg-[#1C36C6] text-white cursor-pointer shadow-md transform hover:-translate-y-1 transition-transform">
                <h4 className="text-[8px] font-bold text-[#FFD100] uppercase tracking-wider mb-1 flex items-center gap-1"><Zap className="w-3 h-3 fill-[#FFD100]" /> AHORA</h4>
                <p className="font-black text-white text-xs leading-tight mb-0.5">Pitch Proyecto</p>
                <p className="text-[9px] text-indigo-200 font-bold">09:00 {'\u00b7'} Main Stage</p>
              </div>

              {/* Siguiente */}
              <div onClick={() => navigate('/detalle')} className="border border-[#1C36C6]/20 rounded-2xl p-3 min-w-[110px] shrink-0 snap-start bg-[#F8FAFC] cursor-pointer hover:bg-zinc-50">
                <h4 className="text-[8px] font-bold text-[#1C36C6] uppercase tracking-wider mb-1">Siguiente</h4>
                <p className="font-black text-[#101A3F] text-xs leading-tight mb-0.5">Workshop 1</p>
                <p className="text-[9px] text-zinc-500 font-bold">10:00 {'\u00b7'} 8 min</p>
              </div>
              
              {/* Después */}
              <div className="border border-zinc-200 rounded-2xl p-3 min-w-[110px] shrink-0 snap-start bg-white">
                <h4 className="text-[8px] font-bold text-zinc-400 uppercase tracking-wider mb-1">Despu{'\u00e9'}s</h4>
                <p className="font-black text-[#101A3F] text-xs leading-tight mb-0.5">Dev Stage</p>
                <p className="text-[9px] text-zinc-500 font-bold">12:00 {'\u00b7'} 5 min</p>
              </div>

              {/* Más tarde */}
              <div className="border border-zinc-200 rounded-2xl p-3 min-w-[110px] shrink-0 snap-start bg-white">
                <h4 className="text-[8px] font-bold text-zinc-400 uppercase tracking-wider mb-1">M{'\u00e1'}s tarde</h4>
                <p className="font-black text-[#101A3F] text-xs leading-tight mb-0.5">Comidas</p>
                <p className="text-[9px] text-zinc-500 font-bold">13:00 {'\u00b7'} 3 min</p>
              </div>
            </div>
          </div>
        </div>

        {/* --- BOTTOM NAV (Mock) --- */}
        <div className="absolute bottom-0 left-0 w-full h-[70px] bg-white border-t border-zinc-100 grid grid-cols-4 px-2 pb-2 rounded-b-3xl z-[2000]">
          <button onClick={() => navigate('/agenda')} className="flex flex-col items-center justify-center gap-1 text-zinc-400 hover:text-[#1C36C6] transition-colors pt-1">
             <Calendar className="w-5 h-5" strokeWidth={2} />
             <span className="text-[9px] font-semibold">Agenda</span>
          </button>
          <button className="flex flex-col items-center justify-center gap-1 text-[#1C36C6] pt-1">
             <MapIcon className="w-5 h-5" fill="currentColor" strokeWidth={1} />
             <span className="text-[9px] font-bold">Mapa</span>
          </button>
          <button className="flex flex-col items-center justify-center gap-1 text-zinc-400 hover:text-zinc-600 transition-colors pt-1">
             <Bookmark className="w-5 h-5" strokeWidth={2.5} />
             <span className="text-[9px] font-semibold">Guardados</span>
          </button>
          <button onClick={() => navigate('/onboarding-turista')} className="flex flex-col items-center justify-center gap-1 text-zinc-400 hover:text-zinc-600 transition-colors pt-1">
             <User className="w-5 h-5" strokeWidth={2.5} />
             <span className="text-[9px] font-semibold">Perfil</span>
          </button>
        </div>

      </motion.div>
      
      <p className="mt-4 text-[#A19D98] text-[11px] font-bold">
         Mapa con ruta activa
      </p>

      <style>{`
        /* Sobreescribiendo popups de leaflet al estilo Coppel */
        .leaflet-popup-content-wrapper {
          border-radius: 1rem !important;
          box-shadow: 0 4px 20px rgba(0, 51, 160, 0.15) !important;
          padding: 0 !important;
          border: 1px solid #e2e8f0;
        }
        .leaflet-popup-tip {
          background: white !important;
          box-shadow: none !important;
        }
        .leaflet-popup-close-button {
          color: #94a3b8 !important;
          margin-top: 5px !important;
          margin-right: 5px !important;
        }
        .leaflet-control-attribution {
          display: none !important;
        }
      `}</style>
    </div>
  );
}
