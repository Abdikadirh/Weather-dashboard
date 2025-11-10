import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { ThemeProvider } from "./state/ThemeContext";
import { LanguageProvider } from "./state/LanguageContext";
import { FavoritesProvider } from "./state/FavoritesContext";
import AppContent from "./AppContent";
import "./styles/index.css";

function App() {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <FavoritesProvider>
          <Router>
            <AppContent />
          </Router>
        </FavoritesProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
}

export default App;
