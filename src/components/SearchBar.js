import React, { useState } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "../state/LanguageContext";

const SearchBar = ({ onSearch, onLocationClick, loading, useGeolocation }) => {
  // keep local text input lightweight and controlled
  const [query, setQuery] = useState("");
  const { t } = useLanguage();

  // don’t fire empty searches; trim to avoid accidental spaces
  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) onSearch(query.trim());
  };

  return (
    <motion.form
      // soft entrance so the header area feels alive without being jumpy
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      onSubmit={handleSubmit}
      className="mb-6 sm:mb-8"
      role="search" // a11y: hint to AT that this region is for searching
    >
      {/* stack on tiny screens; row on xs+ so the layout doesn’t cramp */}
      <div className="flex flex-col xs:flex-row gap-2 sm:gap-3">
        {/* input + location button live together to feel like one control group */}
        <div className="flex flex-1 gap-2">
          {/* text field: compact on mobile, readable on desktop */}
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("enterCityName")}
            className="flex-1 px-3 py-2 sm:px-4 sm:py-3 rounded-lg border border-gray-300 dark:border-gray-600 
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                       transition-all duration-200 text-sm sm:text-base min-w-0"
            disabled={loading}               // prevent spam while fetching
            aria-label={t("enterCityName")}  // screen-reader friendly label
            autoComplete="off"               // avoid odd browser suggestions
          />

          {/* “Use my location” — visually matches the input height */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onLocationClick}
            type="button"
            disabled={loading}
            className={`p-2 sm:p-3 rounded-lg border transition-colors duration-200
                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                        dark:focus:ring-offset-gray-800
                        ${
                          useGeolocation
                            ? "bg-blue-500 border-blue-500 text-white hover:bg-blue-600"
                            : "bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
                        }`}
            aria-label={t("useMyLocation")}
            title={t("useMyLocation")}
          >
            {/* icon only, but still accessible because the button has aria-label */}
            <svg
              className={`w-4 h-4 sm:w-5 sm:h-5 ${
                useGeolocation ? "text-white" : "text-gray-600 dark:text-gray-400"
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </motion.button>
        </div>

        {/* primary action — keep width stable to avoid layout shift on translate */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={loading}
          className="px-4 py-2 sm:px-6 sm:py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300
                     text-white rounded-lg font-semibold transition-colors duration-200
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                     dark:focus:ring-offset-gray-800 text-sm sm:text-base whitespace-nowrap
                     min-w-[80px] sm:min-w-[100px]"
          aria-label={loading ? t("searching") : t("search")}
        >
          {loading ? t("searching") : t("search")}
        </motion.button>
      </div>
    </motion.form>
  );
};

export default SearchBar;
