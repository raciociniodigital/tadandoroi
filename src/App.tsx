
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SignedIn, SignedOut, useAuth } from "@clerk/clerk-react";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DailyTracking from "./pages/DailyTracking";
import Analytics from "./pages/Analytics";
import Records from "./pages/Records";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import ClerkSupabaseDebug from "./pages/ClerkSupabaseDebug"; // Add this new import
import { AuthProvider } from "./providers/AuthProvider";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isSignedIn, isLoaded } = useAuth();
  
  if (!isLoaded) {
    return <div className="flex h-screen w-full items-center justify-center">Carregando...</div>;
  }
  
  if (!isSignedIn) {
    return <Navigate to="/login" />;
  }
  
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Rotas públicas */}
            <Route path="/" element={<Index />} />
            
            {/* Auth routes */}
            <Route path="/login" element={
              <>
                <SignedIn><Navigate to="/daily" replace /></SignedIn>
                <SignedOut><Login /></SignedOut>
              </>
            } />
            
            <Route path="/register" element={
              <>
                <SignedIn><Navigate to="/daily" replace /></SignedIn>
                <SignedOut><Register /></SignedOut>
              </>
            } />

            {/* Debug route */}
            <Route path="/debug" element={
              <ProtectedRoute>
                <ClerkSupabaseDebug />
              </ProtectedRoute>
            } />

            {/* Rotas protegidas */}
            <Route path="/daily" element={
              <ProtectedRoute>
                <DailyTracking />
              </ProtectedRoute>
            } />
            
            <Route path="/analytics" element={
              <ProtectedRoute>
                <Analytics />
              </ProtectedRoute>
            } />
            
            <Route path="/records" element={
              <ProtectedRoute>
                <Records />
              </ProtectedRoute>
            } />
            
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            
            {/* Rota para todas as outras páginas */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
