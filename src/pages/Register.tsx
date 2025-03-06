
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
              headerTitle: "text-xl font-semibold text-foreground after:content-['Criar_uma_conta'] after:block empty:hidden",
              headerSubtitle: "text-muted-foreground after:content-['para_usar_o_TrafficTracker'] after:block empty:hidden",
              formButtonPrimary: "bg-primary hover:bg-primary/90 text-primary-foreground after:content-['Cadastrar'] after:block empty:hidden",
              formFieldLabel: "text-foreground",
              formFieldLabelEmail: "text-foreground after:content-['Email'] after:block empty:hidden",
              formFieldLabelPassword: "text-foreground after:content-['Senha'] after:block empty:hidden",
              formFieldLabelFirstName: "text-foreground after:content-['Nome'] after:block empty:hidden",
              formFieldLabelLastName: "text-foreground after:content-['Sobrenome'] after:block empty:hidden",
              formFieldInput: "bg-background border-border text-foreground",
              footerActionLink: "text-primary hover:underline after:content-['Entrar'] after:block empty:hidden",
              socialButtonsBlockButton: "border border-border",
              socialButtonsBlockButtonText: "text-foreground",
              socialButtonsBlockButtonGoogle: "bg-white text-gray-900 hover:bg-gray-50",
              footerAction: "after:content-['Já_tem_uma_conta?'] after:inline-block after:mr-1 empty:hidden",
              dividerText: "after:content-['ou'] after:block empty:hidden",
              socialButtonsBlockButtonText__google: "after:content-['Continuar_com_Google'] after:block empty:hidden",
              formFieldInputShowPasswordButton: "after:content-['Mostrar'] after:block empty:hidden",
              formFieldInputHidePasswordButton: "after:content-['Ocultar'] after:block empty:hidden",
              formFieldInputEmailAddressInput: "placeholder:text-muted-foreground/70 placeholder:after:content-['Digite_seu_email'] placeholder:after:block placeholder:empty:hidden",
              formFieldInputPasswordInput: "placeholder:text-muted-foreground/70 placeholder:after:content-['Digite_uma_senha'] placeholder:after:block placeholder:empty:hidden",
              formFieldInputFirstNameInput: "placeholder:text-muted-foreground/70 placeholder:after:content-['Digite_seu_nome'] placeholder:after:block placeholder:empty:hidden",
              formFieldInputLastNameInput: "placeholder:text-muted-foreground/70 placeholder:after:content-['Digite_seu_sobrenome'] placeholder:after:block placeholder:empty:hidden",
              termsPageInner: "after:content-['Ao_clicar_Cadastrar_você_concorda_com_nossos_Termos_de_Serviço_e_Política_de_Privacidade'] after:block empty:hidden"
            }
          }}
        />
      </div>
    </div>
  );
};

export default Register;
