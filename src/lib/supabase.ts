import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Check if we're in production without env vars (show warning, don't crash)
const isMissingConfig = !supabaseUrl || !supabaseAnonKey;

if (isMissingConfig) {
  console.warn(
    '⚠️ Supabase environment variables are missing. ' +
    'Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your environment. ' +
    'Auth and database features will not work.'
  );
}

// Create a mock client or real client depending on config
let supabase: SupabaseClient;

if (isMissingConfig) {
  // Create a dummy client with placeholder values to prevent crashes
  // This allows the UI to render even without backend
  supabase = createClient(
    'https://placeholder.supabase.co',
    'placeholder-key',
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    }
  );
} else {
  // Real client with proper configuration
  supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storageKey: 'wordbuddy-auth',
    },
  });
  console.log('✅ Supabase client initialized');
}

export { supabase, isMissingConfig };