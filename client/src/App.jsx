import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Map from './pages/Map';
import TuristaOnboarding from './pages/TuristaOnboarding';
import Agenda from './pages/Agenda';
import StandDetail from './pages/StandDetail';
import Dashboard from './pages/Dashboard';
import FidelityHub from './pages/FidelityHub';
import AdGenerator from './pages/AdGenerator';
import MerchantRegistration from './pages/MerchantRegistration';
import ActivityComplete from './pages/ActivityComplete';
import { createClient } from '@supabase/supabase-js';
import ChatbotCoppelito from './pages/ChatbotCoppelito';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ssvilevfzsqybgerjncn.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function App() {
  const [session, setSession] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [role, setRole] = React.useState(null);

  React.useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchRole(session.user.id);
      else setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) fetchRole(session.user.id);
      else {
        setRole(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchRole = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();
      if (data) setRole(data.role);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return null; // Or a Coppel themed loader

  return (
    <Router>
      <Routes>
        <Route path="/" element={
          !session ? <Navigate to="/dashboard" /> : 
          role === 'turista' ? <Navigate to="/mapa-naval" /> : 
          <Navigate to="/vendedor-dashboard" />
        } />
        <Route path="/onboarding-turista" element={<TuristaOnboarding />} />
        <Route path="/mapa-naval" element={<Map />} />
        <Route path="/agenda" element={<Agenda />} />
        <Route path="/detalle/:id?" element={<StandDetail />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/fidelity" element={<FidelityHub />} />
        <Route path="/ad-generator" element={<AdGenerator />} />
        <Route path="/vendedor-dashboard" element={<ChatbotCoppelito />} />
        <Route path="/completada" element={<ActivityComplete />} />
        <Route path="/registro-comerciante" element={<MerchantRegistration />} />
        <Route path="/registro-negocio" element={<MerchantRegistration />} />
        <Route path="/chatbot" element={<ChatbotCoppelito />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}