
import { useEffect } from 'react';
import { useClerk, useAuth } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
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
  
  // Use o hook de sincronização que criamos
  useAuthSync();

  useEffect(() => {
    console.log("AuthSync: isSignedIn =", isSignedIn, "isLoaded =", isLoaded);
    
    if (isLoaded && !isSignedIn) {
      toast({
        title: "Acesso não autorizado",
        description: "Por favor, faça login para acessar esta página",
        variant: "destructive",
      });
      navigate('/login');
    }
  }, [isSignedIn, isLoaded, navigate, toast]);

  if (!isLoaded) {
    return <div className="flex h-screen w-full items-center justify-center">Carregando...</div>;
  }

  // Se o usuário estiver autenticado, renderize o conteúdo normalmente
  if (isSignedIn) {
    return <>{children}</>;
  }

  // Este retorno é apenas um fallback, na prática o useEffect acima
  // redirecionará para a página de login
  return null;
};

export default AuthSync;
