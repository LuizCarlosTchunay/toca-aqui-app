
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import './index.css';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './hooks/useAuth';

// Pages
import Index from './pages/Index';
import Dashboard from './pages/Dashboard';
import EditProfile from './pages/Profile/EditProfile';
import ProfessionalProfile from './pages/Profile/ProfessionalProfile';
import EventDetail from './pages/Events/EventDetail';
import CreateEvent from './pages/Events/CreateEvent';
import EditEvent from './pages/Events/EditEvent';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/perfil" element={<ProtectedRoute><Index /></ProtectedRoute>} />
          <Route path="/editar-perfil" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
          <Route path="/profissional/:id" element={<ProfessionalProfile />} />
          <Route path="/explorar" element={<Index />} />
          
          {/* Events routes */}
          <Route 
            path="/eventos/:id" 
            element={
              <EventDetail />
            } 
          />
          <Route 
            path="/eventos/editar/:id" 
            element={
              <ProtectedRoute>
                <EditEvent />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/criar-evento" 
            element={
              <ProtectedRoute>
                <CreateEvent />
              </ProtectedRoute>
            } 
          />
          
          {/* Booking route */}
          <Route path="/reservar/:professionalId" element={<ProtectedRoute><Index /></ProtectedRoute>} />
        </Routes>
        <Toaster position="top-center" richColors />
      </Router>
    </AuthProvider>
  );
}

export default App;
