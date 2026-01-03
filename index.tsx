import React from "react";
import { createRoot } from "react-dom/client";
import App from "./src/App";
import "./index.css"; // Assuming index.css exists or we rely on GlobalStyles
import { initAppCheck } from "./src/services/appCheck";

// Initialize Firebase App Check BEFORE rendering
initAppCheck();

const container = document.getElementById("root");
if (container) {
    const root = createRoot(container);
    root.render(
        <React.StrictMode>
            <App />
        </React.StrictMode>
    );
}
