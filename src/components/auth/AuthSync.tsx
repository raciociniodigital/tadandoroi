
import { useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { syncSupabaseAuth } from '@/utils/supabaseAuth';

interface AuthSyncProps {
  children: React.ReactNode;
}

const AuthSync: React.FC<AuthSyncProps> = ({ children }) => {
  const { isSignedIn, isLoaded } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const location = useLocation();

  useEffect(() => {
    console.log("AuthSync: isSignedIn =", isSignedIn, "isLoaded =", isLoaded, "path =", location.pathname);
    
    // Don't redirect on public paths
    const publicPaths = ['/', '/login', '/register'];
    const isPublicPath = publicPaths.includes(location.pathname);
    
    if (isLoaded && !isSignedIn && !isPublicPath) {
      toast({
        title: "Acesso não autorizado",
        description: "Por favor, faça login para acessar esta página",
        variant: "destructive",
      });
      navigate('/login');
    }
    
    // If signed in, sync auth with Supabase
    if (isLoaded && isSignedIn) {
      syncSupabaseAuth().then(success => {
        if (!success) {
          console.warn('Não foi possível sincronizar autenticação com Supabase');
        }
      });
    }
  }, [isSignedIn, isLoaded, navigate, toast, location.pathname]);

  if (!isLoaded) {
    return <div className="flex h-screen w-full items-center justify-center">Carregando...</div>;
  }

  // Render the content normally
  return <>{children}</>;
};

export default AuthSync;
