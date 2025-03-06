
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@clerk/clerk-react';
import { User as SupabaseUser, getCurrentUser } from '@/lib/users';
import { useAuth as useCustomAuth } from '@/hooks/useAuth';

export const UserInfo = () => {
  const { user, isLoaded } = useAuth();
  const { supabaseReady } = useCustomAuth();
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (isLoaded && supabaseReady) {
        try {
          const userData = await getCurrentUser();
          setSupabaseUser(userData);
        } catch (error) {
          console.error('Error fetching user data:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUser();
  }, [isLoaded, supabaseReady]);

  if (!isLoaded || loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle><Skeleton className="h-8 w-40" /></CardTitle>
          <CardDescription><Skeleton className="h-4 w-60" /></CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informações do Perfil</CardTitle>
        <CardDescription>Seus dados de usuário</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div>
            <span className="font-medium">Nome:</span> {user?.firstName} {user?.lastName}
          </div>
          <div>
            <span className="font-medium">Email:</span> {user?.emailAddresses[0]?.emailAddress}
          </div>
          <div>
            <span className="font-medium">ID do Clerk:</span> {user?.id}
          </div>
          {supabaseUser && (
            <div>
              <span className="font-medium">ID no Supabase:</span> {supabaseUser.id}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
