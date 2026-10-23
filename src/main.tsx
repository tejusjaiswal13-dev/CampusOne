import { Capacitor } from "@capacitor/core";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Capacitor native plugin initialization
async function initCapacitor() {
  try {
    if (Capacitor.isNativePlatform()) {
      // Status bar configuration
      const { StatusBar } = await import("@capacitor/status-bar");
      await StatusBar.setBackgroundColor({ color: "#142d3b" });

      // Splash screen auto-hide after app renders
      const { SplashScreen } = await import("@capacitor/splash-screen");
      await SplashScreen.hide();

      // Handle hardware back button
      const { App: CapApp } = await import("@capacitor/app");
      CapApp.addListener("backButton", ({ canGoBack }) => {
        if (canGoBack) {
          window.history.back();
        } else {
          CapApp.exitApp();
        }
      });

      console.log("[CampusOne] Native platform initialized");
    }
  } catch {
    // Running in web browser — plugins not available
    console.log("[CampusOne] Running in web mode");
  }
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

// Initialize native features after render
initCapacitor();
