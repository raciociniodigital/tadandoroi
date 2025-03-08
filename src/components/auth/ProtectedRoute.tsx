
import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, isLoading, verifySubscription } = useAuth();
  const [hasSubscription, setHasSubscription] = useState<boolean | null>(null);
  const [checking, setChecking] = useState(true);
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    const checkSubscription = async () => {
      if (user) {
        const isActive = await verifySubscription();
        setHasSubscription(isActive);
      } else {
        setHasSubscription(false);
      }
      setChecking(false);
    };

    if (!isLoading) {
      checkSubscription();
    }
  }, [user, isLoading, verifySubscription]);

  if (isLoading || checking) {
    // Could replace with a loading component
    return <div className="flex min-h-screen items-center justify-center">Verificando acesso...</div>;
  }

  if (!user) {
    toast({
      title: "Acesso negado",
      description: "Faça login para acessar esta página",
      variant: "destructive",
    });
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!hasSubscription) {
    toast({
      title: "Assinatura necessária",
      description: "Você precisa de uma assinatura ativa para acessar esta página",
      variant: "destructive",
    });
    return <Navigate to="/plans" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
