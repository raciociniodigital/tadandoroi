
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
              headerTitle: "text-xl font-semibold text-foreground after:content-['Entrar'] after:block empty:hidden",
              headerSubtitle: "text-muted-foreground after:content-['para_continuar_no_TrafficTracker'] after:block empty:hidden",
              formButtonPrimary: "bg-primary hover:bg-primary/90 text-primary-foreground after:content-['Entrar'] after:block empty:hidden",
              formFieldLabel: "text-foreground after:content-['Email'] after:block empty:hidden",
              formFieldLabelEmail: "text-foreground after:content-['Email'] after:block empty:hidden",
              formFieldLabelPassword: "text-foreground after:content-['Senha'] after:block empty:hidden",
              formFieldInput: "bg-background border-border text-foreground",
              footerActionLink: "text-primary hover:underline after:content-['Cadastre-se'] after:block empty:hidden",
              socialButtonsBlockButton: "border border-border",
              socialButtonsBlockButtonText: "text-foreground",
              socialButtonsBlockButtonGoogle: "bg-white text-gray-900 hover:bg-gray-50",
              footerAction: "after:content-['Não_tem_uma_conta?'] after:inline-block after:mr-1 empty:hidden",
              dividerText: "after:content-['ou'] after:block empty:hidden",
              socialButtonsBlockButtonText__google: "after:content-['Continuar_com_Google'] after:block empty:hidden",
              formFieldAction__forgotPassword: "text-primary hover:underline after:content-['Esqueceu_a_senha?'] after:block empty:hidden",
              formFieldInputShowPasswordButton: "after:content-['Mostrar'] after:block empty:hidden",
              formFieldInputHidePasswordButton: "after:content-['Ocultar'] after:block empty:hidden",
              formFieldInputEmailAddressInput: "placeholder:text-muted-foreground/70 placeholder:after:content-['Digite_seu_email'] placeholder:after:block placeholder:empty:hidden",
              formFieldInputPasswordInput: "placeholder:text-muted-foreground/70 placeholder:after:content-['Digite_sua_senha'] placeholder:after:block placeholder:empty:hidden"
            }
          }}
        />
      </div>
    </div>
  );
};

export default Login;
