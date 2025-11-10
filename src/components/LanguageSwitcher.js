import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "../state/LanguageContext";

const LanguageSwitcher = () => {
  // pull current language + setter + translator from context
  const { language, changeLanguage, t } = useLanguage();

  // local open/close state for the dropdown
  const [isOpen, setIsOpen] = useState(false);

  // the options we show in the menu
  const languages = [
    { code: "en", name: "English", flag: "US" },
    { code: "sv", name: "Svenska", flag: "SE" },
    { code: "ar", name: "العربية", flag: "SA" },
  ];

  // find the current language to display on the trigger button
  const current = languages.find((l) => l.code === language);

  return (
    // wrapper keeps positioning context for the absolute dropdown
    <div className="no-rtl-flip relative">
      {/* TRIGGER BUTTON
          - Small scale animation on hover/tap (feels snappy)
          - Light mode: gray text on white; Dark mode: white text on gray
          - Consistent sky-blue focus ring in both modes
      */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label={t("changeLanguage")}
        className="
          px-2 h-9 rounded-xl shadow-md border text-xs font-semibold
          bg-white text-gray-800 border-gray-300
          hover:border-blue-400 focus:outline-none
          focus-visible:ring-2 focus-visible:ring-sky-400/80
          dark:bg-gray-700 dark:text-white dark:border-gray-600
          dark:hover:border-sky-400/70 dark:focus-visible:ring-sky-300/80
          transition-colors
        "
      >
        {current?.flag}
      </motion.button>

      {/* DROPDOWN MENU
          - Uses AnimatePresence for smooth mount/unmount
          - Slight fade/slide for a polished feel
          - Backdrop blur + rounded corners
          - `no-rtl-flip` + inline `direction:ltr` so layout stays LTR even in RTL UI
      */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            className="
              absolute right-0 mt-2 w-40 z-50 no-rtl-flip overflow-hidden
              rounded-xl shadow-xl border backdrop-blur-sm
              bg-white/95 border-gray-200
              dark:bg-gray-800/95 dark:border-gray-700
            "
            style={{ direction: "ltr" }}
            role="menu"
          >
            {languages.map((lang) => {
              const active = language === lang.code;

              return (
                // Each row is a button for keyboard accessibility
                <button
                  key={lang.code}
                  onClick={() => {
                    changeLanguage(lang.code); // update app language
                    setIsOpen(false); // close the menu
                  }}
                  role="menuitem"
                  className={`
                    w-full flex items-center gap-2 px-4 py-2.5 text-sm transition-colors
                    ${
                      active
                        ? "bg-blue-50 text-blue-700 dark:bg-blue-900/25 dark:text-blue-200"
                        : "text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-white/5"
                    }
                  `}
                  style={{ direction: "ltr" }}
                >
                  {/* tiny “chip” showing the flag/code; keeps good contrast in both themes */}
                  <span
                    className="
                      inline-flex w-7 h-7 items-center justify-center rounded-md
                      bg-gray-100 text-gray-800 border border-gray-200 text-[11px] font-bold
                      dark:bg-gray-700 dark:text-white dark:border-gray-600
                    "
                  >
                    {lang.flag}
                  </span>

                  {/* readable language name */}
                  <span>{lang.name}</span>
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LanguageSwitcher;
