
import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/Dashboard";
import ExploreProfessionals from "./pages/Explore/ExploreProfessionals";
import ExploreEvents from "./pages/Explore/ExploreEvents";
import EventDetail from "./pages/Events/EventDetail";
import SplashScreen from "./components/SplashScreen";
import About from "./pages/About";
import EditProfile from "./pages/Profile/EditProfile";
import ProfessionalProfile from "./pages/Profile/ProfessionalProfile";
import MyProfile from "./pages/Profile/MyProfile";
import CreateEvent from "./pages/Events/CreateEvent";
import MyApplications from "./pages/Professional/MyApplications";
import Notifications from "./pages/Notifications";
import Settings from "./pages/Settings";
import BookProfessional from "./pages/Bookings/BookProfessional";
import Checkout from "./pages/Checkout";
import TermsOfUse from "./pages/TermsOfUse";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Contact from "./pages/Contact";
import { AuthProvider } from "./hooks/useAuth";
import PasswordReset from "./pages/PasswordReset";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Prevent auto refetching which can cause issues during navigation
      refetchOnWindowFocus: false,
      // Prevent retry loop which can cause black screens
      retry: 1,
      // Add proper stale time to prevent unnecessary refetches
      staleTime: 30000
    },
  },
});

const App = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [isReady, setIsReady] = useState(false);

  const handleSplashComplete = () => {
    setShowSplash(false);
    // Add a small delay before rendering the app to ensure smooth transition
    setTimeout(() => setIsReady(true), 100);
  };

  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  if (!isReady) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-toca-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-toca-accent"></div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              
              {/* Auth Routes */}
              <Route path="/login" element={<AuthPage initialMode="login" />} />
              <Route path="/cadastro" element={<AuthPage initialMode="register" />} />
              <Route path="/recuperar-senha" element={<AuthPage initialMode="reset-password" />} />
              <Route path="/reset-password" element={<PasswordReset />} />
              
              {/* Dashboard Routes */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              
              {/* Profile Routes */}
              <Route 
                path="/meu-perfil" 
                element={
                  <ProtectedRoute>
                    <MyProfile />
                  </ProtectedRoute>
                } 
              />
              <Route path="/perfil" element={<Navigate to="/meu-perfil" replace />} />
              <Route 
                path="/editar-perfil" 
                element={
                  <ProtectedRoute>
                    <EditProfile />
                  </ProtectedRoute>
                } 
              />
              <Route path="/perfil-profissional" element={<ProfessionalProfile />} />
              <Route path="/profissional/:id" element={<ProfessionalProfile />} />
              
              {/* Explore Routes */}
              <Route path="/explorar" element={<ExploreProfessionals />} />
              <Route path="/eventos" element={<ExploreEvents />} />
              <Route path="/eventos/:id" element={<EventDetail />} />
              
              {/* Event Routes */}
              <Route 
                path="/criar-evento" 
                element={
                  <ProtectedRoute>
                    <CreateEvent />
                  </ProtectedRoute>
                } 
              />
              
              {/* Professional Routes */}
              <Route 
                path="/minhas-candidaturas" 
                element={
                  <ProtectedRoute>
                    <MyApplications />
                  </ProtectedRoute>
                } 
              />
              
              {/* Booking Routes */}
              <Route 
                path="/reservar" 
                element={
                  <ProtectedRoute>
                    <BookProfessional />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/reservar/:id" 
                element={
                  <ProtectedRoute>
                    <BookProfessional />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/checkout" 
                element={
                  <ProtectedRoute>
                    <Checkout />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/checkout/:id" 
                element={
                  <ProtectedRoute>
                    <Checkout />
                  </ProtectedRoute>
                } 
              />
              
              {/* Static Info Routes */}
              <Route path="/sobre" element={<About />} />
              <Route path="/termos" element={<TermsOfUse />} />
              <Route path="/privacidade" element={<PrivacyPolicy />} />
              <Route path="/contato" element={<Contact />} />
              
              {/* Utility Routes */}
              <Route 
                path="/notificacoes" 
                element={
                  <ProtectedRoute>
                    <Notifications />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/configuracoes" 
                element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                } 
              />
              
              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
