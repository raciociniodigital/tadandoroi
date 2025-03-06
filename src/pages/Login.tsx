
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SignIn, useAuth } from '@clerk/clerk-react';

const Login = () => {
  const { isSignedIn } = useAuth();
  const navigate = useNavigate();

  // Redirect to daily tracking if already signed in
  useEffect(() => {
    if (isSignedIn) {
      navigate('/daily');
    }
  }, [isSignedIn, navigate]);

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background px-4">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gradient">
          Traffic<span className="text-foreground">Tracker</span>
        </h1>
        <p className="mt-2 text-muted-foreground">
          Acompanhe seus investimentos em tráfego e maximize seus resultados
        </p>
      </div>
      
      <div className="w-full max-w-md animate-fade-up">
        <SignIn 
          path="/login" 
          signUpUrl="/register"
          appearance={{
            elements: {
              rootBox: "w-full max-w-md mx-auto",
              card: "shadow-lg rounded-lg border border-border bg-card",
              headerTitle: "text-xl font-semibold text-foreground",
              headerSubtitle: "text-muted-foreground",
              formButtonPrimary: "bg-primary hover:bg-primary/90 text-primary-foreground",
              formFieldLabel: "text-foreground",
              formFieldInput: "bg-background border-border text-foreground",
              footerActionLink: "text-primary hover:underline",
              socialButtonsBlockButton: "border border-border",
              socialButtonsBlockButtonGoogle: "bg-white hover:bg-gray-50",
              socialButtonsBlockButtonText: "text-foreground"
            },
            text: {
              signIn: {
                start: {
                  title: "Entrar",
                  subtitle: "para continuar no TrafficTracker",
                  actionText: "Não tem uma conta?",
                  actionLink: "Cadastre-se"
                },
                emailLink: {
                  title: "Verifique seu email",
                  subtitle: "para continuar no TrafficTracker",
                  formTitle: "Link de verificação",
                  formSubtitle: "Enviamos um link de verificação para seu email",
                  resendButton: "Reenviar link",
                  unusedText: "Voltar para",
                  unusedTextLink: "entrar"
                },
                password: {
                  title: "Olá",
                  subtitle: "Insira sua senha para entrar",
                  actionText: "Esqueceu sua senha?",
                  actionLink: "Redefinir"
                },
                emailCode: {
                  title: "Verifique seu email",
                  subtitle: "para continuar no TrafficTracker",
                  formTitle: "Código de verificação",
                  formSubtitle: "Enviamos um código de verificação para seu email",
                  resendButton: "Reenviar código"
                },
                phoneCode: {
                  title: "Verifique seu telefone",
                  subtitle: "para continuar no TrafficTracker",
                  formTitle: "Código de verificação",
                  formSubtitle: "Enviamos um código de verificação para seu telefone",
                  resendButton: "Reenviar código"
                },
                forgotten: {
                  title: "Redefinir senha",
                  subtitle: "Enviaremos instruções para seu email",
                  formTitle: "Redefinição de senha",
                  formSubtitle: "Entre com seu email para redefinir sua senha",
                  actionText: "Lembrou sua senha?",
                  actionLink: "Voltar para entrar"
                }
              },
              socialButtons: {
                dividerText: "ou",
                googleButton: "Continuar com Google",
                facebookButton: "Continuar com Facebook",
                appleButton: "Continuar com Apple",
                githubButton: "Continuar com GitHub",
                discordButton: "Continuar com Discord"
              },
              formFieldLabel: {
                email: "Email",
                password: "Senha",
                firstName: "Nome",
                lastName: "Sobrenome",
                phoneNumber: "Número de telefone",
                emailAddress: "Endereço de email",
                username: "Nome de usuário",
                emailCode: "Código de verificação",
                phoneCode: "Código de verificação"
              },
              formButtonPrimary: {
                signIn: "Entrar",
                continue: "Continuar",
                signUp: "Cadastrar",
                resetPassword: "Redefinir senha"
              },
              footerActionLink: {
                backToSignIn: "Voltar para entrar"
              },
              userProfile: {
                title: "Perfil"
              },
              userButton: {
                action: {
                  signOut: "Sair",
                  manageAccount: "Gerenciar conta"
                }
              }
            }
          }}
        />
      </div>
    </div>
  );
};

export default Login;
