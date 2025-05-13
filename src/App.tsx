
import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/Dashboard";
import ExploreProfessionals from "./pages/Explore/ExploreProfessionals";
import ExploreEvents from "./pages/Explore/ExploreEvents";
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

const queryClient = new QueryClient();

const App = () => {
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            
            {/* Auth Routes */}
            <Route path="/login" element={<AuthPage initialMode="login" />} />
            <Route path="/cadastro" element={<AuthPage initialMode="register" />} />
            
            {/* Dashboard Routes */}
            <Route path="/dashboard" element={<Dashboard />} />
            
            {/* Profile Routes */}
            <Route path="/meu-perfil" element={<MyProfile />} />
            <Route path="/editar-perfil" element={<EditProfile />} />
            <Route path="/perfil-profissional" element={<ProfessionalProfile />} />
            <Route path="/profissional/:id" element={<ProfessionalProfile />} />
            
            {/* Explore Routes */}
            <Route path="/explorar" element={<ExploreProfessionals />} />
            <Route path="/eventos" element={<ExploreEvents />} />
            
            {/* Event Routes */}
            <Route path="/criar-evento" element={<CreateEvent />} />
            
            {/* Professional Routes */}
            <Route path="/minhas-candidaturas" element={<MyApplications />} />
            
            {/* Booking Routes */}
            <Route path="/reservar" element={<BookProfessional />} />
            <Route path="/reservar/:id" element={<BookProfessional />} />
            <Route path="/checkout" element={<Checkout />} />
            
            {/* Utility Routes */}
            <Route path="/notificacoes" element={<Notifications />} />
            <Route path="/configuracoes" element={<Settings />} />
            <Route path="/sobre" element={<About />} />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
