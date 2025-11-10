import React from "react";
import { motion } from "framer-motion";
import { useLanguage } from "../state/LanguageContext";

const WeatherAlerts = ({ alerts }) => {
  const { t } = useLanguage();

  // If no alerts are provided, render nothing to keep the UI clean.
  if (!alerts || alerts.length === 0) return null;

  return (
    // Smoothly slide/fade the banner in when alerts appear.
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6"
    >
      {/* Card container with light/dark theme colors */}
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
        <div className="flex items-start">
          {/* Left-side warning icon */}
          <div className="flex-shrink-0">
            <svg
              className="w-5 h-5 text-red-400"
              fill="currentColor"
              viewBox="0 0 20 20"
              aria-hidden="true" // purely decorative
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </div>

          {/* Right-side content: header + list of alerts */}
          <div className="ml-3 flex-1">
            {/* Localized title with total count */}
            <h3 className="text-sm font-medium text-red-800 dark:text-red-300">
              {t("weatherAlerts")} ({alerts.length})
            </h3>

            {/* Render each alert block with event, description, and time range */}
            {alerts.map((alert, index) => (
              <div
                key={index}
                className="mt-2 text-sm text-red-700 dark:text-red-400"
              >
                {/* Event name (e.g., "Wind Warning") */}
                <p className="font-semibold">{alert.event}</p>

                {/* Provider’s description text (raw from API) */}
                <p className="mt-1">{alert.description}</p>

                {/* Start–end timestamps (UNIX seconds → local time) */}
                <p className="text-xs mt-2">
                  {new Date(alert.start * 1000).toLocaleString()}{" "}
                  -{" "}
                  {new Date(alert.end * 1000).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default WeatherAlerts;
