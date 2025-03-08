
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  BarChart3, 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  FileSpreadsheet,
  LogOut, 
  User,
  BadgeCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';
import { Badge } from '@/components/ui/badge';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { toast } = useToast();
  const { logout, user } = useAuth();
  
  const handleLogout = () => {
    logout();
    toast({
      title: "Logout realizado",
      description: "Você saiu da sua conta",
    });
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

  // Get plan type text
  const getPlanText = () => {
    if (!user?.subscription?.planType) return null;
    
    return user.subscription.planType === 'monthly' 
      ? 'Plano Mensal'
      : 'Plano Anual';
  };

  const planText = getPlanText();

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
                  className="text-2xl font-bold tracking-tight"
                >
                  <span className="text-foreground">Tá Dando</span><span className="text-primary">ROI</span>
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

            {/* Subscription status */}
            {!collapsed && planText && (
              <div className="mb-4 px-2">
                <Badge variant="outline" className="flex items-center gap-1 w-full justify-center py-1">
                  <BadgeCheck className="h-4 w-4 text-primary" />
                  {planText}
                </Badge>
              </div>
            )}

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
