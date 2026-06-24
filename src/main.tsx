import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './components/providers/AuthProvider';
import { PlannerProvider } from './components/providers/PlannerProvider';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <PlannerProvider>
          <App />
        </PlannerProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
