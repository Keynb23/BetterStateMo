import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { MediaProvider } from "./context/MediaContext.jsx";
import { ServiceProvider } from "./context/ServiceContext.jsx";
import { BackendCartProvider } from "./context/BackendCart.jsx";


createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
    <BackendCartProvider>
      <ServiceProvider>
        <MediaProvider>
          <App />
        </MediaProvider>
      </ServiceProvider>
    </BackendCartProvider>
  </BrowserRouter>
  </StrictMode>
);
