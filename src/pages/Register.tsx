
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSupabaseAuth } from '@/providers/SupabaseAuthProvider';
import { Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from '@/hooks/use-toast';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const { signUp, session } = useSupabaseAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Redireciona se já estiver logado
  if (session) {
    navigate('/daily');
    return null;
  }

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
      const { error } = await signUp(email, password);
      if (!error) {
        // Cadastro bem-sucedido
        setRegistrationSuccess(true);
        toast({
          title: "Cadastro realizado com sucesso",
          description: "Enviamos um email de confirmação. Por favor, verifique sua caixa de entrada e clique no link para ativar sua conta.",
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
            <Alert className="mb-4 bg-green-50 border-green-200">
              <AlertTitle className="text-green-800">Conta criada com sucesso!</AlertTitle>
              <AlertDescription className="text-green-700">
                Enviamos um email de confirmação para <strong>{email}</strong>. 
                Por favor, verifique sua caixa de entrada e clique no link para ativar sua conta antes de fazer login.
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
