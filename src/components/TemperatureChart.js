import React, { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";
import { useTheme } from "../state/ThemeContext";
import { useLanguage } from "../state/LanguageContext";

const TemperatureChart = ({ forecastData }) => {
  const { unit } = useTheme();
  const { t, language } = useLanguage();

  // Decide which locale to use for tick labels.
  // Keep it super simple and stable so re-renders don’t recreate formatters unnecessarily.
  const locale = useMemo(() => {
    if (language === "ar") return "ar";
    if (language === "sv") return "sv";
    return "en";
  }, [language]);

  // Prebuild a 24h formatter so we’re not constructing Intl on every tick render.
  const hourFmt = useMemo(
    () =>
      new Intl.DateTimeFormat(locale, {
        hour: "2-digit",
        hour12: false,
      }),
    [locale]
  );

  // Prepare the data for Recharts:
  // - Only take the next 8 time slots (≈24 hours @ 3h intervals)
  // - Round temps to keep the chart clean
  const chartData = useMemo(() => {
    const list = forecastData?.list || [];
    return list.slice(0, 8).map((item) => ({
      time: hourFmt.format(new Date(item.dt * 1000)),
      temperature: Math.round(item.main.temp),
      feels_like: Math.round(item.main.feels_like),
    }));
  }, [forecastData, hourFmt]);

  // Small helper so if a translation key is missing,
  // we fall back to a readable default instead of showing the key.
  const unitSymbol = unit === "celsius" ? "C" : "F";
  const safe = (key, fallback) => {
    const v = t(key);
    return v === key ? fallback : v;
  };
  const titleLabel = safe("hourlyForecast", "24-Hour Forecast");
  const tempLabel = safe("temperature", "Temperature");
  const feelsLikeLabel = safe("feelsLike", "Feels like");

  // Render nothing if we don’t have any points (prevents an empty chart box).
  if (!chartData.length) return null;

  return (
    <motion.div
      // Gentle slide-in so the chart feels responsive but not jittery.
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 mb-6
                 border border-gray-200 dark:border-gray-700"
    >
      {/* Title includes the unit to avoid “what am I looking at?” moments */}
      <h3 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white mb-4">
        {titleLabel} (°{unitSymbol})
      </h3>

      {/* Keep the chart visually LTR even in RTL languages so axes don’t mirror.
          The surrounding UI respects RTL; this specific visualization stays consistent. */}
      <div className="h-64 no-rtl-flip">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            {/* Light gridlines for legibility without overpowering the lines */}
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />

            {/* Use tailwind text color for ticks; avoids inline color juggling */}
            <XAxis
              dataKey="time"
              className="text-sm"
              tick={{ fill: "#6B7280" }}
            />

            {/* Y-axis with a unit label inside for tight layouts */}
            <YAxis
              className="text-sm"
              tick={{ fill: "#6B7280" }}
              label={{
                value: `°${unitSymbol}`,
                angle: -90,
                position: "insideLeft",
                style: { textAnchor: "middle", fill: "#6B7280" },
              }}
            />

            {/* Tooltip: subtle glassy look; values formatted with ° + unit */}
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                border: "1px solid #E5E7EB",
                borderRadius: "8px",
              }}
              formatter={(value) => [`${value}°${unitSymbol}`]}
            />

            {/* Primary temperature line: solid blue with visible dots */}
            <Line
              type="monotone"
              dataKey="temperature"
              stroke="#3B82F6"
              strokeWidth={2}
              dot={{ fill: "#3B82F6", strokeWidth: 2, r: 4 }}
              name={`${tempLabel} (°${unitSymbol})`}
            />

            {/* Feels like: dashed green so it’s easy to differentiate at a glance */}
            <Line
              type="monotone"
              dataKey="feels_like"
              stroke="#10B981"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ fill: "#10B981", strokeWidth: 2, r: 4 }}
              name={`${feelsLikeLabel} (°${unitSymbol})`}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default TemperatureChart;
