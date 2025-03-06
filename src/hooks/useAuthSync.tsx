
import { useEffect } from 'react';
import { useAuth as useClerkAuth, useUser } from '@clerk/clerk-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { setSupabaseToken, getClerkToken } from '@/utils/supabaseAuth';

export const useAuthSync = () => {
  const { isSignedIn, userId } = useClerkAuth();
  const { user } = useUser();
  const { toast } = useToast();

  useEffect(() => {
    const syncAuth = async () => {
      if (!isSignedIn || !userId) {
        console.log('useAuthSync: Usuário não autenticado, pulando sincronização');
        return;
      }
      
      console.log('useAuthSync: Sincronizando autenticação para o usuário', userId);
      
      try {
        // Obter token JWT do Clerk
        const token = await getClerkToken();
        
        if (!token) {
          console.error('useAuthSync: Não foi possível obter o token do Clerk');
          return;
        }
        
        // Configurar sessão de autenticação do Supabase com o token do Clerk
        const success = await setSupabaseToken(token);
        
        if (!success) {
          console.error('useAuthSync: Falha ao definir o token de autenticação do Supabase');
          return;
        }
        
        console.log('useAuthSync: Token do Supabase configurado com sucesso');
        
        // Sincronizar dados do usuário, se necessário
        if (user?.emailAddresses?.[0]?.emailAddress) {
          // Verificar se o usuário existe no Supabase
          const { data: existingUser, error: fetchError } = await supabase
            .from('users')
            .select('*')
            .eq('user_id', userId)
            .maybeSingle();

          if (fetchError) {
            console.error('Erro ao verificar usuário:', fetchError);
            return;
          }

          // Se o usuário não existir, criar um novo registro
          if (!existingUser) {
            console.log('useAuthSync: Criando novo usuário no Supabase');
            // Usando rpc para chamar função que ignora RLS
            const { error: insertError } = await supabase.rpc('create_user', {
              user_id_param: userId,
              email_param: user.emailAddresses[0].emailAddress
            });

            if (insertError) {
              console.error('Erro ao criar usuário no Supabase:', insertError);
              toast({
                title: "Erro ao sincronizar usuário",
                description: "Não foi possível sincronizar seu usuário com o banco de dados.",
                variant: "destructive",
              });
            } else {
              console.log('useAuthSync: Usuário sincronizado com sucesso');
            }
          } else {
            console.log('useAuthSync: Usuário já existe no Supabase');
          }
        }
      } catch (error) {
        console.error('Erro na sincronização do usuário:', error);
      }
    };

    syncAuth();
  }, [isSignedIn, userId, user, toast]);

  return { isSignedIn, userId };
};
