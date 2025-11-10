import React from "react";
import { motion } from "framer-motion";
import { useTheme } from "../state/ThemeContext";
import { useFavorites } from "../state/FavoritesContext";
import { useLanguage } from "../state/LanguageContext";

/**
 * Decide which sky background class to use based on the current weather.
 * This only picks a broad vibe; detailed coloring is handled by the card overlay.
 */
const themeFromWeather = (w) => {
  const main = (w?.weather?.[0]?.main || "").toLowerCase();
  const icon = w?.weather?.[0]?.icon || ""; // openweather icons end with d/n for day/night
  const isNight = icon.endsWith("n");

  if (main.includes("thunder")) return "sky-thunder";
  if (main.includes("rain") || main.includes("drizzle")) return "sky-rain";
  if (main.includes("snow")) return "sky-snow";
  if (main.includes("mist") || main.includes("fog") || main.includes("haze"))
    return "sky-mist";
  if (main.includes("cloud")) return "sky-clouds";
  if (main.includes("clear")) return isNight ? "sky-clouds" : "sky-clear";
  return "sky-clouds";
};

const WeatherCard = ({ weatherData }) => {
  const { unit, isDark } = useTheme();
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  const { t } = useLanguage();

  // Safety: if the parent renders before data arrives, render nothing.
  if (!weatherData) return null;

  // Unpack the bits we actually show on the card.
  const { main, weather, wind, name, sys, id } = weatherData;
  const currentWeather = weather[0];
  const isCityFavorite = isFavorite(id);
  const skyClass = themeFromWeather(weatherData);
  const symbol = unit === "celsius" ? "C" : "F";
  const getIcon = (code) => `https://openweathermap.org/img/wn/${code}@2x.png`;

  // Toggle favorite for this city. Keep payload small but sufficient to re-use later.
  const toggleFav = () => {
    if (isCityFavorite) removeFavorite(id);
    else
      addFavorite({ id, name, country: sys.country, coord: weatherData.coord });
  };

  // Shared text/background tokens that flip cleanly between light/dark.
  const textMain = isDark ? "text-white" : "text-slate-900";
  const textSoft = isDark ? "text-slate-100/85" : "text-slate-600";
  const textSofter = isDark ? "text-slate-100/75" : "text-slate-700";

  // Glass layer: transparent enough to let sky peek through, but readable on both modes.
  const glassPanel = isDark
    ? "bg-slate-900/35 border border-white/10"
    : "bg-white/75 border border-white/60";

  // Divider line that won’t scream in either mode.
  const divider = isDark ? "border-white/10" : "border-slate-300/60";

  // Fav button chip: matches glass style, with a subtle blur for depth.
  const favBtn = isDark
    ? "bg-slate-800/70 border-white/10"
    : "bg-white/80 border-white/60";

  return (
    <motion.div
      // Gentle rise-in so the card feels alive.
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      // Sky theme sits behind the glass content.
      className={`relative overflow-hidden rounded-2xl p-0 mb-6 sky-base ${skyClass} sky-overlay`}
    >
      {/* LIGHT MODE ONLY: a soft white wash to keep the whole card visibly brighter over the sky. */}
      {!isDark && (
        <div
          className="absolute inset-0 pointer-events-none
                     bg-gradient-to-br from-white/33 via-white/100 to-white/80
                     backdrop-saturate-100"
          aria-hidden
        />
      )}

      {/* CONTENT LAYER (glass) */}
      <div
        className={`relative glass m-[1px] rounded-2xl p-4 sm:p-6 ${glassPanel}`}
      >
        {/* Favorite toggle (top-right). The heart fills when saved. */}
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          onClick={toggleFav}
          className={`absolute top-4 right-4 p-2 rounded-full backdrop-blur-md shadow ${favBtn}`}
          aria-label={
            isCityFavorite ? t("removeFromFavorites") : t("addToFavorites")
          }
          title={
            isCityFavorite ? t("removeFromFavorites") : t("addToFavorites")
          }
        >
          <svg
            className={`w-5 h-5 ${
              isCityFavorite ? "text-red-500 fill-current" : "text-slate-500"
            }`}
            fill={isCityFavorite ? "currentColor" : "none"}
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </motion.button>

        {/* TOP ROW: left = icon + city, right = temps */}
        <div className="flex flex-col sm:flex-row justify-between items-center">
          {/* City + condition */}
          <div className="flex items-center mb-4 sm:mb-0 w-full sm:w-auto justify-center sm:justify-start">
            <img
              src={getIcon(currentWeather.icon)}
              alt={currentWeather.description}
              className="w-20 h-20 sm:w-24 sm:h-24 icon-tint"
            />
            <div className="ml-3 sm:ml-4">
              <h2 className={`text-lg sm:text-2xl font-extrabold ${textMain}`}>
                {name}, {sys.country}
              </h2>
              <p className={`capitalize text-sm sm:text-base ${textSoft}`}>
                {currentWeather.description}
              </p>
            </div>
          </div>

          {/* Temperature block */}
          <div className="text-center sm:text-right w-full sm:w-auto pr-10">
            <div
              className={`text-3xl sm:text-5xl font-black ${textMain} mb-1 sm:mb-2`}
            >
              {Math.round(main.temp)}°{symbol}
            </div>
            <p className={`text-sm sm:text-base ${textSoft}`}>
              {t("feelsLike")} {Math.round(main.feels_like)}°{symbol}
            </p>
            <div
              className={`flex justify-center sm:justify-end space-x-4 mt-1 text-xs sm:text-sm ${textSofter}`}
            >
              <span>
                {t("high")}: {Math.round(main.temp_max)}°
              </span>
              <span>
                {t("low")}: {Math.round(main.temp_min)}°
              </span>
            </div>
          </div>
        </div>

        {/* Thin divider before stats */}
        <div className={`mt-4 sm:mt-6 border-t ${divider}`} />

        {/* QUICK STATS: small, scannable, responsive grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-4">
          <Stat
            label={t("humidity")}
            value={`${main.humidity}%`}
            isDark={isDark}
          />
          <Stat label={t("wind")} value={`${wind.speed} m/s`} isDark={isDark} />
          <Stat
            label={t("pressure")}
            value={`${main.pressure} hPa`}
            isDark={isDark}
          />
          <Stat
            label={t("visibility")}
            value={`${(weatherData.visibility / 1000).toFixed(1)} km`}
            isDark={isDark}
          />
        </div>
      </div>
    </motion.div>
  );
};

/**
 * Tiny stat cell used for the 4 quick stats row.
 * Keeps type scale and colors consistent across modes.
 */
const Stat = ({ label, value, isDark }) => (
  <div className="text-center">
    <p
      className={`text-xs sm:text-sm ${
        isDark ? "text-slate-100/80" : "text-slate-600"
      }`}
    >
      {label}
    </p>
    <p
      className={`text-base sm:text-lg font-semibold ${
        isDark ? "text-white" : "text-slate-900"
      }`}
    >
      {value}
    </p>
  </div>
);

export default WeatherCard;
