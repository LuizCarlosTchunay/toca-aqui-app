
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import Index from "./pages/Index";
import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/Dashboard";
import MyProfile from "./pages/Profile/MyProfile";
import EditProfile from "./pages/Profile/EditProfile";
import ProfessionalProfile from "./pages/Profile/ProfessionalProfile";
import CreateEvent from "./pages/Events/CreateEvent";
import EventDetail from "./pages/Events/EventDetail";
import ExploreEvents from "./pages/Explore/ExploreEvents";
import ExploreProfessionals from "./pages/Explore/ExploreProfessionals";
import MyApplications from "./pages/Professional/MyApplications";
import BookProfessional from "./pages/Bookings/BookProfessional";
import Checkout from "./pages/Checkout";
import Notifications from "./pages/Notifications";
import Settings from "./pages/Settings";
import About from "./pages/About";
import Contact from "./pages/Contact";
import PasswordReset from "./pages/PasswordReset";
import TermsOfUse from "./pages/TermsOfUse";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import NotificationManager from "./components/NotificationManager";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes
      retry: (failureCount, error: any) => {
        // Only retry on network errors, not on 4xx/5xx HTTP errors
        if (error?.status >= 400 && error?.status < 600) {
          return false;
        }
        return failureCount < 3;
      },
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      refetchOnReconnect: true
    },
    mutations: {
      retry: 1
    }
  }
});

function App() {
  console.log('App - rendering');
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            {/* Notification Manager - handles push notifications globally */}
            <NotificationManager />
            
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<AuthPage />} />
              <Route path="/register" element={<AuthPage />} />
              <Route path="/eventos" element={<ExploreEvents />} />
              <Route path="/eventos/:id" element={<EventDetail />} />
              <Route path="/profissionais" element={<ExploreProfessionals />} />
              <Route path="/perfil/:id" element={<ProfessionalProfile />} />
              <Route path="/sobre" element={<About />} />
              <Route path="/contato" element={<Contact />} />
              <Route path="/redefinir-senha" element={<PasswordReset />} />
              <Route path="/termos-de-uso" element={<TermsOfUse />} />
              <Route path="/politica-de-privacidade" element={<PrivacyPolicy />} />

              {/* Protected routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/meu-perfil" element={
                <ProtectedRoute>
                  <MyProfile />
                </ProtectedRoute>
              } />
              <Route path="/editar-perfil" element={
                <ProtectedRoute>
                  <EditProfile />
                </ProtectedRoute>
              } />
              <Route path="/criar-evento" element={
                <ProtectedRoute>
                  <CreateEvent />
                </ProtectedRoute>
              } />
              <Route path="/minhas-candidaturas" element={
                <ProtectedRoute>
                  <MyApplications />
                </ProtectedRoute>
              } />
              <Route path="/contratar/:id" element={
                <ProtectedRoute>
                  <BookProfessional />
                </ProtectedRoute>
              } />
              <Route path="/checkout" element={
                <ProtectedRoute>
                  <Checkout />
                </ProtectedRoute>
              } />
              <Route path="/notifications" element={
                <ProtectedRoute>
                  <Notifications />
                </ProtectedRoute>
              } />
              <Route path="/configuracoes" element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              } />

              {/* 404 route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
