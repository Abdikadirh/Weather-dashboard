# 🌦️ Weather Dashboard

A modern, responsive React app that shows real-time weather and forecasts — with dark mode, multi-language UI (EN/SV/AR + RTL), favorites, recent searches, keyboard shortcuts, and polished animations.

## ✨ Features

- 🌍 **Real-time weather** for any city (OpenWeatherMap)
- 📅 **5-Day forecast** + **Hourly temperature** chart (Recharts)
- 🌓 **Theme toggle** (light/dark) with localStorage persistence
- 🌐 **Language switcher** (English, Svenska, العربية) + RTL support
- ⭐ **Favorites** & 🕑 **Recent searches** (localStorage)
- 📍 **Use my location** (Geolocation) + optional auto-refresh
- ⚡ **Fast UI** with Framer Motion animations & glassy surfaces
- ♿ **Accessibility**: ARIA labels, focus rings, keyboard nav
- 🚫 **Offline banner** with graceful fallbacks
- ⌨️ **Shortcuts**: `/` focus search, `Esc` clear, `Enter` search

## Technologies Used

- React 18 , React Router
- Context API (Theme, Language, Favorites)
- Tailwind CSS
- React Router DOM
- Recharts (for data visualization)
- Framer Motion (for animations)
- OpenWeatherMap API

## Getting Started

- install react 18 , npm , tailwindcss , framer motion ,
  recharts
- Node.js (version 14 or higher)
- npm
- OpenWeatherMap API key

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd weather-dashboard
```

Environment

Create a .env file in the project root:
REACT_APP_OPENWEATHER_API_KEY=my_openweather_api_key

```
Run Dev Server:
npm start
```

Build
npm run build

### ⚙️ Configuration & Behavior

### Theme (light/dark)

Stored in localStorage → key: theme = 'light' | 'dark'

ThemeProvider:

isDark, toggleTheme()

unit ('celsius' | 'fahrenheit'), toggleUnit()

### Language / i18n + RTL

Languages: en, sv, ar (RTL)

Stored in localStorage → key: language

LanguageProvider:

language, changeLanguage(lang)

direction ('ltr' | 'rtl')

t(key) — safe fallback to English when missing

### Favorites / Recent

Stored in localStorage:

weatherFavorites — array of city objects { id, name, country, coord }

weatherRecentSearches — latest 5 unique searches

API: addFavorite, removeFavorite, isFavorite, addRecentSearch, clearRecentSearches

### Weather Data (OpenWeatherMap)

Endpoints: GET /weather (current), GET /forecast (3-hour steps)

Free-tier “extras” synthesized in useWeather:

uvi = null, alerts = []

precipitation prefers rain['1h'], else first forecast rain['3h'], else 0

Auto-refresh every 10 minutes

Unit toggle °C/°F transforms temps client-side

Last city stored as lastCity

### Geolocation

“Use my location” fetches by coordinates

Optional persistence in Settings:

useGeolocation = 'true' | 'false' → auto-load current location at startup

###Keyboard Shortcuts

/ → focus search

Esc → clear & blur search

Enter (while focused) → submit search

### Offline Handling

OfflineBanner shows when navigator.onLine === false

Graceful errors; UI remains usable with cached state

### Troubleshooting

No data / API error
Check your REACT_APP_OPENWEATHER_API_KEY and API rate limits.

Geolocation denied
Allow location in the browser — or turn off “Use my location” from Settings.

RTL quirks
Keep charts wrapped in .no-rtl-flip.

### 🔒 Privacy

100% client-side — no backend.

Favorites, recent searches, theme, language, and units live in localStorage.


