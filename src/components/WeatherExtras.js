// src/components/WeatherExtras.js
import React from "react";
import { motion } from "framer-motion";
import { useLanguage } from "../state/LanguageContext";

const WeatherExtras = ({ weatherData, forecastData }) => {
  const { t } = useLanguage();

  // If nothing to show yet, keep the DOM clean.
  if (!weatherData) return null;

  // ---- Extract + normalize inputs we need -----------------------------------
  const { sys } = weatherData;

  // OpenWeather returns sunrise/sunset as unix seconds → turn into Date once.
  const sunrise = sys?.sunrise ? new Date(sys.sunrise * 1000) : null;
  const sunset = sys?.sunset ? new Date(sys.sunset * 1000) : null;

  /**
   * UV index:
   * - Only available if you query "One Call" (or you manually add it to weatherData).
   * - If missing, we show "N/A" so the layout stays stable and honest.
   */
  const uvIndex = weatherData.uvi ?? "N/A";

  /**
   * Precipitation:
   * - Prefer the current rain in the last 1h if present (weatherData.rain["1h"]).
   * - Otherwise, peek at the next forecast slot's 3h rain volume as a coarse hint.
   * - If both are missing, call it 0 mm.
   */
  const currentRain = weatherData.rain?.["1h"];
  const forecastRain =
    forecastData?.list?.[0]?.rain?.["3h"] != null
      ? forecastData.list[0].rain["3h"]
      : null;

  const precipitation = currentRain ?? forecastRain ?? 0;

  // Consistent time formatting helper; returns "--:--" if date is absent.
  const timeFmt = (d) =>
    d
      ? d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      : "--:--";

  return (
    <motion.div
      // Gentle rise-in so this extra panel feels connected to the card above it.
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 mb-6 border border-gray-200 dark:border-gray-700"
    >
      {/* Section title keeps the same scale as other blocks for rhythm */}
      <h3 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white mb-4">
        {t("additionalInfo")}
      </h3>

      {/* 4-up grid: icons + labels keep scanning easy on mobile & desktop */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Sunrise */}
        <div className="text-center">
          {/* Simple icon chip—color suggests morning light */}
          <div className="flex justify-center mb-2">
            <svg
              className="w-6 h-6 text-yellow-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {t("sunrise")}
          </p>
          <p className="text-lg font-semibold text-gray-800 dark:text-white">
            {timeFmt(sunrise)}
          </p>
        </div>

        {/* Sunset */}
        <div className="text-center">
          {/* Dusk color hint so users can parse at a glance */}
          <div className="flex justify-center mb-2">
            <svg
              className="w-6 h-6 text-orange-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
            </svg>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {t("sunset")}
          </p>
          <p className="text-lg font-semibold text-gray-800 dark:text-white">
            {timeFmt(sunset)}
          </p>
        </div>

        {/* UV Index */}
        <div className="text-center">
          {/* Purple hue implies “intensity”; we keep it simple and readable */}
          <div className="flex justify-center mb-2">
            <svg
              className="w-6 h-6 text-purple-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {t("uvIndex")}
          </p>
          <p className="text-lg font-semibold text-gray-800 dark:text-white">
            {uvIndex}
          </p>
        </div>

        {/* Precipitation */}
        <div className="text-center">
          {/* Blue drop to imply rain; unit = mm as OW standard */}
          <div className="flex justify-center mb-2">
            <svg
              className="w-6 h-6 text-blue-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zm7-10a1 1 0 01.967.744L14.146 7.2 17 7a1 1 0 01.78 1.625l-3.5 4.5a1 1 0 01-1.561 0l-3.5-4.5A1 1 0 019 7l2.854.2-1.18-5.456A1 1 0 0112 2z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {t("precipitation")}
          </p>
          <p className="text-lg font-semibold text-gray-800 dark:text-white">
            {precipitation} mm
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default WeatherExtras;
