
import { useAuth as useClerkAuth } from '@clerk/clerk-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useAuth = () => {
  const { isLoaded, isSignedIn, userId } = useClerkAuth();
  const [supabaseReady, setSupabaseReady] = useState(false);

  // Configura o Supabase com o token JWT do Clerk quando o estado de autenticação muda
  useEffect(() => {
    const setupSupabase = async () => {
      if (isLoaded) {
        try {
          setSupabaseReady(true);
        } catch (error) {
          console.error('Erro ao configurar autenticação do Supabase:', error);
          setSupabaseReady(false);
        }
      }
    };

    setupSupabase();
  }, [isLoaded, isSignedIn, userId]);

  return {
    isLoaded,
    isSignedIn,
    userId,
    supabaseReady,
  };
};
