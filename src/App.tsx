import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile/Profile';
import EditProfile from './pages/Profile/EditProfile';
import Settings from './pages/Settings';
import Notifications from './pages/Notifications';
import ExploreEvents from './pages/Explore/ExploreEvents';
import CreateEvent from './pages/Events/CreateEvent';
import EventDetails from './pages/Events/EventDetails';
import ProfessionalProfile from './pages/Profile/ProfessionalProfile';
import BookProfessional from './pages/Bookings/BookProfessional';
import Checkout from './pages/Checkout';
import { useAuth } from './hooks/useAuth';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import SplashScreen from './components/SplashScreen';
import Cart from "@/pages/Cart";

const queryClient = new QueryClient();

function App() {
  const { authState, loading } = useAuth();
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    if (!loading) {
      setTimeout(() => {
        setShowSplash(false);
      }, 2000);
    }
  }, [loading]);

  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    if (loading) {
      return <div className="flex items-center justify-center min-h-screen">Carregando...</div>;
    }
    if (!authState) {
      return <Navigate to="/login" />;
    }
    return <>{children}</>;
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-toca-background">
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/meu-perfil" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/editar-perfil" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
            <Route path="/configuracoes" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="/notificacoes" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
            <Route path="/explorar" element={<ExploreEvents />} />
            <Route path="/eventos" element={<ProtectedRoute><CreateEvent /></ProtectedRoute>} />
            <Route path="/eventos/:id" element={<ProtectedRoute><EventDetails /></ProtectedRoute>} />
            <Route path="/profissional/:id" element={<ProtectedRoute><ProfessionalProfile /></ProtectedRoute>} />
            <Route path="/reservar/:id" element={<ProtectedRoute><BookProfessional /></ProtectedRoute>} />
            <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
            
            {/* Cart route */}
            <Route 
              path="/carrinho" 
              element={
                <ProtectedRoute>
                  <Cart />
                </ProtectedRoute>
              } 
            />
            
          </Routes>
        </Router>
        <Toaster />
        <SplashScreen />
      </div>
    </QueryClientProvider>
  );
}

export default App;
