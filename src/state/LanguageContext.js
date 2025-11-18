import React, { createContext, useContext, useState, useEffect } from "react";

const LanguageContext = createContext();

/**
 * Tiny helper hook so consumers get a friendly error
 * if they forgot to wrap the app with <LanguageProvider>.
 */
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

// -----------------------------------------------------------------------------
// All app copy lives here. Keep keys consistent across languages.
// TIP: If a key is missing in the current language, `t()` falls back to English.
// -----------------------------------------------------------------------------
const translations = {
  en: {
    // Navigation
    dashboard: "Dashboard",
    about: "About",
    settings: "Settings",
    toggleMenu: "Toggle menu",
    changeLanguage: "Change language",

    // Weather Dashboard
    weatherDashboard: "Weather Dashboard",
    getRealTimeWeather: "Get real-time weather information and forecasts",
    enterCityName: "Enter city name...",
    search: "Search",
    searching: "Searching...",

    // Weather Data
    feelsLike: "Feels like",
    humidity: "Humidity",
    pressure: "Pressure",
    wind: "Wind",
    visibility: "Visibility",
    forecast: "Forecast",
    hourlyForecast: "24-Hour Forecast",
    fiveDayForecast: "5-Day Forecast",
    high: "H",
    low: "L",
    sunrise: "Sunrise",
    sunset: "Sunset",
    uvIndex: "UV Index",
    precipitation: "Precipitation",

    // Day Labels
    yesterday: "Yesterday",
    today: "Today",

    // Settings
    darkMode: "Dark Mode",
    toggleThemes: "Toggle between light and dark themes",
    temperatureUnit: "Temperature Unit",
    switchUnits: "Switch between Celsius and Fahrenheit",
    useMyLocation: "Use My Location",
    autoLocation: "Automatically show weather for your current location",
    dataSource: "Data Source",
    weatherDataProvided: "Weather data provided by OpenWeatherMap API",

    // About Page
    aboutTitle: "About Weather Dashboard",
    aboutDescription:
      "This Weather Dashboard is a React application built with modern web technologies to provide real-time weather information and forecasts.",
    features: "Features",
    technologies: "Technologies Used",
    accessibility: "Accessibility",

    // Features List
    feature1: "Real-time weather data for any city worldwide",
    feature2: "5-day weather forecast with interactive charts",
    feature3: "Dark/Light mode toggle",
    feature4: "Fully responsive design",
    feature5: "Accessibility features",
    feature6: "Favorite cities and recent searches",
    feature7: "Hourly forecast for each day",

    // Errors
    cityNotFound: "City not found",
    locationDenied: "Location access denied",
    tryAgain: "Try Again",
    useLondon: "Use London",
    error: "Error",

    // Offline
    offlineMessage: "You are currently offline. Some features may be limited.",

    // Footer
    allRightsReserved: "All rights reserved.",

    // Favorites
    recentSearches: "Recent Searches",
    favoriteCities: "Favorite Cities",
    clearAll: "Clear all",
    noRecentSearches: "No recent searches",
    noFavoriteCities: "No favorite cities yet",
    removeFromFavorites: "Remove from favorites",
    addToFavorites: "Add to favorites",

    // Last Updated
    lastUpdated: "Last updated",

    // Additional Info
    additionalInfo: "Additional Information",

    // Hourly Forecast
    hourlyForecastTitle: "Hourly Forecast",

    // Hourly Forecast not available for past days message
    noHourlyForPast: "Hourly details aren’t available for past days.",
  },
  sv: {
    // Navigation
    dashboard: "Instrumentpanel",
    about: "Om",
    settings: "Inställningar",
    toggleMenu: "Växla meny",
    changeLanguage: "Ändra språk",

    // Weather Dashboard
    weatherDashboard: "Väder Instrumentpanel",
    getRealTimeWeather: "Få realtidsväderinformation och prognoser",
    enterCityName: "Ange stadens namn...",
    search: "Sök",
    searching: "Söker...",

    // Weather Data
    feelsLike: "Känns som",
    humidity: "Fuktighet",
    pressure: "Tryck",
    wind: "Vind",
    visibility: "Sikt",
    forecast: "Prognos",
    hourlyForecast: "24-Timmars Prognos",
    fiveDayForecast: "5-Dagars Prognos",
    high: "H",
    low: "L",
    sunrise: "Soluppgång",
    sunset: "Solnedgång",
    uvIndex: "UV-index",
    precipitation: "Nederbörd",

    // Day Labels
    yesterday: "Igår",
    today: "Idag",

    // Settings
    darkMode: "Mörkt Läge",
    toggleThemes: "Växla mellan ljust och mörkt tema",
    temperatureUnit: "Temperatur Enhet",
    switchUnits: "Växla mellan Celsius och Fahrenheit",
    useMyLocation: "Använd Min Plats",
    autoLocation: "Visa automatiskt väder för din nuvarande plats",
    dataSource: "Datakälla",
    weatherDataProvided: "Väderdata tillhandahålls av OpenWeatherMap API",

    // About Page
    aboutTitle: "Om Väder Instrumentpanel",
    aboutDescription:
      "Denna Väder Instrumentpanel är en React-applikation byggd med moderna webbteknologier för att tillhandahålla realtidsväderinformation och prognoser.",
    features: "Funktioner",
    technologies: "Använda Teknologier",
    accessibility: "Tillgänglighet",

    // Features List
    feature1: "Realtidsväderdata för alla städer världen över",
    feature2: "5-dagars väderprognos med interaktiva diagram",
    feature3: "Mörkt/Ljust läge",
    feature4: "Fullt responsiv design",
    feature5: "Tillgänglighetsfunktioner",
    feature6: "Favoritstäder och senaste sökningar",
    feature7: "Timprognos för varje dag",

    // Errors
    cityNotFound: "Staden hittades inte",
    locationDenied: "Åtkomst till plats nekad",
    tryAgain: "Försök Igen",
    useLondon: "Använd London",
    error: "Fel",

    // Offline
    offlineMessage:
      "Du är för närvarande offline. Vissa funktioner kan vara begränsade.",

    // Footer
    allRightsReserved: "Alla rättigheter förbehållna.",

    // Favorites
    recentSearches: "Senaste Sökningar",
    favoriteCities: "Favoritstäder",
    clearAll: "Rensa alla",
    noRecentSearches: "Inga senaste sökningar",
    noFavoriteCities: "Inga favoritstäder än",
    removeFromFavorites: "Ta bort från favoriter",
    addToFavorites: "Lägg till favoriter",

    // Last Updated
    lastUpdated: "Senast uppdaterad",

    // Additional Info
    additionalInfo: "Ytterligare Information",

    // Hourly Forecast
    hourlyForecastTitle: "Timprognos",

    // Hourly Forecast not available for past days message
    noHourlyForPast:
      "Timvisa detaljer är inte tillgängliga för tidigare dagar.",
  },
  ar: {
    // Navigation
    dashboard: "لوحة التحكم",
    about: "حول",
    settings: "الإعدادات",
    toggleMenu: "تبديل القائمة",
    changeLanguage: "تغيير اللغة",

    // Weather Dashboard
    weatherDashboard: "لوحة تحكم الطقس",
    getRealTimeWeather: "احصل على معلومات الطقس والتوقعات في الوقت الفعلي",
    enterCityName: "أدخل اسم المدينة...",
    search: "بحث",
    searching: "جاري البحث...",

    // Weather Data
    feelsLike: "يشعر مثل",
    humidity: "الرطوبة",
    pressure: "الضغط",
    wind: "الرياح",
    visibility: "الرؤية",
    forecast: "التوقعات",
    hourlyForecast: "توقعات 24 ساعة",
    fiveDayForecast: "توقعات 5 أيام",
    high: "ع",
    low: "من",
    sunrise: "شروق الشمس",
    sunset: "غروب الشمس",
    uvIndex: "مؤشر الأشعة",
    precipitation: "هطول الأمطار",

    // Day Labels
    yesterday: "أمس",
    today: "اليوم",

    // Settings
    darkMode: "الوضع الليلي",
    toggleThemes: "تبديل بين الوضع النهاري والليلي",
    temperatureUnit: "وحدة الحرارة",
    switchUnits: "التبديل بين Celsius و Fahrenheit",
    useMyLocation: "استخدم موقعي",
    autoLocation: "عرض الطقس تلقائياً لموقعك الحالي",
    dataSource: "مصدر البيانات",
    weatherDataProvided: "بيانات الطقس مقدمة من OpenWeatherMap API",

    // About Page
    aboutTitle: "حول لوحة تحكم الطقس",
    aboutDescription:
      "لوحة تحكم الطقس هذه هي تطبيق React مبني بتقنيات ويب حديثة لتوفير معلومات الطقس والتوقعات في الوقت الفعلي.",
    features: "المميزات",
    technologies: "التقنيات المستخدمة",
    accessibility: "إمكانية الوصول",

    // Features List
    feature1: "بيانات الطقس في الوقت الفعلي لأي مدينة حول العالم",
    feature2: "توقعات الطقس لـ 5 أيام مع مخططات تفاعلية",
    feature3: "تبديل الوضع الليلي/النهاري",
    feature4: "تصميم متجاوب بالكامل",
    feature5: "ميزات إمكانية الوصول",
    feature6: "المدن المفضلة والبحث الحديث",
    feature7: "توقعات كل ساعة لكل يوم",

    // Errors
    cityNotFound: "المدينة غير موجودة",
    locationDenied: "تم رفض الوصول إلى الموقع",
    tryAgain: "حاول مرة أخرى",
    useLondon: "استخدم لندن",
    error: "خطأ",

    // Offline
    offlineMessage:
      "أنت غير متصل بالإنترنت حالياً. قد تكون بعض الميزات محدودة.",

    // Footer
    allRightsReserved: "جميع الحقوق محفوظة.",

    // Favorites
    recentSearches: "عمليات البحث الحديثة",
    favoriteCities: "المدن المفضلة",
    clearAll: "مسح الكل",
    noRecentSearches: "لا توجد عمليات بحث حديثة",
    noFavoriteCities: "لا توجد مدن مفضلة بعد",
    removeFromFavorites: "إزالة من المفضلة",
    addToFavorites: "إضافة إلى المفضلة",

    // Last Updated
    lastUpdated: "آخر تحديث",

    // Additional Info
    additionalInfo: "معلومات إضافية",

    // Hourly Forecast
    hourlyForecastTitle: "التوقعات كل ساعة",

    // Hourly Forecast not available for past days message
    noHourlyForPast: "لا تتوفر تفاصيل الساعة للأيام الماضية.",
  },
};

