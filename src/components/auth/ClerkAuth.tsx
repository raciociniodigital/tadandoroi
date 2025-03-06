
import React from 'react';
import { 
  SignIn, 
  SignUp, 
  SignedIn, 
  SignedOut,
  useClerk
} from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

// Custom Login component that uses Clerk's SignIn
export const ClerkLoginForm = () => {
  return (
    <div className="w-full max-w-md animate-fade-up">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-gradient">Login</h1>
        <p className="mt-2 text-muted-foreground">
          Acesse sua conta para continuar
        </p>
      </div>
      
      <SignIn 
        routing="path" 
        path="/login"
        signUpUrl="/register"
        redirectUrl="/daily"
        appearance={{
          elements: {
            formButtonPrimary: 'bg-primary hover:bg-primary/90 text-primary-foreground',
            card: 'glass-card shadow-lg',
            headerTitle: 'hidden',
            headerSubtitle: 'hidden',
          }
        }}
      />
    </div>
  );
};

// Custom Register component that uses Clerk's SignUp
export const ClerkRegisterForm = () => {
  return (
    <div className="w-full max-w-md animate-fade-up">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-gradient">Cadastro</h1>
        <p className="mt-2 text-muted-foreground">
          Crie sua conta para começar
        </p>
      </div>
      
      <SignUp 
        routing="path" 
        path="/register"
        signInUrl="/login"
        redirectUrl="/daily"
        appearance={{
          elements: {
            formButtonPrimary: 'bg-primary hover:bg-primary/90 text-primary-foreground',
            card: 'glass-card shadow-lg',
            headerTitle: 'hidden',
            headerSubtitle: 'hidden',
          }
        }}
      />
    </div>
  );
};

// Component for user profile button
export const UserProfileButton = () => {
  const { signOut } = useClerk();
  const navigate = useNavigate();
  
  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };
  
  return (
    <div className="flex items-center gap-2">
      <SignedIn>
        <Button variant="ghost" onClick={handleSignOut}>
          Sair
        </Button>
      </SignedIn>
      <SignedOut>
        <Button variant="ghost" onClick={() => navigate('/login')}>
          Login
        </Button>
      </SignedOut>
    </div>
  );
};

// Auth required wrapper component for protected routes
export const RequireAuth = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <SignedIn>
        {children}
      </SignedIn>
      <SignedOut>
        <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background px-4">
          <div className="w-full max-w-md animate-fade-up text-center">
            <h2 className="text-2xl font-bold mb-4">Acesso Restrito</h2>
            <p className="mb-6 text-muted-foreground">
              Você precisa estar logado para acessar esta página.
            </p>
            <Button onClick={() => window.location.href = '/login'}>
              Fazer Login
            </Button>
          </div>
        </div>
      </SignedOut>
    </>
  );
};
