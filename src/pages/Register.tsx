
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SignUp, useAuth } from '@clerk/clerk-react';

const Register = () => {
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
        <SignUp 
          path="/register" 
          signInUrl="/login"
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
            signUp: {
              start: {
                title: "Criar uma conta",
                subtitle: "para usar o TrafficTracker",
                actionText: "Já tem uma conta?",
                actionLink: "Entrar"
              },
              emailLink: {
                title: "Verifique seu email",
                subtitle: "para continuar no TrafficTracker",
                formTitle: "Link de verificação",
                formSubtitle: "Um link de verificação foi enviado para seu email",
                resendButton: "Reenviar link"
              },
              emailCode: {
                title: "Verifique seu email",
                subtitle: "para continuar no TrafficTracker",
                formTitle: "Código de verificação",
                formSubtitle: "Um código de verificação foi enviado para seu email",
                resendButton: "Reenviar código"
              },
              phoneCode: {
                title: "Verifique seu telefone",
                subtitle: "para continuar no TrafficTracker",
                formTitle: "Código de verificação",
                formSubtitle: "Um código de verificação foi enviado para seu telefone",
                resendButton: "Reenviar código"
              },
              continue: {
                title: "Complete seu cadastro",
                subtitle: "para usar o TrafficTracker"
              },
              password: {
                title: "Crie uma senha",
                subtitle: "para proteger sua conta",
                formTitle: "Crie uma senha",
                formSubtitle: "para proteger sua conta"
              },
              socialButtonsBlockButton: "Continuar com {{provider}}",
              dividerText: "ou",
              submitButton: {
                label: "Cadastrar"
              },
              backButton: "Voltar",
              footerActionLink: "Entrar",
              footerActionText: "Já tem uma conta?"
            }
          }}
        />
      </div>
    </div>
  );
};

export default Register;
