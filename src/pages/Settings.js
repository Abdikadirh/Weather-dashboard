import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTheme } from "../state/ThemeContext";
import { useLanguage } from "../state/LanguageContext";

const Settings = () => {
  // Theme + units come from app-wide context
  const { isDark, toggleTheme, unit, toggleUnit } = useTheme();

  // i18n strings for labels/descriptions
  const { t } = useLanguage();

  // Local setting: whether user wants geolocation on startup
  const [useGeolocation, setUseGeolocation] = useState(false);

  // Load persisted geolocation preference on first mount
  useEffect(() => {
    const saved = localStorage.getItem("useGeolocation");
    if (saved) setUseGeolocation(saved === "true");
  }, []);

  // Toggle and persist geolocation preference
  const handleGeolocationToggle = () => {
    const newValue = !useGeolocation;
    setUseGeolocation(newValue);
    localStorage.setItem("useGeolocation", newValue.toString());
  };

  return (
    /**
     * Page shell:
     * - Give the settings page its own neutral surface (light gray / dark slate)
     * - Keep content centered and readable with a card
     */
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      {/* Subtle entrance animation so the page doesn’t “pop” in */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 sm:p-8"
      >
        {/* Page title (translated) */}
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6">
          {t("settings")}
        </h1>

        {/* Individual setting blocks */}
        <div className="space-y-6">
          {/* ===== Dark Mode =====
             Keep the switch visually consistent with the rest of the app. */}
          <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {t("darkMode")}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {t("toggleThemes")}
              </p>
            </div>

            {/* Simple pill switch: background is the state, knob slides */}
            <button
              onClick={toggleTheme}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                          ${isDark ? "bg-blue-600" : "bg-gray-200"}`}
              aria-label={t("darkMode")}
              title={t("darkMode")}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                            ${isDark ? "translate-x-6" : "translate-x-1"}`}
              />
            </button>
          </div>

          {/* ===== Temperature Unit =====
             Toggle between °C and °F with a middle switch and highlighted labels. */}
          <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {t("temperatureUnit")}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {t("switchUnits")}
              </p>
            </div>

            {/* Keep LTR flow for the small “°C  [switch]  °F” cluster */}
            <div className="flex items-center space-x-4 no-rtl-flip">
              {/* °C label gets emphasis when active */}
              <span
                className={`text-sm ${
                  unit === "celsius"
                    ? "font-bold text-blue-600"
                    : "text-gray-500"
                }`}
              >
                °C
              </span>

              {/* Middle switch flips the unit */}
              <button
                onClick={toggleUnit}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                            ${
                              unit === "fahrenheit"
                                ? "bg-blue-600"
                                : "bg-gray-200"
                            }`}
                aria-label={t("temperatureUnit")}
                title={t("temperatureUnit")}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                              ${
                                unit === "fahrenheit"
                                  ? "translate-x-6"
                                  : "translate-x-1"
                              }`}
                />
              </button>

              {/* °F label gets emphasis when active */}
              <span
                className={`text-sm ${
                  unit === "fahrenheit"
                    ? "font-bold text-blue-600"
                    : "text-gray-500"
                }`}
              >
                °F
              </span>
            </div>
          </div>

          {/* ===== Use my location =====
             Persisted flag that initial load reads to auto-fetch via geolocation. */}
          <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {t("useMyLocation")}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {t("autoLocation")}
              </p>
            </div>

            {/* Same pill switch pattern for consistency */}
            <button
              onClick={handleGeolocationToggle}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                          ${useGeolocation ? "bg-blue-600" : "bg-gray-200"}`}
              aria-label={t("useMyLocation")}
              title={t("useMyLocation")}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                            ${
                              useGeolocation ? "translate-x-6" : "translate-x-1"
                            }`}
              />
            </button>
          </div>

          {/* ===== Data source note =====
             Small info card crediting the API provider. */}
          <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {t("dataSource")}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              {t("weatherDataProvided")}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Settings;
