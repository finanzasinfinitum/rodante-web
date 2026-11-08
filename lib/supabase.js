import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
// Acepta el nombre nuevo de Supabase (PUBLISHABLE_KEY) o el antiguo (ANON_KEY)
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabaseReady = Boolean(url && key);

// Cliente público (lectura del catálogo y panel de admin con sesión)
export const supabase = supabaseReady ? createClient(url, key) : null;
