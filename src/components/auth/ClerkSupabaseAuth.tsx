
import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { useToast } from '@/hooks/use-toast';
import { setSupabaseToken, getClerkToken } from '@/utils/supabaseAuth';

const ClerkSupabaseAuth = ({ children }: { children: React.ReactNode }) => {
  const { isSignedIn, isLoaded } = useAuth();
  const [isSupabaseAuthed, setIsSupabaseAuthed] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Função para sincronizar o estado de autenticação
    const syncAuthState = async () => {
      if (!isLoaded) return;
      
      console.log('ClerkSupabaseAuth: Sincronizando estado de autenticação, isSignedIn:', isSignedIn);
      
      if (isSignedIn) {
        try {
          // Get token from Clerk and set it in Supabase
          const token = await getClerkToken();
          
          if (!token) {
            console.error('Não foi possível obter o token do Clerk');
            toast({
              title: "Erro de autenticação",
              description: "Não foi possível autenticar com o Supabase. Tente fazer login novamente.",
              variant: "destructive",
            });
            setIsSupabaseAuthed(false);
            return;
          }
          
          console.log('Token obtido, configurando sessão do Supabase');
          const success = await setSupabaseToken(token);
          
          if (success) {
            console.log('Autenticado com sucesso no Supabase usando a sessão do Clerk');
            setIsSupabaseAuthed(true);
          } else {
            console.error('Falha ao autenticar com o Supabase');
            toast({
              title: "Erro de autenticação",
              description: "Não foi possível autenticar com o Supabase. Tente fazer login novamente.",
              variant: "destructive",
            });
            setIsSupabaseAuthed(false);
          }
        } catch (error) {
          console.error('Erro ao sincronizar estado de autenticação:', error);
          toast({
            title: "Erro de autenticação",
            description: "Não foi possível autenticar com o Supabase. Tente fazer login novamente.",
            variant: "destructive",
          });
          setIsSupabaseAuthed(false);
        }
      } else if (isLoaded && !isSignedIn) {
        // User is not signed in, clear Supabase session
        console.log('Usuário não está autenticado, limpando sessão do Supabase');
        await setSupabaseToken(null);
        setIsSupabaseAuthed(false);
      }
    };

    // Executar sincronização quando o componente montar ou o estado de autenticação mudar
    syncAuthState();
    
    // Configurar um intervalo para atualizar o token periodicamente (a cada 5 minutos)
    const intervalId = setInterval(syncAuthState, 5 * 60 * 1000);
    
    // Limpar o intervalo quando o componente for desmontado
    return () => clearInterval(intervalId);
  }, [isSignedIn, isLoaded, toast]);

  return <>{children}</>;
};

export default ClerkSupabaseAuth;
