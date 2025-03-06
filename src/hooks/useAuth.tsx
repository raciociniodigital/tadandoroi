
import { useAuth as useClerkAuth } from '@clerk/clerk-react';
import { useEffect, useState } from 'react';
import { setSupabaseToken } from '@/lib/supabase';

export const useAuth = () => {
  const { isLoaded, isSignedIn, getToken, userId } = useClerkAuth();
  const [supabaseReady, setSupabaseReady] = useState(false);

  // Set up Supabase with the Clerk JWT when auth state changes
  useEffect(() => {
    const setupSupabase = async () => {
      if (isLoaded) {
        try {
          if (isSignedIn && userId) {
            // Get the JWT token from Clerk
            const token = await getToken({ template: 'supabase' });
            
            // Set the token for Supabase
            await setSupabaseToken(token);
            setSupabaseReady(true);
          } else {
            // Clear Supabase session if not signed in
            await setSupabaseToken(null);
            setSupabaseReady(true);
          }
        } catch (error) {
          console.error('Error setting up Supabase auth:', error);
          setSupabaseReady(false);
        }
      }
    };

    setupSupabase();
  }, [isLoaded, isSignedIn, userId, getToken]);

  return {
    isLoaded,
    isSignedIn,
    userId,
    supabaseReady,
  };
};
