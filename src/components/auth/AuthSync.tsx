
import { useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { useAuthSync } from '@/hooks/useAuthSync';
import { getClerkToken, setSupabaseToken } from '@/utils/supabaseAuth';

interface AuthSyncProps {
  children: React.ReactNode;
}

const AuthSync: React.FC<AuthSyncProps> = ({ children }) => {
  const { isSignedIn, isLoaded } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const location = useLocation();
  
  // Use o hook de sincronização
  const authSync = useAuthSync();

  useEffect(() => {
    console.log("AuthSync: isSignedIn =", isSignedIn, "isLoaded =", isLoaded, "path =", location.pathname);
    
    const syncToken = async () => {
      if (isSignedIn) {
        try {
          const token = await getClerkToken();
          if (token) {
            await setSupabaseToken(token);
            console.log("AuthSync: Token do Supabase configurado com sucesso");
          } else {
            console.error("AuthSync: Não foi possível obter o token do Clerk");
          }
        } catch (error) {
          console.error("AuthSync: Erro ao sincronizar token", error);
        }
      }
    };
    
    // Sincronizar token quando o usuário estiver autenticado
    if (isLoaded && isSignedIn) {
      syncToken();
    }
    
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
