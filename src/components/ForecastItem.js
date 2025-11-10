import React from "react";
import { motion } from "framer-motion";
import { useTheme } from "../state/ThemeContext";
import { useLanguage } from "../state/LanguageContext";

// Pick a locale for date formatting based on current UI language
const localeFor = (lang) =>
  lang === "sv" ? "sv-SE" : lang === "ar" ? "ar-SA" : "en-US";

const ForecastItem = ({ forecast }) => {
  const { unit, isDark } = useTheme();
  const { language } = useLanguage();

  // No data? Nothing to render.
  if (!forecast) return null;

  // API can give us either `dt` (unix seconds) or `dt_txt` (ISO-ish string)
  const date = forecast.dt
    ? new Date(forecast.dt * 1000)
    : new Date(forecast.dt_txt);

  const locale = localeFor(language);

  // Format weekday and time using the chosen locale
  const weekdayShort = new Intl.DateTimeFormat(locale, {
    weekday: "short",
  }).format(date);
  const hour = new Intl.DateTimeFormat(locale, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);

  // Basic weather bits
  const temp = Math.round(forecast.main?.temp ?? 0);
  const icon = forecast.weather?.[0]?.icon; // e.g. "10d" or "10n"
  const desc = forecast.weather?.[0]?.description ?? ""; // human-readable
  const condition = forecast.weather?.[0]?.main?.toLowerCase() || "clear"; // "rain", "clouds", etc.
  const symbol = unit === "celsius" ? "C" : "F";

  /**
   * Decide background / border / text colors so each tile looks readable
   * in both dark and light themes, and also hints at the weather type.
   */
  const getForecastColors = () => {
    const isDay = icon?.includes("d");

    // Night tiles: cooler blues in both themes
    if (!isDay) {
      return {
        bg: isDark ? "bg-blue-900/40" : "bg-blue-100/70",
        text: isDark ? "text-white" : "text-gray-900",
        border: "border-blue-400/30",
      };
    }

    // Daytime tiles: vary color by condition
    switch (condition) {
      case "clear":
        return {
          bg: isDark ? "bg-orange-900/40" : "bg-yellow-100/80",
          text: isDark ? "text-white" : "text-gray-900",
          border: "border-yellow-400/30",
        };
      case "clouds":
        return {
          bg: isDark ? "bg-gray-700/40" : "bg-gray-200/80",
          text: isDark ? "text-white" : "text-gray-900",
          border: "border-gray-400/30",
        };
      case "rain":
      case "drizzle":
        return {
          bg: isDark ? "bg-blue-800/40" : "bg-blue-200/80",
          text: isDark ? "text-white" : "text-gray-900",
          border: "border-blue-500/30",
        };
      case "snow":
        return {
          bg: isDark ? "bg-blue-300/40" : "bg-white/80",
          text: isDark ? "text-white" : "text-gray-900",
          border: "border-blue-200/30",
        };
      default:
        // Fallback for everything else (mist, haze, etc.)
        return {
          bg: isDark ? "bg-gray-600/40" : "bg-gray-100/80",
          text: isDark ? "text-white" : "text-gray-900",
          border: "border-gray-300/30",
        };
    }
  };

  const c = getForecastColors();

  return (
    <motion.div
      // Tiny lift on hover so the card feels clickable (even if it isn’t)
      whileHover={{ scale: 1.04, y: -2 }}
      className={`${c.bg} ${c.border} ${c.text} rounded-xl p-3 sm:p-4 text-center shadow-md border transition-transform duration-150 backdrop-blur-sm`}
    >
      {/* Top: day + time */}
      <p className="font-semibold text-sm sm:text-base">{weekdayShort}</p>
      <p className="text-xs sm:text-sm/none opacity-80">{hour}</p>

      {/* Weather icon (when API provides one) */}
      {icon && (
        <img
          src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
          alt={desc}
          className="w-10 h-10 sm:w-12 sm:h-12 mx-auto my-2"
        />
      )}

      {/* Temperature + description */}
      <p className="text-lg font-bold">
        {temp}°{symbol}
      </p>
      <p className="text-xs opacity-80 capitalize mt-1">{desc}</p>
    </motion.div>
  );
};

export default ForecastItem;
