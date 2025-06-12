import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { MediaProvider } from "./context/MediaContext.jsx";
import { ServiceProvider } from "./context/ServiceContext.jsx";
import { BackendCartProvider } from "./context/BackendCart.jsx";
import { AuthProvider } from "./context/AuthContext.jsx"; // Import AuthProvider

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
