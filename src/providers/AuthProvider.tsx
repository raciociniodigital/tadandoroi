
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

type AuthContextType = {
  isSynced: boolean;
  isLoading: boolean;
  syncSupabase: () => Promise<boolean>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { isSignedIn, isLoaded, getToken } = useAuth();
  const { user } = useUser();
  const [isSynced, setIsSynced] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Function to sync Supabase with Clerk authentication
  const syncSupabase = async (): Promise<boolean> => {
    try {
      if (!isSignedIn || !getToken) {
        return false;
      }

      console.log('Syncing Supabase auth...');
      
      // Get token from Clerk for Supabase using the correct method
      const token = await getToken({ template: 'supabase' });
      
      if (!token) {
        console.error('Failed to get Supabase token from Clerk');
        return false;
      }
      
      // Set the Supabase session
      const { error } = await supabase.auth.setSession({
        access_token: token,
        refresh_token: '',
      });
      
      if (error) {
        console.error('Error setting Supabase session:', error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error syncing Supabase auth:', error);
      return false;
    }
  };

  useEffect(() => {
    let syncInterval: number | null = null;
    
    const initializeAuth = async () => {
      if (!isLoaded) {
        setIsLoading(true);
        return;
      }
      
      if (!isSignedIn) {
        setIsSynced(false);
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      
      try {
        // Try to sync authentication
        const success = await syncSupabase();
        
        if (success) {
          console.log('Supabase auth synced successfully');
          setIsSynced(true);
          
          // Check for user in database and create if missing
          if (user) {
            const email = user?.emailAddresses?.[0]?.emailAddress;
            
            if (email && user.id) {
              const { error } = await supabase.rpc('create_user', {
                user_id_param: user.id,
                email_param: email
              });
              
              if (error) {
                console.error('Error ensuring user exists:', error);
              }
            }
          }
        } else {
          console.error('Failed to sync Supabase auth');
          
          // Try once more after a short delay
          setTimeout(async () => {
            const retrySuccess = await syncSupabase();
            setIsSynced(retrySuccess);
            
            if (!retrySuccess) {
              toast({
                title: "Auth Sync Issue",
                description: "Could not authenticate with database. Try logging out and back in.",
                variant: "destructive",
              });
            }
          }, 2000);
        }
      } catch (error) {
        console.error('Error during auth initialization:', error);
        setIsSynced(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    initializeAuth();
    
    // Set up interval to refresh token periodically
    if (isSignedIn) {
      syncInterval = window.setInterval(async () => {
        const success = await syncSupabase();
        setIsSynced(success);
      }, 10 * 60 * 1000); // Every 10 minutes
    }
    
    return () => {
      if (syncInterval) {
        window.clearInterval(syncInterval);
      }
    };
  }, [isSignedIn, isLoaded, user, toast, getToken]);

  return (
    <AuthContext.Provider
      value={{
        isSynced,
        isLoading,
        syncSupabase,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useSupabaseAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useSupabaseAuth must be used within an AuthProvider");
  }
  return context;
}
