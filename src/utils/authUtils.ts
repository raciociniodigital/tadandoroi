
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@clerk/clerk-react';

// Declaração global para o tipo do Clerk na janela
declare global {
  interface Window {
    Clerk?: {
      session?: {
        id?: string;
        getToken: (options: { template: string }) => Promise<string>;
      };
    };
  }
}

/**
 * Sincroniza a autenticação entre Clerk e Supabase
 * Retorna true se for bem-sucedido, false caso contrário
 */
export const syncSupabaseAuth = async (): Promise<boolean> => {
  try {
    // Verifica se estamos em um navegador
    if (typeof window === 'undefined') {
      console.log('Não estamos em um navegador');
      return false;
    }

    // Obtém a sessão do Clerk
    if (!window.Clerk || !window.Clerk.session) {
      console.log('Sessão do Clerk não está disponível');
      return false;
    }

    // Obtém o token JWT com o template do Supabase
    const token = await window.Clerk.session.getToken({ template: 'supabase' });
    
    if (!token) {
      console.log('Não foi possível obter o token JWT do Clerk');
      return false;
    }
    
    // Define a sessão do Supabase com o token JWT
    const { error } = await supabase.auth.setSession({
      access_token: token,
      refresh_token: '',
    });
    
    if (error) {
      console.error('Erro ao definir a sessão do Supabase:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Erro ao sincronizar autenticação:', error);
    return false;
  }
};

/**
 * Obtém o ID do usuário autenticado no formato adequado para o Supabase
 * a partir da sessão do Clerk
 */
export const getAuthUserId = (): string | null => {
  try {
    if (typeof window === 'undefined' || !window.Clerk || !window.Clerk.session) {
      return null;
    }
    
    return window.Clerk.session.id || null;
  } catch (error) {
    console.error('Erro ao obter ID do usuário:', error);
    return null;
  }
};

/**
 * Obtém o token JWT do Clerk para Supabase
 */
export const getClerkToken = async (): Promise<string | null> => {
  try {
    if (typeof window === 'undefined' || !window.Clerk || !window.Clerk.session) {
      return null;
    }
    
    return await window.Clerk.session.getToken({ template: 'supabase' });
  } catch (error) {
    console.error('Erro ao obter token do Clerk:', error);
    return null;
  }
};

/**
 * Define o token JWT do Supabase
 */
export const setSupabaseToken = async (token: string): Promise<boolean> => {
  try {
    const { error } = await supabase.auth.setSession({
      access_token: token,
      refresh_token: '',
    });
    
    if (error) {
      console.error('Erro ao definir a sessão do Supabase:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Erro ao definir token do Supabase:', error);
    return false;
  }
};

/**
 * Hook personalizado para obter o token JWT para Supabase
 * Não use diretamente - Use syncSupabaseAuth em vez disso
 */
export const useSupabaseToken = () => {
  const { getToken } = useAuth();
  
  const getSupabaseToken = async () => {
    try {
      return await getToken({ template: 'supabase' });
    } catch (error) {
      console.error('Erro ao obter token do Supabase:', error);
      return null;
    }
  };
  
  return { getSupabaseToken };
};
