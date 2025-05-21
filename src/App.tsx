
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import './index.css';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './hooks/useAuth';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import EditProfile from './pages/Profile/EditProfile';
import ProfessionalProfile from './pages/Profile/ProfessionalProfile';
import Explore from './pages/Explore';
import EventDetail from './pages/Events/EventDetail';
import CreateEvent from './pages/Events/CreateEvent';
import EditEvent from './pages/Events/EditEvent';
import Booking from './pages/Booking';
import EventsPage from './pages/Events';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/perfil" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/editar-perfil" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
          <Route path="/profissional/:id" element={<ProfessionalProfile />} />
          <Route path="/explorar" element={<Explore />} />
          
          {/* Events routes */}
          <Route path="/eventos" element={<EventsPage />} />
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
          <Route path="/reservar/:professionalId" element={<ProtectedRoute><Booking /></ProtectedRoute>} />
        </Routes>
        <Toaster position="top-center" richColors />
      </AuthProvider>
    </Router>
  );
}

export default App;
