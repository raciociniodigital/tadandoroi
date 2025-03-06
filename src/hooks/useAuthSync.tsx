
import { useEffect, useState } from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { syncSupabaseAuth } from '@/utils/authUtils';

export const useAuthSync = () => {
  const { isSignedIn, userId } = useAuth();
  const { user } = useUser();
  const { toast } = useToast();
  const [isSynced, setIsSynced] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    let isMounted = true;
    
    const syncUserData = async () => {
      if (!isSignedIn || !userId || !user) {
        if (isMounted) {
          setIsSynced(false);
          setIsSyncing(false);
        }
        return;
      }
      
      if (isSyncing) return; // Evita múltiplas sincronizações simultâneas
      
      if (isMounted) {
        setIsSyncing(true);
      }
      
      try {
        // Primeiro, certifica-se de que a autenticação está sincronizada
        console.log('useAuthSync: Sincronizando autenticação...');
        
        const authSynced = await syncSupabaseAuth();
        
        if (!authSynced) {
          console.error('useAuthSync: Falha ao sincronizar autenticação');
          if (isMounted) {
            setIsSynced(false);
            setIsSyncing(false);
          }
          
          // Tenta uma vez mais após um curto atraso
          setTimeout(async () => {
            if (!isMounted) return;
            
            console.log('useAuthSync: Tentando sincronizar novamente...');
            const retrySuccess = await syncSupabaseAuth();
            
            if (!retrySuccess) {
              console.error('useAuthSync: Falha na sincronização mesmo após retry');
              if (isMounted) {
                setIsSynced(false);
                setIsSyncing(false);
              }
              return;
            }
            
            if (isMounted) {
              await createOrUpdateUser();
            }
          }, 1500);
          
          return;
        }
        
        if (isMounted) {
          await createOrUpdateUser();
        }
      } catch (error) {
        console.error('useAuthSync: Erro ao sincronizar dados do usuário:', error);
        if (isMounted) {
          setIsSynced(false);
          setIsSyncing(false);
        }
      }
    };
    
    const createOrUpdateUser = async () => {
      try {
        // Obtém o endereço de email principal
        const email = user?.emailAddresses?.[0]?.emailAddress;
        
        if (!email) {
          console.error('useAuthSync: Usuário não possui endereço de email');
          if (isMounted) {
            setIsSynced(false);
            setIsSyncing(false);
          }
          return;
        }
        
        // Verifica se o usuário existe no Supabase
        const { data: existingUser, error: fetchError } = await supabase
          .from('users')
          .select('*')
          .eq('user_id', userId)
          .maybeSingle();
        
        if (fetchError) {
          console.error('useAuthSync: Erro ao verificar usuário:', fetchError);
          if (isMounted) {
            setIsSynced(false);
            setIsSyncing(false);
          }
          return;
        }
        
        if (!existingUser) {
          // Cria usuário se não existir
          console.log('useAuthSync: Criando novo usuário no Supabase');
          
          // Usando RPC para chamar função que ignora RLS
          const { error: insertError } = await supabase.rpc('create_user', {
            user_id_param: userId,
            email_param: email
          });
          
          if (insertError) {
            console.error('useAuthSync: Erro ao criar usuário no Supabase:', insertError);
            toast({
              title: "Erro ao sincronizar usuário",
              description: "Não foi possível criar seu perfil no banco de dados.",
              variant: "destructive",
            });
            if (isMounted) {
              setIsSynced(false);
              setIsSyncing(false);
            }
            return;
          }
          
          console.log('useAuthSync: Usuário criado com sucesso no Supabase');
        } else {
          console.log('useAuthSync: Usuário já existe no Supabase');
        }
        
        if (isMounted) {
          setIsSynced(true);
          setIsSyncing(false);
        }
      } catch (error) {
        console.error('useAuthSync: Erro ao criar/atualizar usuário:', error);
        if (isMounted) {
          setIsSynced(false);
          setIsSyncing(false);
        }
      }
    };
    
    syncUserData();
    
    // Configura timer para sincronizar periodicamente
    const syncInterval = setInterval(() => {
      if (isSignedIn && userId) {
        syncUserData();
      }
    }, 30 * 60 * 1000); // A cada 30 minutos
    
    return () => {
      isMounted = false;
      clearInterval(syncInterval);
    };
  }, [isSignedIn, userId, user, toast]);

  return { 
    isSignedIn, 
    userId, 
    isSynced,
    resync: async () => {
      setIsSyncing(true);
      try {
        const success = await syncSupabaseAuth();
        setIsSynced(success);
        return success;
      } catch (error) {
        console.error('Erro ao ressincronizar:', error);
        setIsSynced(false);
        return false;
      } finally {
        setIsSyncing(false);
      }
    }
  };
};
