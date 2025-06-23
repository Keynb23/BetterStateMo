import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { MediaProvider } from "./context/MediaContext.jsx";
import { ServiceProvider } from "./context/ServiceContext.jsx";
import { BackendCartProvider } from "./context/BackendCart.jsx";
import { AuthProvider } from "./context/AuthContext.jsx"; // Import AuthProvider
import AOS from 'aos';
import 'aos/dist/aos.css';
import 'react-datepicker/dist/react-datepicker.css';

// Initialize AOS

AOS.init({
  duration: 1000, // global duration
  easing: 'ease-out-back', // global easing
  once: true, // animate only once
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      {/* AuthProvider must wrap all components that consume the AuthContext,
          including App and its children like Navbar */}
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
  </StrictMode>
);
