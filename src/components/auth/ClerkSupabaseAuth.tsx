
import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { useToast } from '@/hooks/use-toast';
import { setSupabaseToken, getClerkToken } from '@/utils/supabaseAuth';

const ClerkSupabaseAuth = ({ children }: { children: React.ReactNode }) => {
  const { isSignedIn, isLoaded } = useAuth();
  const [isSupabaseAuthed, setIsSupabaseAuthed] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const syncAuthState = async () => {
      if (isLoaded) {
        if (isSignedIn) {
          try {
            // Get token from Clerk and set it in Supabase
            const token = await getClerkToken();
            const success = await setSupabaseToken(token);
            
            if (success) {
              console.log('Successfully authenticated with Supabase using Clerk session');
              setIsSupabaseAuthed(true);
            } else {
              console.error('Failed to authenticate with Supabase');
              setIsSupabaseAuthed(false);
            }
          } catch (error) {
            console.error('Error syncing auth state:', error);
            toast({
              title: 'Erro de autenticação',
              description: 'Não foi possível autenticar com o Supabase',
              variant: 'destructive',
            });
            setIsSupabaseAuthed(false);
          }
        } else {
          // User is not signed in, clear Supabase session
          setSupabaseToken(null);
          setIsSupabaseAuthed(false);
        }
      }
    };

    syncAuthState();
  }, [isSignedIn, isLoaded, toast]);

  return <>{children}</>;
};

export default ClerkSupabaseAuth;
