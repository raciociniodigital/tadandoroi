
import { useState, useEffect } from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseAuth } from '@/providers/AuthProvider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Check, X, RefreshCw } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function ClerkSupabaseDebug() {
  const { isSignedIn, isLoaded, getToken } = useAuth();
  const { user } = useUser();
  const { isSynced, syncSupabase } = useSupabaseAuth();
  const [isCheckingJwt, setIsCheckingJwt] = useState(false);
  const [jwtValid, setJwtValid] = useState<boolean | null>(null);
  const [debugInfo, setDebugInfo] = useState<any>({});

  // Check JWT validity
  const checkJwt = async () => {
    try {
      setIsCheckingJwt(true);
      setJwtValid(null);
      
      // Try to get user data from Supabase (this will only work if JWT is valid)
      const { data, error } = await supabase.from('users').select('*').limit(1);
      
      console.log('Supabase response:', { data, error });
      setDebugInfo(prev => ({ ...prev, supabaseResponse: { data, error } }));
      
      if (error) {
        console.error('Error fetching users:', error);
        setJwtValid(false);
        toast({
          title: "JWT Validation Failed",
          description: error.message,
          variant: "destructive",
        });
        return;
      }
      
      setJwtValid(true);
      toast({
        title: "JWT is Valid",
        description: "Successfully authenticated with Supabase",
      });
    } catch (error) {
      console.error('Error checking JWT:', error);
      setJwtValid(false);
    } finally {
      setIsCheckingJwt(false);
    }
  };

  // Force sync with Supabase
  const handleForceSync = async () => {
    const success = await syncSupabase();
    
    if (success) {
      toast({
        title: "Sync Successful",
        description: "Supabase authentication synchronized",
      });
      // Check JWT validity after sync
      checkJwt();
    } else {
      toast({
        title: "Sync Failed",
        description: "Could not synchronize with Supabase",
        variant: "destructive",
      });
    }
  };

  // Get token for debugging
  const handleGetToken = async () => {
    try {
      if (!getToken) return;
      
      const token = await getToken({ template: 'supabase' });
      setDebugInfo(prev => ({ ...prev, token: token?.substring(0, 20) + '...' }));
      
      console.log('Token obtained:', token?.substring(0, 20) + '...');
      
      toast({
        title: "Token Retrieved",
        description: "Clerk token for Supabase obtained successfully",
      });
    } catch (error) {
      console.error('Error getting token:', error);
      toast({
        title: "Token Error",
        description: "Could not get Clerk token",
        variant: "destructive",
      });
    }
  };

  // Check Clerk session
  useEffect(() => {
    if (isLoaded) {
      setDebugInfo(prev => ({
        ...prev,
        clerk: {
          isSignedIn,
          userId: user?.id,
          email: user?.emailAddresses?.[0]?.emailAddress,
        }
      }));
    }
  }, [isLoaded, isSignedIn, user]);

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Clerk ↔ Supabase Auth Debug</CardTitle>
          <CardDescription>
            Use this page to diagnose and fix authentication issues between Clerk and Supabase
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Auth status */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-medium mb-2">Clerk Status</h3>
              <div className="flex items-center gap-2">
                <span>Signed In:</span>
                {isSignedIn ? 
                  <Check className="h-4 w-4 text-green-500" /> : 
                  <X className="h-4 w-4 text-red-500" />
                }
              </div>
              {isSignedIn && user && (
                <div className="text-sm text-muted-foreground mt-2">
                  <div>User ID: {user.id}</div>
                  <div>Email: {user.emailAddresses?.[0]?.emailAddress}</div>
                </div>
              )}
            </div>
            
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-medium mb-2">Supabase Sync</h3>
              <div className="flex items-center gap-2">
                <span>Synced:</span>
                {isSynced ? 
                  <Check className="h-4 w-4 text-green-500" /> : 
                  <X className="h-4 w-4 text-red-500" />
                }
              </div>
              <div className="flex items-center gap-2 mt-2">
                <span>JWT Valid:</span>
                {jwtValid === null ? (
                  <span className="text-muted-foreground text-sm">Not checked</span>
                ) : jwtValid ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <X className="h-4 w-4 text-red-500" />
                )}
              </div>
            </div>
          </div>
          
          {/* Debug actions */}
          <div className="space-y-2">
            <Button 
              onClick={handleForceSync} 
              className="w-full"
              disabled={!isSignedIn}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Force Sync Authentication
            </Button>
            
            <Button 
              onClick={checkJwt} 
              className="w-full"
              disabled={isCheckingJwt || !isSignedIn}
              variant="outline"
            >
              {isCheckingJwt ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <></>
              )}
              Test Supabase Connection
            </Button>
            
            <Button
              onClick={handleGetToken}
              className="w-full"
              disabled={!isSignedIn}
              variant="secondary"
            >
              Get Clerk Token (Debug)
            </Button>
          </div>
          
          {/* Debug info section */}
          <div className="mt-4 space-y-2">
            <h3 className="font-medium">Debug Information</h3>
            <pre className="bg-slate-950 text-slate-50 p-4 rounded-md text-xs overflow-auto max-h-64">
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between border-t pt-6">
          <Button variant="outline" onClick={() => window.history.back()}>
            Back
          </Button>
          
          <Button onClick={() => window.location.href = '/clerk-supabase.html'} variant="default">
            Open JWT Template Setup
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
