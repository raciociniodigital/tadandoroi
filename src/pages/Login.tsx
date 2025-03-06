
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
              socialButtonsBlockButtonText: "text-foreground",
              socialButtonsBlockButtonGoogle: "bg-white text-gray-900 hover:bg-gray-50"
            }
          }}
          localization={{
            signIn: {
              start: {
                title: "Entrar",
                subtitle: "para continuar no TrafficTracker",
                actionText: "Não tem uma conta?",
                actionLink: "Cadastre-se"
              },
              emailCode: {
                title: "Verifique seu email",
                subtitle: "para continuar no TrafficTracker",
                formTitle: "Código de verificação",
                formSubtitle: "Um código de verificação foi enviado para seu email",
                resendButton: "Reenviar código"
              },
              emailLink: {
                title: "Verifique seu email",
                subtitle: "para continuar no TrafficTracker",
                formTitle: "Link de verificação",
                formSubtitle: "Um link de verificação foi enviado para seu email",
                resendButton: "Reenviar link"
              },
              password: {
                title: "Bem-vindo de volta",
                subtitle: "Entre para continuar",
                actionText: "Não tem uma conta?",
                actionLink: "Cadastre-se",
                formTitle: "Entre com sua senha",
                formSubtitle: "para continuar no TrafficTracker",
                forgotPasswordText: "Esqueceu a senha?",
                forgotPasswordLink: "Redefinir senha"
              },
              continue: {
                title: "Entrar",
                subtitle: "para continuar no TrafficTracker"
              },
              phoneCode: {
                title: "Verifique seu telefone",
                subtitle: "para continuar no TrafficTracker",
                formTitle: "Código de verificação",
                formSubtitle: "Um código de verificação foi enviado para seu telefone",
                resendButton: "Reenviar código"
              },
              socialButtonsBlockButton: "Continuar com {{provider}}",
              dividerText: "ou",
              submitButton: {
                label: "Entrar"
              },
              backButton: "Voltar",
              footerActionLink: "Cadastre-se",
              footerActionText: "Não tem uma conta?"
            }
          }}
        />
      </div>
    </div>
  );
};

export default Login;