export const LanguageProvider = ({ children }) => {
  // current language code: 'en' | 'sv' | 'ar'
  const [language, setLanguage] = useState("en");
  // text direction for layout mirroring (RTL for Arabic)
  const [direction, setDirection] = useState("ltr");

  /**
   * On first mount, hydrate language from localStorage (if any).
   * Also set direction accordingly so the UI mirrors for Arabic.
   */
  useEffect(() => {
    const savedLanguage = localStorage.getItem("language");
    if (savedLanguage) {
      setLanguage(savedLanguage);
      setDirection(savedLanguage === "ar" ? "rtl" : "ltr");
    }
  }, []);

  /**
   * Change active language.
   * - Updates state
   * - Switches direction (RTL for 'ar')
   * - Persists to localStorage for next visit
   */
  const changeLanguage = (lang) => {
    setLanguage(lang);
    setDirection(lang === "ar" ? "rtl" : "ltr");
    localStorage.setItem("language", lang);
  };

  /**
   * Simple translation function:
   * 1) Try current language
   * 2) Fall back to English
   * 3) Finally fall back to the key itself (so missing keys are obvious)
   */
  const t = (key) => {
    return translations[language]?.[key] || translations["en"][key] || key;
  };

  // Value exposed through context.
  const value = {
    language,
    changeLanguage,
    t,
    direction,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
