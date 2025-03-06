
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
              headerTitle: "text-xl font-semibold text-foreground empty:hidden before:content-['Criar_uma_conta']",
              headerSubtitle: "text-muted-foreground empty:hidden before:content-['para_usar_o_TrafficTracker']",
              formButtonPrimary: "bg-primary hover:bg-primary/90 text-primary-foreground before:content-['Cadastrar']",
              formFieldLabel: "text-foreground",
              formFieldLabelEmail: "text-foreground before:content-['Email']",
              formFieldLabelPassword: "text-foreground before:content-['Senha']",
              formFieldLabelFirstName: "text-foreground before:content-['Nome']",
              formFieldLabelLastName: "text-foreground before:content-['Sobrenome']",
              formFieldInput: "bg-background border-border text-foreground",
              footerActionLink: "text-primary hover:underline before:content-['Entrar']",
              socialButtonsBlockButton: "border border-border",
              socialButtonsBlockButtonText: "text-foreground",
              socialButtonsBlockButtonGoogle: "bg-white text-gray-900 hover:bg-gray-50 !important",
              footerAction: "text-foreground before:content-['Já_tem_uma_conta?_']",
              dividerText: "text-muted-foreground before:content-['ou']",
              socialButtonsBlockButtonText__google: "text-gray-900 before:content-['Continuar_com_Google']",
              formFieldInputShowPasswordButton: "text-foreground before:content-['Mostrar']",
              formFieldInputHidePasswordButton: "text-foreground before:content-['Ocultar']",
              formFieldInputEmailAddressInput: "placeholder:text-muted-foreground/70 placeholder:content-['Digite_seu_email']",
              formFieldInputPasswordInput: "placeholder:text-muted-foreground/70 placeholder:content-['Digite_uma_senha']",
              formFieldInputFirstNameInput: "placeholder:text-muted-foreground/70 placeholder:content-['Digite_seu_nome']",
              formFieldInputLastNameInput: "placeholder:text-muted-foreground/70 placeholder:content-['Digite_seu_sobrenome']",
              termsPageInner: "before:content-['Ao_clicar_Cadastrar_você_concorda_com_nossos_Termos_de_Serviço_e_Política_de_Privacidade']"
            },
            variables: {
              colorBackground: "white",
              colorPrimary: "hsl(var(--primary))",
              colorText: "hsl(var(--foreground))",
              fontFamily: "var(--font-sans)"
            }
          }}
        />
      </div>
    </div>
  );
};

export default Register;
