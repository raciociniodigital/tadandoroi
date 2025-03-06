
import { createContext, useState, useContext, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

type User = {
  id: string;
  email: string;
  name?: string;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is already logged in (from localStorage)
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      // Simulate API call for login
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For a real implementation, this would be replaced with an actual API call
      const mockUser = { id: "123", email };
      setUser(mockUser);
      localStorage.setItem("user", JSON.stringify(mockUser));
      
      toast({
        title: "Login bem-sucedido",
        description: "Bem-vindo de volta ao TrafficTracker!",
      });
      
      navigate("/daily");
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
      // Simulate API call for registration
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For a real implementation, this would be replaced with an actual API call
      const mockUser = { id: "123", email, name };
      setUser(mockUser);
      localStorage.setItem("user", JSON.stringify(mockUser));
      
      toast({
        title: "Conta criada com sucesso",
        description: "Bem-vindo ao TrafficTracker!",
      });
      
      navigate("/daily");
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
      // Clear user from state and localStorage
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
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
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
