
import { useEffect } from 'react';
import { useAuth as useClerkAuth, useUser } from '@clerk/clerk-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const useAuthSync = () => {
  const { isSignedIn, userId } = useClerkAuth();
  const { user } = useUser();

  useEffect(() => {
    if (isSignedIn && userId && user?.emailAddresses?.[0]?.emailAddress) {
      const syncUser = async () => {
        try {
          // Verificar se o usuário já existe no Supabase
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
            const { error: insertError } = await supabase
              .from('users')
              .insert([
                {
                  user_id: userId,
                  email: user.emailAddresses[0].emailAddress
                }
              ]);

            if (insertError) {
              console.error('Erro ao criar usuário no Supabase:', insertError);
              toast({
                title: 'Erro ao sincronizar usuário',
                description: 'Não foi possível sincronizar seu usuário com o banco de dados.',
                variant: 'destructive',
              });
            } else {
              console.log('Usuário sincronizado com sucesso');
            }
          }
        } catch (error) {
          console.error('Erro na sincronização do usuário:', error);
        }
      };

      syncUser();
    }
  }, [isSignedIn, userId, user]);

  return { isSignedIn, userId };
};
