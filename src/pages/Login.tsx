
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSupabaseAuth } from '@/providers/SupabaseAuthProvider';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { supabase } from '@/integrations/supabase/client';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailNotConfirmed, setEmailNotConfirmed] = useState(false);
  const { signIn, session } = useSupabaseAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Redireciona se já estiver logado
  if (session) {
    navigate('/daily');
    return null;
  }

  const handleResendConfirmation = async () => {
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
      });
      
      if (error) {
        toast({
          title: "Erro ao reenviar email",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Email de confirmação enviado",
          description: "Verifique sua caixa de entrada e confirme seu email para fazer login.",
        });
      }
    } catch (error) {
      console.error('Erro ao reenviar email:', error);
      toast({
        title: "Erro inesperado",
        description: "Não foi possível reenviar o email de confirmação. Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setEmailNotConfirmed(false);
    
    try {
      const { error } = await signIn(email, password);
      if (error) {
        console.error('Erro de login:', error.message);
        
        // Verifica se o erro é de email não confirmado
        if (error.message.includes('Email not confirmed') || error.message.includes('email_not_confirmed')) {
          setEmailNotConfirmed(true);
        } else {
          toast({
            title: "Erro ao fazer login",
            description: error.message,
            variant: "destructive",
          });
        }
      } else {
        // Login bem-sucedido, o redirecionamento será tratado pela verificação da sessão
        navigate('/daily');
      }
    } catch (error) {
      console.error('Erro durante o login:', error);
      toast({
        title: "Erro inesperado",
        description: "Ocorreu um erro ao processar seu login. Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Login</CardTitle>
          <CardDescription>
            Digite seu e-mail e senha para acessar sua conta
          </CardDescription>
        </CardHeader>
        
        {emailNotConfirmed && (
          <div className="px-6">
            <Alert variant="destructive" className="mb-4">
              <AlertTitle>Erro ao fazer login</AlertTitle>
              <AlertDescription>
                Email não confirmado. Por favor, verifique sua caixa de entrada e clique no link de confirmação.
                <Button 
                  variant="link" 
                  className="p-0 h-auto text-white underline ml-1"
                  onClick={handleResendConfirmation}
                  disabled={isSubmitting}
                >
                  Reenviar email de confirmação
                </Button>
              </AlertDescription>
            </Alert>
          </div>
        )}
        
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="seu@email.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Senha</Label>
                <Link to="#" className="text-sm text-blue-600 hover:underline">
                  Esqueceu a senha?
                </Link>
              </div>
              <Input 
                id="password" 
                type="password" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-4">
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Entrando...
                </>
              ) : (
                'Entrar'
              )}
            </Button>
            
            <div className="text-center text-sm">
              Não tem uma conta?{' '}
              <Link to="/register" className="text-blue-600 hover:underline">
                Registre-se
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
