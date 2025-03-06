
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
              headerTitle: "text-xl font-semibold text-foreground empty:hidden",
              headerSubtitle: "text-muted-foreground empty:hidden",
              formButtonPrimary: "bg-primary hover:bg-primary/90 text-primary-foreground",
              formFieldLabel: "text-foreground",
              formFieldLabelEmail: "text-foreground",
              formFieldLabelPassword: "text-foreground",
              formFieldLabelFirstName: "text-foreground",
              formFieldLabelLastName: "text-foreground",
              formFieldInput: "bg-background border-border text-foreground",
              footerActionLink: "text-primary hover:underline",
              socialButtonsBlockButton: "border border-border",
              socialButtonsBlockButtonText: "text-foreground",
              socialButtonsBlockButtonGoogle: "bg-white text-gray-900 hover:bg-gray-50",
              footerAction: "text-foreground",
              dividerText: "text-muted-foreground",
              socialButtonsBlockButtonText__google: "text-gray-900",
              formFieldInputShowPasswordButton: "text-foreground",
              formFieldInputHidePasswordButton: "text-foreground",
              formFieldInputEmailAddressInput: "placeholder:text-muted-foreground/70",
              formFieldInputPasswordInput: "placeholder:text-muted-foreground/70",
              formFieldInputFirstNameInput: "placeholder:text-muted-foreground/70",
              formFieldInputLastNameInput: "placeholder:text-muted-foreground/70"
            },
            variables: {
              colorBackground: "white"
            }
          }}
          localization={{
            signUp: {
              title: "Criar uma conta",
              subtitle: "para usar o TrafficTracker",
              actionText: "Cadastrar",
              actionLink: "Entrar",
              formButtonPrimary: "Cadastrar",
              formFieldLabel__emailAddress: "Email",
              formFieldLabel__password: "Senha",
              formFieldLabel__firstName: "Nome",
              formFieldLabel__lastName: "Sobrenome",
              formFieldInputPlaceholder__emailAddress: "Digite seu email",
              formFieldInputPlaceholder__password: "Digite uma senha",
              formFieldInputPlaceholder__firstName: "Digite seu nome",
              formFieldInputPlaceholder__lastName: "Digite seu sobrenome",
              footerActionText: "Já tem uma conta?",
              footerActionLink: "Entrar",
              alternativeMethods: {
                dividerText: "ou",
                blockButtonText__google: "Continuar com Google",
                blockButtonText__password: "Continuar com senha",
              },
              formFieldInputShowPasswordButton: "Mostrar",
              formFieldInputHidePasswordButton: "Ocultar",
              termsPageInner: "Ao clicar Cadastrar você concorda com nossos Termos de Serviço e Política de Privacidade"
            }
          }}
        />
      </div>
    </div>
  );
};

export default Register;
