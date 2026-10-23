import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import App from "./App.jsx";
import { ScannerProvider } from "./hooks/useScannerState";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ScannerProvider>
      <App />
    </ScannerProvider>
  </StrictMode>
);