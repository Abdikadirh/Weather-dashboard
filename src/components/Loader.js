import React from "react";
import { motion, useReducedMotion } from "framer-motion";

const Loader = () => {
  // If the user prefers reduced motion, keep things simple/subtle.
  const reduceMotion = useReducedMotion();

  return (
    // Wrapper: center the spinner + text. `role="status"` lets SRs know it's a live state.
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={reduceMotion ? { duration: 0.2 } : { duration: 0.35 }}
      className="flex justify-center items-center p-8"
      role="status"
      aria-live="polite"
    >
      {/* The circular spinner (styled via your global .loader class) */}
      <div
        className="loader"
        aria-hidden="true" // purely decorative for screen readers
      />

      {/* Loading message: readable in both themes */}
      <span className="ml-4 text-gray-700 dark:text-gray-200">
        Loading weather data...
      </span>
    </motion.div>
  );
};

export default Loader;
