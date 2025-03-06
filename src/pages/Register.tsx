
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
              headerTitle: "text-xl font-semibold text-foreground after:content-['Criar uma conta'] after:block empty:hidden",
              headerSubtitle: "text-muted-foreground after:content-['para usar o TrafficTracker'] after:block empty:hidden",
              formButtonPrimary: "bg-primary hover:bg-primary/90 text-primary-foreground",
              formFieldLabel: "text-foreground",
              formFieldInput: "bg-background border-border text-foreground",
              footerActionLink: "text-primary hover:underline",
              socialButtonsBlockButton: "border border-border",
              socialButtonsBlockButtonText: "text-foreground",
              socialButtonsBlockButtonGoogle: "bg-white text-gray-900 hover:bg-gray-50",
              footerAction: "after:content-['Já tem uma conta?'] after:inline-block after:mr-1 empty:hidden",
              footerActionLink__signIn: "after:content-['Entrar'] after:block empty:hidden",
              dividerText: "after:content-['ou'] after:block empty:hidden",
              formButtonPrimary__signUp: "after:content-['Cadastrar'] after:block empty:hidden",
              socialButtonsBlockButtonText__google: "after:content-['Continuar com Google'] after:block empty:hidden"
            }
          }}
        />
      </div>
    </div>
  );
};

export default Register;
