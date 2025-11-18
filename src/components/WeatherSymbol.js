import React from "react";
import { useTheme } from "../state/ThemeContext";

// Weather Icons (Wi)
import {
  WiSnow,
  WiFog,
} from "react-icons/wi";

// Typicons (Ti) — shapes like your screenshot
import {
  TiWeatherSunny,
  TiWeatherNight,
  TiWeatherPartlySunny,
  TiWeatherCloudy,
  TiWeatherShower,
  TiWeatherDownpour,
  TiWeatherStormy,
} from "react-icons/ti";

// Map OpenWeather icon codes to the closest shapes
const iconMap = {
  // clear
  "01d": TiWeatherSunny,
  "01n": TiWeatherNight,

  // few clouds (sun/moon + cloud)
  "02d": TiWeatherPartlySunny,
  // Typicons has no explicit “partly night”, so fall back to same shape
  // which still reads correctly in UI
  "02n": TiWeatherPartlySunny,

  // scattered / broken / overcast -> cloudy
  "03d": TiWeatherCloudy,
  "03n": TiWeatherCloudy,
  "04d": TiWeatherCloudy,
  "04n": TiWeatherCloudy,

  // rain: light showers vs downpour
  "09d": TiWeatherShower,
  "09n": TiWeatherShower,
  "10d": TiWeatherDownpour,
  "10n": TiWeatherDownpour,

  // thunder
  "11d": TiWeatherStormy,   // nicer glyph than Wi
  "11n": TiWeatherStormy,

  // snow & fog (stay with Wi — Typicons lacks good matches)
  "13d": WiSnow,
  "13n": WiSnow,
  "50d": WiFog,
  "50n": WiFog,
};

export default function WeatherSymbol({ code, size = 56, className = "" }) {
  const { isDark } = useTheme();
  const Icon = iconMap[code] || TiWeatherCloudy;

  // glow only for clear disks
  const glow =
    code === "01d"
      ? "drop-shadow(0 0 14px rgba(253,184,19,.55))"
      : code === "01n"
      ? "drop-shadow(0 0 14px rgba(245,231,161,.45))"
      : "none";

  // Colors:
  // - keep your warm sun / moon
  // - all other glyphs follow theme gray so they look like the screenshot
  const color =
    code === "01d"
      ? "#FDB813"        // sun
      : code === "01n"
      ? "#FCCC1A"        // moon
      : isDark
      ? "#D2D8DF"        // icons in dark
      : "#5F6C7B";       // icons in light

  return (
    <Icon
      size={size}
      color={color}
      className={className}
      style={{ filter: glow }}
      aria-hidden
      focusable="false"
    />
  );
}
