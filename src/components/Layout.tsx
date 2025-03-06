
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  BarChart3, 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  FileSpreadsheet,
  LogOut, 
  User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';
import { useSignOut } from '@clerk/clerk-react';
import { useAuthSync } from '@/hooks/useAuthSync';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { toast } = useToast();
  const { signOut } = useSignOut();
  const navigate = useNavigate();
  
  // Use o hook de sincronização de autenticação
  useAuthSync();
  
  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "Logout realizado com sucesso",
        description: "Você foi desconectado da sua conta",
      });
      navigate('/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      toast({
        title: "Erro ao fazer logout",
        description: "Ocorreu um erro ao tentar desconectar da sua conta",
        variant: "destructive",
      });
    }
  };

  const navigation = [
    { 
      name: 'Registro Diário', 
      path: '/daily', 
      icon: Calendar,
      active: location.pathname === '/daily',
    },
    { 
      name: 'Dashboard', 
      path: '/analytics', 
      icon: BarChart3,
      active: location.pathname === '/analytics',
    },
    {
      name: 'Tabela de Registros', 
      path: '/records', 
      icon: FileSpreadsheet,
      active: location.pathname === '/records',
    },
    { 
      name: 'Perfil', 
      path: '/profile', 
      icon: User,
      active: location.pathname === '/profile',
    }
  ];

  return (
    <div className="flex min-h-screen w-full bg-background text-foreground">
      {/* Sidebar */}
      <aside
        className={cn(
          "bg-sidebar fixed z-30 h-full transition-all duration-300 ease-in-out",
          collapsed ? "w-16" : "w-64"
        )}
      >
        <div className="flex h-full flex-col justify-between p-3">
          <div>
            {/* Logo */}
            <div className="mb-8 flex items-center justify-between px-2 py-4">
              {!collapsed && (
                <Link 
                  to="/" 
                  className="text-2xl font-bold tracking-tight text-gradient"
                >
                  Traffic<span className="text-foreground">Tracker</span>
                </Link>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="ml-auto text-muted-foreground hover:text-foreground"
                onClick={() => setCollapsed(!collapsed)}
                aria-label={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
              >
                {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
              </Button>
            </div>

            {/* Navigation */}
            <nav className="space-y-1.5">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={cn(
                    "flex items-center rounded-md px-3 py-2.5 text-sm font-medium transition-all",
                    item.active
                      ? "bg-primary/10 text-primary hover:bg-primary/15"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  )}
                >
                  <item.icon
                    className={cn(
                      "mr-3 h-5 w-5",
                      collapsed ? "mr-0" : "",
                      item.active ? "text-primary" : "text-muted-foreground"
                    )}
                  />
                  {!collapsed && <span>{item.name}</span>}
                </Link>
              ))}
            </nav>
          </div>

          {/* Logout button */}
          <Button
            variant="ghost"
            onClick={handleLogout}
            className={cn(
              "flex items-center rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive",
              collapsed ? "justify-center" : "justify-start"
            )}
          >
            <LogOut className="mr-3 h-5 w-5" />
            {!collapsed && <span>Logout</span>}
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <main
        className={cn(
          "flex-1 transition-all duration-300 ease-in-out",
          collapsed ? "ml-16" : "ml-64"
        )}
      >
        <div className="animate-fade-in container mx-auto py-6 px-4">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
