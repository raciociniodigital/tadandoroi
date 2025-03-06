
import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";

const NotFound = () => {
  const location = useLocation();
  const { isSignedIn } = useAuth();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="text-center max-w-md">
        <h1 className="text-7xl font-bold text-primary mb-2">404</h1>
        <h2 className="text-2xl font-semibold text-foreground mb-4">Oops! Página não encontrada</h2>
        <p className="text-muted-foreground mb-8">
          A página que você está procurando não existe ou foi movida.
        </p>
        {isSignedIn ? (
          <Link 
            to="/daily" 
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Voltar para o Dashboard
          </Link>
        ) : (
          <Link 
            to="/" 
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Voltar para a Página Inicial
          </Link>
        )}
      </div>
    </div>
  );
};

export default NotFound;
