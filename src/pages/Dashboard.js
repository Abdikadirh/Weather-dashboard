import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

import SearchBar from "../components/SearchBar";
import WeatherCard from "../components/WeatherCard";
import ForecastItem from "../components/ForecastItem";
import TemperatureChart from "../components/TemperatureChart";
import Loader from "../components/Loader";
import QuickAccess from "../components/QuickAccess";
import WeatherExtras from "../components/WeatherExtras";
import HourlyForecast from "../components/HourlyForecast";

import { useWeather } from "../hooks/useWeather";
import { useLanguage } from "../state/LanguageContext";

const Dashboard = () => {
  const {
    weatherData,
    forecastData,
    loading,
    error,
    fetchWeatherData,
    fetchCurrentLocationWeather,
    useGeolocation,
  } = useWeather();

  const { t, direction } = useLanguage();
  const [selectedDay, setSelectedDay] = useState(null);

  useEffect(() => {
    // only run on first load when there is no data yet
    if (!weatherData && !loading && !error) {
      const stored = localStorage.getItem("weather:lastCity");
      const initialCity = stored || "London"; // your default city

      fetchWeatherData(initialCity);
    }
  }, [weatherData, loading, error, fetchWeatherData]);
  const handleSearch = (city) => fetchWeatherData(city);
  const handleLocationClick = () => fetchCurrentLocationWeather();
  const handleCitySelect = (cityName) => fetchWeatherData(cityName);

  // ---------- EXACTLY 5 DAYS, starting with TODAY ----------
  const getFiveDayForecast = () => {
    if (!weatherData || !forecastData?.list?.length) return [];
    const tz = forecastData?.city?.timezone ?? 0; // seconds
    const keyOf = (unix) =>
      new Date((unix + tz) * 1000).toISOString().slice(0, 10);

    const out = [];
    const seen = new Set();

    const todayUnix = weatherData.dt ?? Math.floor(Date.now() / 1000);
    const todayKey = keyOf(todayUnix);

    // 1) today
    out.push({ ...weatherData, dt: todayUnix, isToday: true });
    seen.add(todayKey);

    // 2) next 4 unique days from forecast
    for (const f of forecastData.list) {
      const k = keyOf(f.dt);
      if (k !== todayKey && !seen.has(k)) {
        out.push(f);
        seen.add(k);
      }
      if (out.length === 5) break;
    }
    return out;
  };

  const fiveDayForecasts = getFiveDayForecast();

  // Helper: does this date have hourly data in forecast list?
  const hasHourlyFor = (unix) => {
    if (!forecastData?.list?.length) return false;
    const tz = forecastData?.city?.timezone ?? 0;
    const keyOf = (u) => new Date((u + tz) * 1000).toISOString().slice(0, 10);
    const target = keyOf(unix);
    return forecastData.list.some((i) => keyOf(i.dt) === target);
  };

  // ---------- horizontal scroller + conditional arrows ----------
  const scrollerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollButtons = () => {
    const el = scrollerRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  };

  useEffect(() => {
    updateScrollButtons();
    const el = scrollerRef.current;
    if (!el) return;
    const onResize = () => updateScrollButtons();
    el.addEventListener("scroll", updateScrollButtons, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      el.removeEventListener("scroll", updateScrollButtons);
      window.removeEventListener("resize", onResize);
    };
  }, [fiveDayForecasts.length]);

  const scrollByAmount = (dir) => {
    const el = scrollerRef.current;
    if (!el) return;
    const step = el.clientWidth * 0.8;
    el.scrollBy({ left: dir === "left" ? -step : step, behavior: "smooth" });
  };

  return (
    <div className="sky-base min-h-screen relative">
      <div className="py-3 px-3 sm:py-8 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-7xl mx-auto"
        >
          {/* Header */}
          <header className="text-center mb-6 sm:mb-12">
            <motion.h1
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              className="text-xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-4 inline-block"
              style={
                direction === "rtl"
                  ? { transform: "translateX(-8px)" }
                  : undefined
              }
              aria-label={t("weatherDashboard")}
            >
              {t("weatherDashboard")}
            </motion.h1>

            <motion.p
              initial={{ y: -10 }}
              animate={{ y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xs sm:text-lg text-gray-600 dark:text-blue-200 px-2"
            >
              {t("getRealTimeWeather")}
            </motion.p>
          </header>

          {/* Search */}
          <SearchBar
            onSearch={handleSearch}
            onLocationClick={handleLocationClick}
            loading={loading}
            useGeolocation={useGeolocation}
          />

          {/* Quick access */}
          <QuickAccess onCitySelect={handleCitySelect} />

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded mb-4 text-xs sm:text-sm"
              role="alert"
            >
              <strong>{t("error")}:</strong> {error}
            </motion.div>
          )}

          {/* Loader */}
          {loading && <Loader />}

          {/* Weather */}
          {weatherData && !loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <WeatherCard weatherData={weatherData} />
              <WeatherExtras
                weatherData={weatherData}
                forecastData={forecastData}
              />
              <TemperatureChart forecastData={forecastData} />

              {/* Forecast section */}
              <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg p-3 sm:p-6 mb-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white mb-3 sm:mb-4">
                  {t("fiveDayForecast") || "5-Day Forecast"}
                </h3>

                <div className="relative overflow-hidden">
                  {/* LEFT ARROW */}
                  {canScrollLeft && (
                    <button
                      type="button"
                      onClick={() => scrollByAmount("left")}
                      className="absolute left-1 top-1/2 -translate-y-1/2 z-20 h-7 w-7 rounded-full grid place-items-center border border-gray-300/70 dark:border-white/20 bg-white/85 dark:bg-white/10 backdrop-blur-sm shadow-sm text-gray-700 dark:text-white/85 hover:bg-white dark:hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-sky-400/60 [line-height:0]"
                      aria-label="Scroll left"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        className="h-3 w-3"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                  )}

                  {/* SCROLLER: days list */}
                  <div
                    ref={scrollerRef}
                    className="relative flex gap-3 overflow-x-auto pb-2 mb-1 forecast-scroll"
                  >
                    {fiveDayForecasts.map((day, idx) => (
                      <ForecastItem
                        key={day.dt || idx}
                        forecast={day}
                        isSelected={selectedDay && selectedDay.dt === day.dt}
                        onClick={setSelectedDay}
                        position={idx}
                        hasHourlyData={
                          !!forecastData && hasHourlyFor(day.dt ?? 0)
                        }
                      />
                    ))}
                  </div>

                  {/* RIGHT ARROW */}
                  {canScrollRight && (
                    <button
                      type="button"
                      onClick={() => scrollByAmount("right")}
                      className="absolute right-1 top-1/2 -translate-y-1/2 z-20 h-7 w-7 rounded-full grid place-items-center border border-gray-300/70 dark:border-white/20 bg-white/85 dark:bg-white/10 backdrop-blur-sm shadow-sm text-gray-700 dark:text-white/85 hover:bg-white dark:hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-sky-400/60 [line-height:0]"
                      aria-label="Scroll right"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        className="h-3 w-3"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  )}
                </div>

                {/* Hourly panel */}
                <AnimatePresence>
                  {selectedDay && (
                    <div className="mt-3">
                      <HourlyForecast
                        forecastData={forecastData}
                        selectedDay={selectedDay}
                      />
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
