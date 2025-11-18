import React from "react";
import { motion } from "framer-motion";
import { useTheme } from "../state/ThemeContext";
import { useLanguage } from "../state/LanguageContext";
import WeatherSymbol from "./WeatherSymbol";

const localeFor = (lang) =>
  lang === "sv" ? "sv-SE" : lang === "ar" ? "ar-SA" : "en-US";

const ForecastItem = ({
  forecast,
  isSelected,
  onClick,
  position,
  hasHourlyData,
}) => {
  const { unit, isDark } = useTheme();
  const { language, t } = useLanguage();

  if (!forecast) return null;

  const date = new Date(forecast.dt * 1000);
  const locale = localeFor(language);

  // Start with TODAY (position 0). No "Yesterday".
  const dayLabel =
    position === 0
      ? t("today") || "today"
      : new Intl.DateTimeFormat(locale, { weekday: "short" }).format(date);

  const dateString = new Intl.DateTimeFormat(locale, {
    month: "short",
    day: "numeric",
  }).format(date);

  const temp = Math.round(forecast.main?.temp ?? 0);
  const symbol = unit === "celsius" ? "C" : "F";
  const icon = forecast.weather?.[0]?.icon;
  const desc = forecast.weather?.[0]?.description ?? "";

  // gradients (unchanged)
  const lightGrad = "bg-gradient-to-b from-sky-100 via-sky-50 to-blue-100";
  const lightGradToday =
    "bg-gradient-to-b from-sky-200 via-sky-100 to-blue-200";
  const darkGrad = "bg-gradient-to-b from-slate-800 via-slate-900 to-slate-950";
  const darkGradToday =
    "bg-gradient-to-b from-blue-900 via-slate-900 to-slate-950";

  const styles = {
    bg:
      position === 0
        ? isDark
          ? darkGradToday
          : lightGradToday
        : isDark
        ? darkGrad
        : lightGrad,
    text: isDark ? "text-white" : "text-gray-900",
    borderColor: isDark ? "border-slate-700" : "border-sky-200",
    ringSelected: isDark ? "ring-blue-400/70" : "ring-sky-400/70",
    hoverShadow: isDark ? "hover:shadow-blue-900/30" : "hover:shadow-sky-200",
  };

  // connect with hourly panel when selected (unchanged)
  const joinHourly =
    isSelected && hasHourlyData ? "rounded-b-none border-b-0 -mb-px z-10" : "";

  return (
    <motion.div
      whileHover={{ scale: 0.98, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onClick(forecast)}
      aria-pressed={isSelected}
      className={`forecast-card ${styles.bg} ${styles.text}
        border ${styles.borderColor} ${joinHourly}
        rounded-xl p-4 text-center shadow-md transition-all duration-150
        cursor-pointer min-w-[155px] shrink-0 origin-center transform-gpu
        ${isSelected ? `ring-2 ring-inset ${styles.ringSelected}` : ""} ${
        styles.hoverShadow
      }`}
    >
      <div className="mb-3">
        <p className="font-semibold text-sm sm:text-base capitalize">
          {dayLabel}
        </p>
        <p className="text-xs sm:text-sm opacity-80 mt-1">{dateString}</p>
      </div>

      {icon && <WeatherSymbol code={icon} size={36} className="my-1" />}

      <p
        className={`text-lg font-bold mb-2 ${position === 0 ? "text-xl" : ""}`}
      >
        {temp}°{symbol}
      </p>

      <p className="text-xs opacity-80 capitalize mb-3 truncate">{desc}</p>

      <div className="flex justify-center space-x-3 text-xs opacity-70">
        <span>💧 {forecast.main.humidity}%</span>
        <span>💨 {Math.round(forecast.wind.speed)}m/s</span>
      </div>
    </motion.div>
  );
};

export default ForecastItem;
