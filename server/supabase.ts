import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseServiceKey) {
  console.warn('Supabase credentials not configured. Please set SUPABASE_URL and SUPABASE_SERVICE_KEY environment variables.');
}

// Server-side Supabase client with service role key for admin operations
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// Public configuration for frontend (safe to expose)
export const supabaseConfig = {
  url: supabaseUrl,
  anonKey: process.env.SUPABASE_ANON_KEY || '',
};
