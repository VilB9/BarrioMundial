import { createClient } from '@supabase/supabase-js';

// In a real scenario, this would come from environment variables.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ssvilevfzsqybgerjncn.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';

export const supabase = createClient(supabaseUrl, supabaseKey);

// We will simulate a user session using localStorage UUID
const getUserId = () => {
    let id = localStorage.getItem('coppel_user_id');
    if (!id) {
        id = crypto.randomUUID();
        localStorage.setItem('coppel_user_id', id);
    }
    return id;
};

export const fetchEconomy = async () => {
    const userId = getUserId();
    const { data, error } = await supabase
        .from('user_economy')
        .select('*')
        .eq('user_id', userId)
        .single();
    
    // HACKATHON GOD MODE: Si falla Supabase o no hay fondos, inyectamos crédito infinito virtual
    const demoData = { 
        user_id: userId, 
        daily_uses: 0, 
        coins_balance: 99, 
        keys_balance: 99,
        referral_code: 'COP-' + userId.split('-')[0].toUpperCase()
    };

    if (error && error.code === 'PGRST116') {
        const { data: newData } = await supabase
            .from('user_economy')
            .insert([demoData])
            .select()
            .single();
        return newData || demoData;
    }
    
    if (error) return demoData;
    
    // Asegurar que tenga un referral_code si es null
    if (!data.referral_code) {
        data.referral_code = 'COP-' + userId.split('-')[0].toUpperCase();
    }
    
    return data;
};

export const deductUsage = async (currentEconomy) => {
    const userId = getUserId();
    
    // 1. Try to use daily limit
    if (currentEconomy.daily_uses > 0) {
        const { data, error } = await supabase
            .from('user_economy')
            .update({ daily_uses: currentEconomy.daily_uses - 1 })
            .eq('user_id', userId)
            .select()
            .single();
        if (error) throw error;
        return data;
    }

    // 2. Or try to use coins (3 coins per usage)
    if (currentEconomy.coins_balance >= 3) {
        const { data, error } = await supabase
            .from('user_economy')
            .update({ coins_balance: currentEconomy.coins_balance - 3 })
            .eq('user_id', userId)
            .select()
            .single();
        if (error) throw error;
        return data;
    }
    
    throw new Error('Cancha Justa');
};

export const deductTemplateUsage = async (currentEconomy) => {
    const userId = getUserId();
    
    if (currentEconomy.coins_balance >= 2) {
        const { data, error } = await supabase
            .from('user_economy')
            .update({ coins_balance: currentEconomy.coins_balance - 2 })
            .eq('user_id', userId)
            .select()
            .single();
        if (error) throw error;
        return data;
    }
    
    throw new Error('Sin Monedas');
};

export const deductVisualUsage = async (currentEconomy) => {
    const userId = getUserId();
    
    if (currentEconomy.coins_balance >= 5) {
        const { data, error } = await supabase
            .from('user_economy')
            .update({ coins_balance: currentEconomy.coins_balance - 5 })
            .eq('user_id', userId)
            .select()
            .single();
        if (error) throw error;
        return data;
    }
    
    throw new Error('Saldo insuficiente para Arte Visual');
};

export const deductRegenerateUsage = async (currentEconomy) => {
    const userId = getUserId();
    
    if (currentEconomy.coins_balance >= 2) {
        const { data, error } = await supabase
            .from('user_economy')
            .update({ coins_balance: currentEconomy.coins_balance - 2 })
            .eq('user_id', userId)
            .select()
            .single();
        if (error) throw error;
        return data;
    }
    
    throw new Error('Saldo insuficiente para regenerar');
};

export const redeemInvitationCode = async (currentEconomy, code) => {
    const userId = getUserId();
    
    if (!code || code.length < 4) throw new Error('Código inválido');
    
    // Simulación para el Hackathon: cualquier código de 6+ caracteres da 15 llaves
    const rewardKeys = 15;
    
    const { data, error } = await supabase
        .from('user_economy')
        .update({ keys_balance: currentEconomy.keys_balance + rewardKeys })
        .eq('user_id', userId)
        .select()
        .single();
        
    if (error) {
        // Fallback local si Supabase falla
        return { ...currentEconomy, keys_balance: currentEconomy.keys_balance + rewardKeys };
    }
    
    return data;
};

export const godModeRefill = async () => {
    const userId = getUserId();
    const { data, error } = await supabase
        .from('user_economy')
        .update({ coins_balance: 100, keys_balance: 20, daily_uses: 10 })
        .eq('user_id', userId)
        .select()
        .single();
    
    if (error) return { coins_balance: 100, keys_balance: 20, daily_uses: 10 };
    return data;
};
export const earnKeyViaQR = async (currentEconomy) => {
    const userId = getUserId();
    const { data, error } = await supabase
        .from('user_economy')
        .update({ keys_balance: currentEconomy.keys_balance + 1 })
        .eq('user_id', userId)
        .select()
        .single();
    
    if (error) return { ...currentEconomy, keys_balance: currentEconomy.keys_balance + 1 };
    return data;
};
