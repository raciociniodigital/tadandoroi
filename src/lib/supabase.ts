
import { createClient } from '@supabase/supabase-js';

// You need to add these environment variables to your deployment
const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY';

// Create a singleton Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// This function will be used to set the auth token for Supabase
export const setSupabaseToken = async (token: string | null) => {
  if (token) {
    supabase.auth.setSession({
      access_token: token,
      refresh_token: '',
    });
  } else {
    // Clear the session if there's no token
    supabase.auth.signOut();
  }
};
