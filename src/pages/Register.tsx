
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSupabaseAuth } from '@/providers/SupabaseAuthProvider';
import { Loader2, Mail, AlertTriangle, ExternalLink } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [isResendingEmail, setIsResendingEmail] = useState(false);
  const { signUp, session } = useSupabaseAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Redireciona se já estiver logado
  if (session) {
    navigate('/daily');
    return null;
  }

  const handleResendConfirmation = async () => {
    setIsResendingEmail(true);
    
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
      });
      
      if (error) {
        console.error('Erro ao reenviar email:', error);
        toast({
          title: "Erro ao reenviar email",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Email de confirmação reenviado",
          description: `Enviamos um novo email de confirmação para ${email}. Por favor, verifique sua caixa de entrada e spam.`,
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
      setIsResendingEmail(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Verifica se as senhas correspondem
    if (password !== confirmPassword) {
      setPasswordError('As senhas não correspondem');
      return;
    }
    
    // Limpa o erro se existir
    setPasswordError('');
    setIsSubmitting(true);
    
    try {
      // Configurando a URL de redirecionamento usando janela atual
      const { origin } = window.location;
      const redirectTo = `${origin}/login?confirmed=true`;
      
      // Registro com URL de redirecionamento
      const { error } = await signUp(email, password, redirectTo);
      
      if (!error) {
        // Cadastro bem-sucedido
        setRegistrationSuccess(true);
        toast({
          title: "Cadastro realizado com sucesso",
          description: "Enviamos um email de confirmação. Por favor, verifique sua caixa de entrada e spam.",
        });
      }
    } catch (error) {
      console.error('Erro durante o cadastro:', error);
      toast({
        title: "Erro ao criar conta",
        description: "Ocorreu um erro ao registrar sua conta. Por favor, tente novamente.",
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
          <CardTitle className="text-2xl font-bold">Criar uma conta</CardTitle>
          <CardDescription>
            Preencha os campos abaixo para se registrar
          </CardDescription>
        </CardHeader>
        
        {registrationSuccess && (
          <div className="px-6">
            <Alert className="mb-4 bg-blue-50 border-blue-200">
              <Mail className="h-5 w-5 text-blue-600" />
              <AlertTitle className="text-blue-800 font-medium">Verificação de Email Necessária</AlertTitle>
              <AlertDescription className="text-blue-700">
                <p className="mb-2">
                  Enviamos um email de confirmação para <strong>{email}</strong>.
                </p>
                <p className="mb-2">
                  Por favor, <strong>verifique sua caixa de entrada e pasta de spam</strong> e clique no link para ativar sua conta.
                </p>
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md flex items-start">
                  <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-yellow-800">
                    <p className="mb-2">
                      Ao clicar no link de confirmação:
                    </p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Se estiver no celular, copie o link e abra-o no navegador</li>
                      <li>Ou abra o link em um computador onde o aplicativo esteja rodando</li>
                    </ul>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="mt-3 bg-white hover:bg-blue-50 border-blue-200 text-blue-700"
                      onClick={handleResendConfirmation}
                      disabled={isResendingEmail}
                    >
                      {isResendingEmail ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Reenviando...
                        </>
                      ) : (
                        'Reenviar email de confirmação'
                      )}
                    </Button>
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          </div>
        )}
        
        {!registrationSuccess ? (
          <form onSubmit={handleRegister}>
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
                <Label htmlFor="password">Senha</Label>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                <Input 
                  id="confirmPassword" 
                  type="password" 
                  placeholder="••••••••" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                {passwordError && (
                  <p className="text-sm text-red-500">{passwordError}</p>
                )}
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
                    Criando conta...
                  </>
                ) : (
                  'Registrar'
                )}
              </Button>
              
              <div className="text-center text-sm">
                Já tem uma conta?{' '}
                <Link to="/login" className="text-blue-600 hover:underline">
                  Faça login
                </Link>
              </div>
            </CardFooter>
          </form>
        ) : (
          <CardFooter className="flex flex-col space-y-4">
            <Button 
              className="w-full bg-blue-600 hover:bg-blue-700" 
              onClick={() => navigate('/login')}
            >
              Ir para a página de login
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
