import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { MediaProvider } from "./context/MediaContext.jsx";
import { ServiceProvider } from "./context/ServiceContext.jsx";


createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
    <ServiceProvider>
      <MediaProvider>
        <App />
      </MediaProvider>
    </ServiceProvider>
  </BrowserRouter>
  </StrictMode>
);
