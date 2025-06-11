
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import PWAInstallPrompt from './components/PWAInstallPrompt'
import PWAOfflineIndicator from './components/PWAOfflineIndicator'

createRoot(document.getElementById("root")!).render(
  <>
    <App />
    <PWAInstallPrompt />
    <PWAOfflineIndicator />
  </>
);
