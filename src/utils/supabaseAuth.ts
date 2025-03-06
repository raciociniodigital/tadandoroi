
import { supabase } from '@/integrations/supabase/client';

/**
 * Sets the Supabase auth token using the current user's session
 * This allows us to use Clerk's authentication with Supabase's RLS
 */
export const setSupabaseToken = async (token: string | null) => {
  try {
    if (token) {
      // Set the auth token in Supabase
      const { data, error } = await supabase.auth.setSession({
        access_token: token,
        refresh_token: '',
      });
      
      if (error) {
        console.error('Erro ao definir sessão do Supabase:', error);
        return false;
      }
      
      console.log('Sessão do Supabase definida com sucesso', data);
      return true;
    } else {
      // Clear the auth session if no token
      await supabase.auth.signOut();
      return false;
    }
  } catch (error) {
    console.error('Erro ao definir token do Supabase:', error);
    return false;
  }
};

/**
 * Gets the active session JWT token from Clerk
 */
export const getClerkToken = async () => {
  try {
    // This requires the window object, so we need to check if we're in a browser
    if (typeof window !== 'undefined' && window.Clerk && window.Clerk.session) {
      console.log('Obtendo token do Clerk...');
      const token = await window.Clerk.session.getToken({ template: 'supabase' });
      console.log('Token do Clerk obtido:', token ? 'Token válido' : 'Token não encontrado');
      return token;
    }
    console.log('Clerk não está disponível ou não possui sessão');
    return null;
  } catch (error) {
    console.error('Erro ao obter token do Clerk:', error);
    return null;
  }
};

// Add type declaration for Clerk
declare global {
  interface Window {
    Clerk: any;
  }
}
