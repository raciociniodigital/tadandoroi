
import { useEffect, useState } from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { syncSupabaseAuth } from '@/utils/supabaseAuth';

export const useAuthSync = () => {
  const { isSignedIn, userId } = useAuth();
  const { user } = useUser();
  const { toast } = useToast();
  const [isSynced, setIsSynced] = useState(false);

  useEffect(() => {
    const syncUserData = async () => {
      if (!isSignedIn || !userId || !user) {
        setIsSynced(false);
        return;
      }
      
      try {
        // First, make sure authentication is synced
        const authSynced = await syncSupabaseAuth();
        
        if (!authSynced) {
          console.error('Falha ao sincronizar autenticação com Supabase');
          setIsSynced(false);
          return;
        }
        
        // Get the primary email address
        const email = user.emailAddresses?.[0]?.emailAddress;
        
        if (!email) {
          console.error('Usuário não possui endereço de email');
          setIsSynced(false);
          return;
        }
        
        // Check if user exists in Supabase
        const { data: existingUser, error: fetchError } = await supabase
          .from('users')
          .select('*')
          .eq('user_id', userId)
          .maybeSingle();
        
        if (fetchError) {
          console.error('Erro ao verificar usuário:', fetchError);
          setIsSynced(false);
          return;
        }
        
        if (!existingUser) {
          // Create user if doesn't exist
          console.log('Criando novo usuário no Supabase');
          
          // Using RPC to call function that bypasses RLS
          const { error: insertError } = await supabase.rpc('create_user', {
            user_id_param: userId,
            email_param: email
          });
          
          if (insertError) {
            console.error('Erro ao criar usuário no Supabase:', insertError);
            toast({
              title: "Erro ao sincronizar usuário",
              description: "Não foi possível criar seu perfil no banco de dados.",
              variant: "destructive",
            });
            setIsSynced(false);
            return;
          }
          
          console.log('Usuário criado com sucesso no Supabase');
        } else {
          console.log('Usuário já existe no Supabase');
        }
        
        setIsSynced(true);
      } catch (error) {
        console.error('Erro ao sincronizar dados do usuário:', error);
        setIsSynced(false);
      }
    };
    
    syncUserData();
  }, [isSignedIn, userId, user, toast]);

  return { isSignedIn, userId, isSynced };
};
