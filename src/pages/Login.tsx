
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
              headerTitle: "text-xl font-semibold text-foreground empty:hidden",
              headerSubtitle: "text-muted-foreground empty:hidden",
              formButtonPrimary: "bg-primary hover:bg-primary/90 text-primary-foreground",
              formFieldLabel: "text-foreground",
              formFieldLabelEmail: "text-foreground",
              formFieldLabelPassword: "text-foreground",
              formFieldInput: "bg-background border-border text-foreground",
              footerActionLink: "text-primary hover:underline",
              socialButtonsBlockButton: "border border-border",
              socialButtonsBlockButtonText: "text-foreground",
              socialButtonsBlockButtonGoogle: "bg-white text-gray-900 hover:bg-gray-50",
              footerAction: "text-foreground",
              dividerText: "text-muted-foreground",
              socialButtonsBlockButtonText__google: "text-gray-900",
              formFieldAction__forgotPassword: "text-primary hover:underline",
              formFieldInputShowPasswordButton: "text-foreground",
              formFieldInputHidePasswordButton: "text-foreground",
              formFieldInputEmailAddressInput: "placeholder:text-muted-foreground/70",
              formFieldInputPasswordInput: "placeholder:text-muted-foreground/70"
            },
            variables: {
              colorBackground: "white"
            }
          }}
          localization={{
            signIn: {
              title: "Entrar",
              subtitle: "para continuar no TrafficTracker",
              actionText: "Entrar",
              actionLink: "Cadastre-se",
              forgotPasswordText: "Esqueceu a senha?",
              formButtonPrimary: "Entrar",
              formFieldLabel__emailAddress: "Email",
              formFieldLabel__password: "Senha",
              formFieldInputPlaceholder__emailAddress: "Digite seu email",
              formFieldInputPlaceholder__password: "Digite sua senha",
              formFieldAction__forgotPassword: "Esqueceu a senha?",
              footerActionText: "Não tem uma conta?",
              footerActionLink: "Cadastre-se",
              alternativeMethods: {
                dividerText: "ou",
                blockButtonText__google: "Continuar com Google",
                blockButtonText__password: "Continuar com senha",
              },
              formFieldInputShowPasswordButton: "Mostrar",
              formFieldInputHidePasswordButton: "Ocultar"
            }
          }}
        />
      </div>
    </div>
  );
};

export default Login;
