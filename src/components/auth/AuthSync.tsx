
import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { syncSupabaseAuth } from '@/utils/supabaseAuth';
import { Loader2 } from 'lucide-react';

interface AuthSyncProps {
  children: React.ReactNode;
}

const AuthSync: React.FC<AuthSyncProps> = ({ children }) => {
  const { isSignedIn, isLoaded } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const location = useLocation();
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [retryCount, setRetryCount] = useState(0);

  // Lista de caminhos públicos (não requerem autenticação)
  const publicPaths = ['/', '/login', '/register'];
  const isPublicPath = publicPaths.includes(location.pathname);

  useEffect(() => {
    let isMounted = true;
    
    const checkAuthAndSync = async () => {
      if (!isLoaded) return;
  
      console.log("AuthSync: isSignedIn =", isSignedIn, "isLoaded =", isLoaded, "path =", location.pathname);
      
      // Verifica autenticação e redireciona se necessário
      if (!isSignedIn && !isPublicPath) {
        toast({
          title: "Acesso não autorizado",
          description: "Por favor, faça login para acessar esta página",
          variant: "destructive",
        });
        navigate('/login');
        if (isMounted) setIsAuthChecking(false);
        return;
      }
      
      // Se estiver autenticado, sincroniza com Supabase
      if (isSignedIn) {
        try {
          const success = await syncSupabaseAuth();
          
          if (!success && !isPublicPath) {
            console.warn('Não foi possível sincronizar com Supabase. Tentando novamente...');
            
            // Incrementa contador de tentativas
            if (isMounted) {
              setRetryCount(prev => prev + 1);
            }
            
            // Se já tentou muitas vezes, desiste
            if (retryCount > 5) {
              console.error('Muitas tentativas de sincronização falharam');
              if (isMounted) {
                setIsAuthChecking(false);
              }
              
              if (!isPublicPath) {
                toast({
                  title: "Problemas de autenticação",
                  description: "Tente fazer logout e login novamente",
                  variant: "destructive",
                });
              }
              return;
            }
            
            // Tenta mais uma vez após um curto atraso
            setTimeout(async () => {
              if (!isMounted) return;
              
              const retrySuccess = await syncSupabaseAuth();
              if (!retrySuccess && !isPublicPath) {
                // Uma última tentativa
                setTimeout(async () => {
                  if (!isMounted) return;
                  
                  const lastTrySuccess = await syncSupabaseAuth();
                  if (!lastTrySuccess && !isPublicPath) {
                    toast({
                      title: "Erro de autenticação",
                      description: "Problema na autenticação com Supabase. Tente fazer login novamente.",
                      variant: "destructive",
                    });
                  }
                  
                  if (isMounted) setIsAuthChecking(false);
                }, 2000);
                return;
              }
              
              if (isMounted) setIsAuthChecking(false);
            }, 1500);
            
            return;
          }
        } catch (error) {
          console.error('Erro ao sincronizar com Supabase:', error);
        }
      }
      
      if (isMounted) setIsAuthChecking(false);
    };
    
    checkAuthAndSync();
    
    return () => {
      isMounted = false;
    };
  }, [isSignedIn, isLoaded, navigate, toast, location.pathname, isPublicPath, retryCount]);

  // Mostra um indicador de carregamento enquanto verifica autenticação
  if (isAuthChecking && !isPublicPath) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  // Renderiza o conteúdo normalmente
  return <>{children}</>;
};

export default AuthSync;
