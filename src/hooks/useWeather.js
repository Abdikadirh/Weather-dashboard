// src/hooks/useWeather.js
import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useTheme } from "../state/ThemeContext";
import { useFavorites } from "../state/FavoritesContext";

const API_KEY = process.env.REACT_APP_OPENWEATHER_API_KEY;
const BASE_URL = "https://api.openweathermap.org/data/2.5";

const getCurrentLocation = () =>
  new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported"));
      return;
    }
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });

export const useWeather = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [city, setCity] = useState(
    () => localStorage.getItem("lastCity") || "London"
  );
  const [useGeolocation, setUseGeolocation] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  const { unit } = useTheme();
  const { addRecentSearch } = useFavorites();
  const initialLoadRef = useRef(true);

  // Online/Offline detection
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const toFahrenheit = useCallback((c) => (c * 9) / 5 + 32, []);
  const convertTemp = useCallback(
    (t) => (unit === "fahrenheit" ? toFahrenheit(t) : t),
    [unit, toFahrenheit]
  );

  // FREE-ONLY "extras" (no One Call):
  // - UV => null (not available for free)
  // - alerts => [] (not available for free)
  // - precipitation: prefer current rain['1h'], fallback to first forecast's rain['3h']
  const buildFreeExtras = useCallback((weather, forecast) => {
    const currentRain1h = weather?.rain?.["1h"] ?? null;
    const forecastRain3h =
      forecast?.list?.[0]?.rain?.["3h"] != null
        ? forecast.list[0].rain["3h"]
        : null;

    return {
      alerts: [],
      uvi: null,
      rain1h: currentRain1h,
      rain3h: forecastRain3h,
      // Keep a single "precipitation" number for your UI:
      precipitation: currentRain1h ?? forecastRain3h ?? 0,
    };
  }, []);

  const fetchWeatherData = useCallback(
    async (cityName) => {
      if (!cityName || !API_KEY) return;

      setLoading(true);
      setError(null);
      setUseGeolocation(false);

      try {
        const [weatherRes, forecastRes] = await Promise.all([
          fetch(
            `${BASE_URL}/weather?q=${encodeURIComponent(
              cityName
            )}&appid=${API_KEY}&units=metric`
          ),
          fetch(
            `${BASE_URL}/forecast?q=${encodeURIComponent(
              cityName
            )}&appid=${API_KEY}&units=metric`
          ),
        ]);

        if (!weatherRes.ok || !forecastRes.ok) {
          throw new Error("City not found");
        }

        const [weather, forecast] = await Promise.all([
          weatherRes.json(),
          forecastRes.json(),
        ]);

        const extras = buildFreeExtras(weather, forecast);

        setWeatherData({ ...weather, ...extras });
        setForecastData(forecast);
        setCity(cityName);
        setLastUpdated(new Date());
        localStorage.setItem("lastCity", cityName);

        addRecentSearch({
          id: weather.id,
          name: weather.name,
          country: weather.sys.country,
          coord: weather.coord,
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    [addRecentSearch, buildFreeExtras]
  );

  const fetchWeatherByCoords = useCallback(
    async (lat, lon) => {
      if (!lat || !lon || !API_KEY) return;

      setLoading(true);
      setError(null);

      try {
        const [weatherRes, forecastRes] = await Promise.all([
          fetch(
            `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
          ),
          fetch(
            `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
          ),
        ]);

        if (!weatherRes.ok || !forecastRes.ok) {
          throw new Error("Weather data not available");
        }

        const [weather, forecast] = await Promise.all([
          weatherRes.json(),
          forecastRes.json(),
        ]);

        const extras = buildFreeExtras(weather, forecast);

        setWeatherData({ ...weather, ...extras });
        setForecastData(forecast);
        setCity(weather.name);
        setLastUpdated(new Date());
        localStorage.setItem("lastCity", weather.name);
        setUseGeolocation(true);

        addRecentSearch({
          id: weather.id,
          name: weather.name,
          country: weather.sys.country,
          coord: weather.coord,
        });
      } catch (err) {
        setError(err.message);
        if (initialLoadRef.current) {
          fetchWeatherData("London");
        }
      } finally {
        setLoading(false);
      }
    },
    [addRecentSearch, buildFreeExtras, fetchWeatherData]
  );

  const fetchCurrentLocationWeather = useCallback(async () => {
    try {
      const pos = await getCurrentLocation();
      const { latitude, longitude } = pos.coords;
      await fetchWeatherByCoords(latitude, longitude);
    } catch (err) {
      setError(`Location access denied: ${err.message}`);
      if (initialLoadRef.current) {
        fetchWeatherData("London");
      }
    }
  }, [fetchWeatherByCoords, fetchWeatherData]);

  // Auto-refresh every 10 minutes
  useEffect(() => {
    if (!weatherData) return;
    const interval = setInterval(() => {
      if (useGeolocation) fetchCurrentLocationWeather();
      else fetchWeatherData(city);
    }, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, [
    weatherData,
    city,
    useGeolocation,
    fetchWeatherData,
    fetchCurrentLocationWeather,
  ]);

  // Initial load
  useEffect(() => {
    if (!initialLoadRef.current) return;

    const savedUseLocation = localStorage.getItem("useGeolocation");
    if (savedUseLocation === "true") {
      fetchCurrentLocationWeather();
    } else {
      fetchWeatherData(city);
    }

    initialLoadRef.current = false;
  }, [city, fetchCurrentLocationWeather, fetchWeatherData]);

  // Convert temps to unit
  const convertedWeatherData = useMemo(() => {
    if (!weatherData) return null;
    return {
      ...weatherData,
      main: {
        ...weatherData.main,
        temp: convertTemp(weatherData.main.temp),
        feels_like: convertTemp(weatherData.main.feels_like),
        temp_min: convertTemp(weatherData.main.temp_min),
        temp_max: convertTemp(weatherData.main.temp_max),
      },
    };
    // extras are not temps; no conversion needed
  }, [weatherData, convertTemp]);

  const convertedForecastData = useMemo(() => {
    if (!forecastData) return null;
    return {
      ...forecastData,
      list: forecastData.list.map((item) => ({
        ...item,
        main: {
          ...item.main,
          temp: convertTemp(item.main.temp),
          feels_like: convertTemp(item.main.feels_like),
          temp_min: convertTemp(item.main.temp_min),
          temp_max: convertTemp(item.main.temp_max),
        },
      })),
    };
  }, [forecastData, convertTemp]);

  const formattedLastUpdated = useMemo(() => {
    if (!lastUpdated) return null;
    return lastUpdated.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  }, [lastUpdated]);

  return {
    weatherData: convertedWeatherData,
    forecastData: convertedForecastData,
    loading,
    error,
    city,
    lastUpdated: formattedLastUpdated,
    isOffline,
    fetchWeatherData,
    fetchCurrentLocationWeather,
    useGeolocation,
    unit,
  };
};
