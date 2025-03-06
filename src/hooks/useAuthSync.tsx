
import { useEffect } from 'react';
import { useAuth as useClerkAuth, useUser } from '@clerk/clerk-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { setSupabaseToken, getClerkToken } from '@/utils/supabaseAuth';

export const useAuthSync = () => {
  const { isSignedIn, userId } = useClerkAuth();
  const { user } = useUser();

  useEffect(() => {
    const syncAuth = async () => {
      if (isSignedIn && userId) {
        try {
          // Get JWT token from Clerk
          const token = await getClerkToken();
          
          // Set Supabase auth session with Clerk token
          if (token) {
            await setSupabaseToken(token);
            console.log('Successfully set Supabase auth token from Clerk');
          }
          
          // Sync user data if needed
          if (user?.emailAddresses?.[0]?.emailAddress) {
            // Verify if user exists in Supabase
            const { data: existingUser, error: fetchError } = await supabase
              .from('users')
              .select('*')
              .eq('user_id', userId)
              .maybeSingle();

            if (fetchError) {
              console.error('Erro ao verificar usuário:', fetchError);
              return;
            }

            // If user doesn't exist, create a new record
            if (!existingUser) {
              // Using rpc to call function that bypasses RLS
              const { error: insertError } = await supabase.rpc('create_user', {
                user_id_param: userId,
                email_param: user.emailAddresses[0].emailAddress
              });

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
          }
        } catch (error) {
          console.error('Erro na sincronização do usuário:', error);
        }
      } else if (!isSignedIn) {
        // Clear Supabase session when user signs out
        await setSupabaseToken(null);
      }
    };

    syncAuth();
  }, [isSignedIn, userId, user]);

  return { isSignedIn, userId };
};
