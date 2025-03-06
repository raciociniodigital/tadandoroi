
import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { useToast } from '@/hooks/use-toast';
import { syncSupabaseAuth } from '@/utils/supabaseAuth';

const ClerkSupabaseAuth = ({ children }: { children: React.ReactNode }) => {
  const { isSignedIn, isLoaded } = useAuth();
  const [isAuthSynced, setIsAuthSynced] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    let intervalId: number;
    
    const handleAuthSync = async () => {
      try {
        if (!isLoaded) return;
        
        if (isSignedIn) {
          const success = await syncSupabaseAuth();
          setIsAuthSynced(success);
          
          if (!success) {
            console.error('Falha ao sincronizar autenticação com Supabase');
          }
        } else {
          // User is not signed in, clear Supabase session
          setIsAuthSynced(false);
        }
      } catch (error) {
        console.error('Erro na sincronização de autenticação:', error);
        setIsAuthSynced(false);
      }
    };
    
    // Sync auth when component mounts or auth state changes
    handleAuthSync();
    
    // Set up an interval to refresh the token (every 10 minutes)
    if (isSignedIn) {
      intervalId = window.setInterval(handleAuthSync, 10 * 60 * 1000);
    }
    
    return () => {
      if (intervalId) window.clearInterval(intervalId);
    };
  }, [isSignedIn, isLoaded]);

  // Just render children - we handle the syncing in the background
  return <>{children}</>;
};

export default ClerkSupabaseAuth;
