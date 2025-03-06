
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SignedIn, SignedOut } from "@clerk/clerk-react";
import AuthSync from "./components/auth/AuthSync";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DailyTracking from "./pages/DailyTracking";
import Analytics from "./pages/Analytics";
import Records from "./pages/Records";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Rotas públicas */}
          <Route path="/" element={<Index />} />
          
          {/* Auth routes */}
          <Route 
            path="/login" 
            element={
              <SignedIn>
                <Navigate to="/daily" replace />
              </SignedIn>
            }
          />
          <Route 
            path="/login" 
            element={
              <SignedOut>
                <Login />
              </SignedOut>
            }
          />
          
          <Route 
            path="/register" 
            element={
              <SignedIn>
                <Navigate to="/daily" replace />
              </SignedIn>
            }
          />
          <Route 
            path="/register" 
            element={
              <SignedOut>
                <Register />
              </SignedOut>
            }
          />

          {/* Rotas protegidas */}
          <Route 
            path="/daily" 
            element={
              <AuthSync>
                <DailyTracking />
              </AuthSync>
            } 
          />
          <Route 
            path="/analytics" 
            element={
              <AuthSync>
                <Analytics />
              </AuthSync>
            } 
          />
          <Route 
            path="/records" 
            element={
              <AuthSync>
                <Records />
              </AuthSync>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <AuthSync>
                <Profile />
              </AuthSync>
            } 
          />
          
          {/* Redirecionar para a página principal se estiver logado */}
          <Route 
            path="/signin" 
            element={
              <SignedIn>
                <Navigate to="/daily" replace />
              </SignedIn>
            } 
          />
          
          {/* Rota para todas as outras páginas */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
