import { createContext, useState, useContext, useEffect, ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { 
  checkSubscriptionStatus, 
  SubscriptionStatus, 
  updateSubscriptionStatus 
} from "@/services/subscriptionService";

type User = {
  id: string;
  email: string;
  name?: string;
  subscription?: SubscriptionStatus;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  verifySubscription: () => Promise<boolean>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const publicPages = ['/', '/login', '/register', '/plans'];

  useEffect(() => {
    const checkAuth = async () => {
      const storedUser = localStorage.getItem("user");
      
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        
        if (parsedUser.id) {
          const subscriptionStatus = await checkSubscriptionStatus(parsedUser.id);
          parsedUser.subscription = subscriptionStatus;
          
          setUser(parsedUser);
          
          const isPublicPage = publicPages.some(page => location.pathname === page);
          if (!isPublicPage && !subscriptionStatus.isActive) {
            navigate('/plans');
            toast({
              title: "Assinatura necessária",
              description: "Você precisa de uma assinatura ativa para acessar esta área.",
              variant: "destructive",
            });
          }
        }
      }
      
      setIsLoading(false);
    };
    
    checkAuth();
  }, [location.pathname, navigate, toast]);

  const verifySubscription = async (): Promise<boolean> => {
    if (!user) return false;
    
    const subscriptionStatus = await checkSubscriptionStatus(user.id);
    
    const updatedUser = { ...user, subscription: subscriptionStatus };
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
    
    return subscriptionStatus.isActive;
  };

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUser: User = { 
        id: "123", 
        email 
      };
      
      const subscriptionStatus = await checkSubscriptionStatus(mockUser.id);
      mockUser.subscription = subscriptionStatus;
      
      setUser(mockUser);
      localStorage.setItem("user", JSON.stringify(mockUser));
      
      toast({
        title: "Login bem-sucedido",
        description: "Bem-vindo de volta ao Tá Dando ROI!",
      });
      
      if (subscriptionStatus.isActive) {
        navigate("/daily");
      } else {
        navigate("/plans");
        toast({
          title: "Assinatura necessária",
          description: "Você precisa de uma assinatura ativa para acessar todas as funcionalidades.",
        });
      }
    } catch (error) {
      toast({
        title: "Erro no login",
        description: "Email ou senha incorretos",
        variant: "destructive",
      });
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUser: User = { 
        id: "123", 
        email, 
        name 
      };
      
      const subscriptionStatus = { isActive: false };
      mockUser.subscription = subscriptionStatus;
      
      setUser(mockUser);
      localStorage.setItem("user", JSON.stringify(mockUser));
      
      toast({
        title: "Conta criada com sucesso",
        description: "Bem-vindo ao Tá Dando ROI!",
      });
      
      navigate("/plans");
    } catch (error) {
      toast({
        title: "Erro no cadastro",
        description: "Não foi possível criar sua conta",
        variant: "destructive",
      });
      console.error("Register error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      setUser(null);
      localStorage.removeItem("user");
      
      toast({
        title: "Logout realizado",
        description: "Você saiu da sua conta",
      });
      
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, verifySubscription }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
