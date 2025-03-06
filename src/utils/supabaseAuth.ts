
import { supabase } from '@/integrations/supabase/client';

/**
 * Sets the Supabase auth token using the current user's session
 * This allows us to use Clerk's authentication with Supabase's RLS
 */
export const setSupabaseToken = async (token: string | null) => {
  try {
    if (token) {
      console.log('Configurando sessão do Supabase com token JWT do Clerk');
      
      // Set the auth token in Supabase
      const { data, error } = await supabase.auth.setSession({
        access_token: token,
        refresh_token: '',
      });
      
      if (error) {
        console.error('Erro ao definir sessão do Supabase:', error);
        return false;
      }
      
      console.log('Sessão do Supabase definida com sucesso');
      return true;
    } else {
      // Clear the auth session if no token
      console.log('Removendo sessão do Supabase');
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
    if (typeof window !== 'undefined') {
      if (!window.Clerk) {
        console.log('Clerk não está disponível no navegador');
        return null;
      }
      
      if (!window.Clerk.session) {
        console.log('Não há sessão do Clerk ativa');
        return null;
      }
      
      console.log('Obtendo token do Clerk...');
      const token = await window.Clerk.session.getToken({ template: 'supabase' });
      
      if (!token) {
        console.log('Token do Clerk não encontrado');
        return null;
      }
      
      console.log('Token do Clerk obtido com sucesso');
      return token;
    }
    
    console.log('Clerk não está disponível (não no navegador)');
    return null;
  } catch (error) {
    console.error('Erro ao obter token do Clerk:', error);
    return null;
  }
};

/**
 * Synchronizes Clerk authentication with Supabase
 * Returns true if successful, false otherwise
 */
export const syncSupabaseAuth = async () => {
  try {
    console.log('Sincronizando autenticação com Supabase...');
    
    // Get token from Clerk
    const token = await getClerkToken();
    
    if (!token) {
      console.log('Sem token do Clerk, limpando sessão do Supabase');
      await setSupabaseToken(null);
      return false;
    }
    
    // Set token in Supabase
    const success = await setSupabaseToken(token);
    
    if (success) {
      console.log('Autenticação com Supabase sincronizada com sucesso');
      return true;
    } else {
      console.error('Falha ao sincronizar autenticação com Supabase');
      return false;
    }
  } catch (error) {
    console.error('Erro ao sincronizar autenticação:', error);
    return false;
  }
};

// Add type declaration for Clerk
declare global {
  interface Window {
    Clerk?: {
      session?: {
        getToken: (options: { template: string }) => Promise<string | null>;
      };
    };
  }
}
