
import { createClient } from '@supabase/supabase-js';
import { useAuth } from '@clerk/clerk-react';
import { useState, useEffect } from 'react';

// Supabase URL e anon key são públicas, portanto podem ser expostas no cliente
const supabaseUrl = 'https://mzmckyvgrwfsdyxflupl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im16bWNreXZncndmc2R5eGZsdXBsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDMxNzAyMTcsImV4cCI6MjAxODc0NjIxN30.T9RvmHkK9nrQTf8BrZs5Xtsd5ZlbPDDz5LtdUeRHC1s';

// Cria o cliente do Supabase básico (não autenticado)
export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);

// Hook personalizado para obter um cliente do Supabase autenticado com o token do Clerk
export const useSupabaseClient = () => {
  const { getToken } = useAuth();
  const [client, setClient] = useState(supabaseClient);

  useEffect(() => {
    const setupClient = async () => {
      try {
        // Obter o token JWT do Clerk
        const token = await getToken({ template: 'supabase' });
        
        if (token) {
          // Criar um novo cliente com o token do usuário
          const authenticatedClient = createClient(supabaseUrl, supabaseAnonKey, {
            global: {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          });
          
          setClient(authenticatedClient);
        }
      } catch (error) {
        console.error('Erro ao configurar o cliente Supabase:', error);
      }
    };

    setupClient();
  }, [getToken]);

  return client;
};

// Hook para sincronizar o usuário do Clerk com o Supabase
export const useSyncUser = () => {
  const { userId, user } = useAuth();
  const supabase = useSupabaseClient();

  useEffect(() => {
    const syncUser = async () => {
      if (!userId || !user) return;

      try {
        // Verificar se o usuário já existe
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('user_id', userId)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Erro ao verificar usuário:', error);
          return;
        }

        // Se o usuário não existir, inserir no Supabase
        if (!data) {
          const { error: insertError } = await supabase
            .from('users')
            .insert([
              {
                user_id: userId,
                email: user.primaryEmailAddress?.emailAddress,
                nome: `${user.firstName} ${user.lastName || ''}`.trim(),
              },
            ]);

          if (insertError) {
            console.error('Erro ao inserir usuário:', insertError);
          }
        }
      } catch (error) {
        console.error('Erro ao sincronizar usuário:', error);
      }
    };

    syncUser();
  }, [userId, user, supabase]);
};

// Função auxiliar para obter o ID do usuário atual
export const getCurrentUserId = async () => {
  const { getToken } = useAuth();
  const token = await getToken({ template: 'supabase' });
  
  if (!token) return null;
  
  // Decodificar o token JWT para obter o sub (subject) que é o ID do usuário
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    const payload = JSON.parse(jsonPayload);
    return payload.sub;
  } catch (error) {
    console.error('Erro ao decodificar token:', error);
    return null;
  }
};
