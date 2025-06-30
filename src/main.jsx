import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import { MediaProvider } from './context/MediaContext.jsx';
import { ServiceProvider } from './context/ServiceContext.jsx';
import { BackendCartProvider } from './context/BackendCart.jsx';
import { AuthProvider } from './context/AuthContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <AuthProvider>
        <BackendCartProvider>
          <ServiceProvider>
            <MediaProvider>
              <App />
            </MediaProvider>
          </ServiceProvider>
        </BackendCartProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);