
import { useEffect } from 'react';
import { useClerk, useAuth } from '@clerk/clerk-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { useAuthSync } from '@/hooks/useAuthSync';

interface AuthSyncProps {
  children: React.ReactNode;
}

const AuthSync: React.FC<AuthSyncProps> = ({ children }) => {
  const { isSignedIn, isLoaded } = useAuth();
  const { signOut } = useClerk();
  const navigate = useNavigate();
  const { toast } = useToast();
  const location = useLocation();
  
  // Use o hook de sincronização que criamos
  useAuthSync();

  useEffect(() => {
    console.log("AuthSync: isSignedIn =", isSignedIn, "isLoaded =", isLoaded, "path =", location.pathname);
    
    // Não redirecionar na página inicial ou em páginas de autenticação
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
  }, [isSignedIn, isLoaded, navigate, toast, location.pathname]);

  if (!isLoaded) {
    return <div className="flex h-screen w-full items-center justify-center">Carregando...</div>;
  }

  // Renderiza o conteúdo normalmente
  return <>{children}</>;
};

export default AuthSync;
