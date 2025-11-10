import React from "react";
import { motion, useReducedMotion } from "framer-motion";

const LocationButton = ({ onLocationClick, loading, useGeolocation }) => {
  // Respect user's reduced-motion preference for subtle animations.
  const reduceMotion = useReducedMotion();

  // Styles split for readability.
  const baseBtn =
    "p-2 sm:p-3 rounded-lg border transition-colors duration-200 " +
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/80 " +
    "focus-visible:ring-offset-2 focus-visible:ring-offset-white " +
    "dark:focus-visible:ring-sky-300/70 dark:focus-visible:ring-offset-gray-900";

  // When geolocation is enabled (active state), make it primary/blue.
  const activeBtn = "bg-blue-500 border-blue-500 text-white hover:bg-blue-600";

  // Default (inactive) look that works in both themes.
  const idleBtn =
    "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 " +
    "dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600";

  return (
    <motion.button
      // Gentle micro-interaction on hover/tap. Reduced for users who opt out.
      whileHover={reduceMotion ? undefined : { scale: 1.05 }}
      whileTap={reduceMotion ? undefined : { scale: 0.95 }}
      onClick={onLocationClick}
      disabled={loading}
      // Merge base + conditional styles. Also dim when disabled.
      className={`${baseBtn} ${useGeolocation ? activeBtn : idleBtn} ${
        loading ? "opacity-70 cursor-not-allowed" : ""
      }`}
      // Accessible name/tooltip
      aria-label="Get current location weather"
      title="Use my current location"
      type="button"
    >
      {/* Location/target icon; inherits text color from the button */}
      <svg
        className={`w-4 h-4 sm:w-5 sm:h-5 ${
          useGeolocation ? "text-white" : "text-gray-600 dark:text-gray-300"
        }`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true" // purely decorative
      >
        {/* Outer pin/radar shape */}
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
        />
        {/* Inner dot (current point) */}
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    </motion.button>
  );
};

export default LocationButton;
