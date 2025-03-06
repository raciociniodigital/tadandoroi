
import { supabase } from '@/integrations/supabase/client';

/**
 * Sets the Supabase auth token using the current user's session
 * This allows us to use Clerk's authentication with Supabase's RLS
 */
export const setSupabaseToken = async (token: string | null) => {
  if (token) {
    // Set the auth token in Supabase
    await supabase.auth.setSession({
      access_token: token,
      refresh_token: '',
    });
    return true;
  } else {
    // Clear the auth session if no token
    await supabase.auth.signOut();
    return false;
  }
};

/**
 * Gets the active session JWT token from Clerk
 */
export const getClerkToken = async () => {
  try {
    // This requires the window object, so we need to check if we're in a browser
    if (typeof window !== 'undefined' && window.Clerk) {
      const token = await window.Clerk.session?.getToken({ template: 'supabase' });
      return token;
    }
    return null;
  } catch (error) {
    console.error('Error getting Clerk token:', error);
    return null;
  }
};

// Add type declaration for Clerk
declare global {
  interface Window {
    Clerk: any;
  }
}
