import React from "react";
import { motion } from "framer-motion";
import SearchBar from "../components/SearchBar";
import WeatherCard from "../components/WeatherCard";
import ForecastItem from "../components/ForecastItem";
import TemperatureChart from "../components/TemperatureChart";
import Loader from "../components/Loader";
import { useWeather } from "../hooks/useWeather";
import QuickAccess from "../components/QuickAccess";
import { useLanguage } from "../state/LanguageContext";
import WeatherExtras from "../components/WeatherExtras";

const Dashboard = () => {
  // Pull all weather state + actions from the hook
  const {
    weatherData,
    forecastData,
    loading,
    error,
    fetchWeatherData,
    fetchCurrentLocationWeather,
    useGeolocation,
  } = useWeather();

  // i18n strings + direction (ltr/rtl) for minor visual nudges
  const { t, direction } = useLanguage();

  // Wire child callbacks to hook actions
  const handleSearch = (city) => fetchWeatherData(city);
  const handleLocationClick = () => fetchCurrentLocationWeather();
  const handleCitySelect = (cityName) => fetchWeatherData(cityName);

  return (
    /**
     * NOTE:
     * - You intentionally removed min-h-screen so the page height is auto.
     * - Light mode = solid white; Dark mode = full-page gradient.
     * - Padding is applied here so the content never hugs the edges.
     */
    <div className="bg-white dark:bg-gradient-to-br dark:from-gray-900 dark:via-blue-900 dark:to-purple-900 py-3 px-3 sm:py-8 sm:px-6 lg:px-8">
      {/* Soft fade-in for the whole page payload */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-6xl mx-auto"
      >
        {/* Page header / title */}
        <header className="text-center mb-6 sm:mb-12">
          <motion.h1
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            className="text-xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-4 inline-block"
            /**
             * Small RTL nudge:
             * - In RTL, the inline-block may look 6–8px off visually vs the icons on the right.
             * - This gentle translateX fixes that without changing layout flow.
             */
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

        {/* Search input + "use my location" button */}
        <SearchBar
          onSearch={handleSearch}
          onLocationClick={handleLocationClick}
          loading={loading}
          useGeolocation={useGeolocation}
        />

        {/* Chips for recent searches + favorites (if any) */}
        <QuickAccess onCitySelect={handleCitySelect} />

        {/* Error banner (only when we have an error) */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded mb-4 text-xs sm:text-sm"
            role="alert"
          >
            <strong>{t("error")}: </strong> {error}
          </motion.div>
        )}

        {/* Loading indicator (covers fetches + geolocation) */}
        {loading && <Loader />}

        {/* The main weather content */}
        {weatherData && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {/* Current city card */}
            <WeatherCard weatherData={weatherData} />

            {/* Sunrise/Sunset/UV/Precip panels (uses free-plan fallbacks) */}
            <WeatherExtras
              weatherData={weatherData}
              forecastData={forecastData}
            />

            {/* Hourly temps line chart (first 8 periods) */}
            <TemperatureChart forecastData={forecastData} />

            {/* 5-day forecast (1 item per day using 3-hour steps => pick index % 8 === 0) */}
            <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg p-3 sm:p-6 mb-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white mb-3 sm:mb-4">
                {t("fiveDayForecast")}
              </h3>

              <div className="flex flex-col space-y-2 sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 sm:gap-3 sm:space-y-0">
                {(forecastData?.list || [])
                  .filter((_, index) => index % 8 === 0)
                  .slice(0, 5)
                  .map((forecast, index) => (
                    <ForecastItem key={index} forecast={forecast} />
                  ))}
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default Dashboard;
