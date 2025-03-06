
import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { useToast } from '@/hooks/use-toast';
import { syncSupabaseAuth } from '@/utils/supabaseAuth';

const SYNC_INTERVAL = 10 * 60 * 1000; // 10 minutos

const ClerkSupabaseAuth = ({ children }: { children: React.ReactNode }) => {
  const { isSignedIn, isLoaded } = useAuth();
  const [isAuthSynced, setIsAuthSynced] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    let intervalId: number | null = null;
    
    const handleAuthSync = async () => {
      try {
        if (!isLoaded) return;
        
        if (isSignedIn) {
          console.log('ClerkSupabaseAuth: Sincronizando autenticação...');
          
          const success = await syncSupabaseAuth();
          setIsAuthSynced(success);
          
          if (!success) {
            console.error('ClerkSupabaseAuth: Falha ao sincronizar autenticação');
            
            // Abrir a página para reconfigurar o template JWT
            // Este é um hack que força o browser a reconhecer o template JWT do Supabase
            const configWindow = window.open('/clerk-supabase.html', 'config_jwt', 'width=600,height=400');
            
            // Tenta sincronizar novamente após 3 segundos
            setTimeout(async () => {
              const retrySuccess = await syncSupabaseAuth();
              if (retrySuccess) {
                console.log('ClerkSupabaseAuth: Sincronização bem-sucedida após retry');
                setIsAuthSynced(true);
                if (configWindow) configWindow.close();
              } else {
                console.error('ClerkSupabaseAuth: Falha na sincronização mesmo após retry');
              }
            }, 3000);
          } else {
            console.log('ClerkSupabaseAuth: Sincronização bem-sucedida');
          }
        } else {
          // Usuário não está logado, limpar estado
          setIsAuthSynced(false);
        }
      } catch (error) {
        console.error('Erro na sincronização de autenticação:', error);
        setIsAuthSynced(false);
      }
    };
    
    // Sincronizar autenticação quando o componente montar ou o estado de autenticação mudar
    if (isLoaded) {
      handleAuthSync();
    
      // Configurar intervalo para atualizar o token periodicamente (apenas se usuário estiver logado)
      if (isSignedIn) {
        intervalId = window.setInterval(handleAuthSync, SYNC_INTERVAL);
      }
    }
    
    return () => {
      if (intervalId) window.clearInterval(intervalId);
    };
  }, [isSignedIn, isLoaded]);

  // Apenas renderiza children - lidamos com a sincronização em segundo plano
  return <>{children}</>;
};

export default ClerkSupabaseAuth;
