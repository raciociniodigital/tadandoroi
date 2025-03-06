
import { createClient } from '@supabase/supabase-js';
import { useAuth } from '@clerk/clerk-react';
import { useEffect, useState } from 'react';
import { supabaseClient, useSupabaseClient } from './supabase';

// Hook para obter os dados do usuário atual
export const useUser = () => {
  const { userId, isLoaded, isSignedIn } = useAuth();
  const supabase = useSupabaseClient();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (isLoaded && isSignedIn && userId) {
        try {
          // Buscar dados do usuário no Supabase
          const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('user_id', userId)
            .single();

          if (error) {
            console.error('Erro ao buscar dados do usuário:', error);
          } else if (data) {
            setUserData(data);
          }
        } catch (error) {
          console.error('Erro ao buscar dados do usuário:', error);
        } finally {
          setIsLoading(false);
        }
      } else if (isLoaded) {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [isLoaded, isSignedIn, userId, supabase]);

  return {
    user: userData,
    isLoading,
    isAuthenticated: isSignedIn,
    userId,
  };
};

// Função para salvar ou atualizar dados do usuário
export const updateUserProfile = async (userId: string, userData: any) => {
  try {
    const { data, error } = await supabaseClient
      .from('users')
      .update(userData)
      .eq('user_id', userId);

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
    return { success: false, error };
  }
};
