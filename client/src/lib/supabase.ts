import { createClient } from '@supabase/supabase-js';

// For Replit, we'll fetch config from backend or use window globals
// The backend will inject these into the HTML or provide via API
const supabaseUrl = (window as any).SUPABASE_URL || '';
const supabaseAnonKey = (window as any).SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not found. They will be injected by the server.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
