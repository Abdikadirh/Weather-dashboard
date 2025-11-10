import React, { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

/**
 * Small helper hook so components can consume the theme safely.
 * Throws a friendly error if the provider is missing.
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  // Dark mode flag (drives Tailwind's `.dark` styles via a wrapper div)
  const [isDark, setIsDark] = useState(false);

  // Temperature unit for the app's weather readouts
  // Valid values: 'celsius' | 'fahrenheit'
  const [unit, setUnit] = useState("celsius");

  /**
   * On mount:
   * - Hydrate theme + unit from localStorage if present
   * (so the UI remembers the user's last choices).
   *
   * NOTE: We only read once here; later updates are written in the toggles below.
   */
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const savedUnit = localStorage.getItem("temperatureUnit");

    if (savedTheme) {
      setIsDark(savedTheme === "dark");
    }
    if (savedUnit) {
      setUnit(savedUnit);
    }

    // OPTIONAL: Respect system preference on first load if nothing saved yet
    // if (!savedTheme && window.matchMedia?.("(prefers-color-scheme: dark)").matches) {
    //   setIsDark(true);
    //   localStorage.setItem("theme", "dark");
    // }
  }, []);

  /**
   * Toggle dark/light theme.
   * - Flips state
   * - Persists the new value to localStorage
   */
  const toggleTheme = () => {
    setIsDark((prev) => {
      const next = !prev;
      localStorage.setItem("theme", next ? "dark" : "light");
      return next;
    });
  };

  /**
   * Toggle temperature unit between Celsius and Fahrenheit.
   * - Flips state
   * - Persists to localStorage
   */
  const toggleUnit = () => {
    setUnit((prev) => {
      const next = prev === "celsius" ? "fahrenheit" : "celsius";
      localStorage.setItem("temperatureUnit", next);
      return next;
    });
  };

  // Values exposed to all consumers
  const value = {
    isDark,
    toggleTheme,
    unit,
    toggleUnit,
  };

  return (
    <ThemeContext.Provider value={value}>
      {/* Tailwind dark mode strategy:
          Wrapping the entire app with a div that has class "dark" when isDark is true.
          This lets all `dark:` utility classes activate automatically. */}
      <div className={isDark ? "dark" : ""}>{children}</div>
    </ThemeContext.Provider>
  );
};
