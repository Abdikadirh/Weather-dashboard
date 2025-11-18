// HourlyForecast.js
import React from "react";
import { motion } from "framer-motion";
import { useTheme } from "../state/ThemeContext";
import { useLanguage } from "../state/LanguageContext";
import WeatherSymbol from "./WeatherSymbol";

const HourlyForecast = ({ forecastData, selectedDay }) => {
  const { unit, isDark } = useTheme();
  const { t, language } = useLanguage();
  if (!forecastData || !selectedDay) return null;

  // Use city timezone from OpenWeather so grouping matches the API
  const tz = forecastData?.city?.timezone ?? 0; // seconds offset from UTC
  const key = (unix) => new Date((unix + tz) * 1000).toISOString().slice(0, 10);

  const selectedKey = key(selectedDay.dt);
  const hourlyData = forecastData.list.filter(
    (item) => key(item.dt) === selectedKey
  );

  const symbol = unit === "celsius" ? "C" : "F";

  // Format date for display
  const selectedDateFormatted = new Date(
    selectedDay.dt * 1000
  ).toLocaleDateString(
    language === "ar" ? "ar-SA" : language === "sv" ? "sv-SE" : "en-US",
    { weekday: "long", month: "short", day: "numeric" }
  );

  // Gradient like day forecast container (light/dark) — colors unchanged
  const containerGradient = isDark
    ? "bg-gradient-to-b from-slate-900/60 via-slate-900/20 to-slate-900/90"
    : "bg-gradient-to-b from-sky-50/90 via-sky-50/70 to-indigo-50/70";

  return (
    <motion.div
      data-hourly-anchor
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className={[
        "hourly-forecast connected",
        containerGradient,
        "rounded-xl p-3 sm:p-4 backdrop-blur-sm", // smaller padding -> less height
        "border border-gray-300/40 dark:border-white/200 shadow-sm",
      ].join(" ")}
    >
      <h4 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
        {t("hourlyForecastTitle")} - {selectedDateFormatted}
      </h4>

      {/* Horizontal scroller with thin scrollbar */}
      <div
        className="
             flex flex-nowrap items-stretch gap-2
    overflow-x-auto overscroll-x-contain
    snap-x snap-mandatory
    pb-3 px-1 sm:px-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent hourly-scroll
        "
      >
        {hourlyData.map((hour, index) => {
          const time = new Date(hour.dt * 1000);
          const hourString = time.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          });

          return (
            <div
              key={index}
              className={[
                "flex-none shrink-0 snap-start",
                // smaller width
                "w-[clamp(92px,11vw,105px)] sm:w-[96px] md:w-[105px]",
                // visuals (colors unchanged) + smaller padding
                "rounded-xl border shadow p-1.5 text-center",
                isDark
                  ? "bg-gray-700/50 border-gray-600/50"
                  : "bg-blue-200/40 border-blue-300/30",
                "transition hover:shadow-md",
              ].join(" ")}
            >
              <span className="text-[11px] font-medium text-gray-600 dark:text-gray-300">
                {hourString}
              </span>

              <WeatherSymbol
                code={hour.weather[0].icon}
                size={28} // smaller icon
                className="my-1"
              />

              <span className="text-sm font-bold text-gray-800 dark:text-yellow-100">
                {Math.round(hour.main.temp)}°{symbol}
              </span>

              <span className="block mt-1 text-[10px] text-gray-500 dark:text-gray-400 capitalize text-center">
                {hour.weather[0].description}
              </span>

              <div className="flex items-center justify-center gap-2 mt-1.5">
                <span className="text-[10px] text-gray-500 dark:text-gray-400">
                  💧 {hour.main.humidity}%
                </span>
                <span className="text-[10px] text-gray-500 dark:text-gray-400">
                  💨 {hour.wind.speed}m/s
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default HourlyForecast;
