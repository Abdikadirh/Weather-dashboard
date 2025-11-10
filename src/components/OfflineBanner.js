import React from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useLanguage } from "../state/LanguageContext";

const OfflineBanner = () => {
  // start with the browser's current connectivity state
  const [isOnline, setIsOnline] = React.useState(navigator.onLine);
  const { t } = useLanguage();

  // if the user prefers reduced motion, we'll disable slide animations
  const reduceMotion = useReducedMotion();

  // subscribe to online/offline events on mount; clean up on unmount
  React.useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <AnimatePresence>
      {/* show the banner only when offline */}
      {!isOnline && (
        <motion.div
          // fade/slide in; respect reduced-motion setting
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -50 }}
          animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -50 }}
          // keep your existing styling hook; you can style `.offline-banner` in CSS/Tailwind
          className="offline-banner"
          // accessibility: this is an important status message
          role="alert"
          aria-live="polite"
        >
          <div className="container mx-auto px-4 flex items-center justify-center space-x-2">
            {/* simple info icon (decorative) */}
            <svg
              className="w-4 h-4"
              fill="currentColor"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>

            {/* fallback English text if no translation key is present */}
            <span className="text-sm font-medium">
              {t("offlineMessage") ||
                "You are currently offline. Some features may be limited."}
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default OfflineBanner;
