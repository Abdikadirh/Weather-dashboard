import React from "react";
import { motion } from "framer-motion";
import { useTheme } from "../state/ThemeContext";

const ThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <motion.button
      // Small, snappy micro-interactions on hover/press
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleTheme}
      // Button chrome:
      // - light: white chip with subtle border
      // - dark: slate chip so it doesn’t blend with the navbar bg
      // - unified focus ring: light blue in both modes (matches your switcher)
      className="
        p-1.5 sm:p-2 rounded-full shadow-lg
        bg-white border border-gray-300
        dark:bg-gray-700 dark:border-gray-600
        focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/80
      "
      aria-label="Toggle dark mode"
      aria-pressed={isDark} // a11y: communicate current state to AT
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? (
        // Dark mode is ON → show a sun (suggests going back to light)
        <svg
          className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400" // a bit brighter than 500 for contrast on dark bg
          fill="currentColor"
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
            clipRule="evenodd"
          />
        </svg>
      ) : (
        // Light mode is ON → show a moon (suggests going to dark)
          <svg className="w-5 h-5 text-gray-700" 
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
        </svg>
      )}
    </motion.button>
  );
};

export default ThemeToggle;
