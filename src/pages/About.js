import React from "react";
import { motion } from "framer-motion";
import { useLanguage } from "../state/LanguageContext";

const About = () => {
  // i18n hook gives us translated strings based on current language
  const { t } = useLanguage();

  return (
    /**
     * Page wrapper:
     * - Own neutral background so content feels separate from the app shell
     * - Padding scales by breakpoint for comfy reading on all screens
     */
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      {/*
        Card container:
        - Subtle slide+fade on mount (feels responsive without being distracting)
        - Rounded + shadow to read like a “sheet of paper”
      */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 sm:p-8"
      >
        {/* Page title: translated, high contrast in both themes */}
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4">
          {t("aboutTitle")}
        </h1>

        {/* Intro paragraph: one clear paragraph before details */}
        <p className="text-gray-700 dark:text-gray-300 mb-6">
          {t("aboutDescription")}
        </p>

        {/* ==== Features section ==== */}
        <section className="mb-6">
          {/* Section heading: semantic <h2> improves screen reader nav */}
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {t("features")}
          </h2>

          {/*
            Bulleted list:
            - 'ms-6' for logical start margin (works with RTL)
            - Keep line-height airy with space-y-1 for scannability
          */}
          <ul className="list-disc ms-6 text-gray-700 dark:text-gray-300 space-y-1">
            <li>{t("feature1")}</li>
            <li>{t("feature2")}</li>
            <li>{t("feature3")}</li>
            <li>{t("feature4")}</li>
            <li>{t("feature5")}</li>
            <li>{t("feature6")}</li>
          </ul>
        </section>

        {/* ==== Technologies section ==== */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {t("technologies")}
          </h2>

          {/* Keep tech stack as plain text for now; can turn into chips later */}
          <p className="text-gray-700 dark:text-gray-300">
            React, React Router, Tailwind CSS, Recharts, Framer Motion, Context
            API.
          </p>
        </section>

        {/* ==== Accessibility section ==== */}
        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {t("accessibility")}
          </h2>

          {/*
            Short, concrete list of a11y affordances we actually implement:
            - ARIA labels
            - Keyboard focus rings
            - RTL support for Arabic users
          */}
          <p className="text-gray-700 dark:text-gray-300">
            ARIA labels, keyboard navigation, focus styles, and RTL support for
            Arabic.
          </p>
        </section>
      </motion.div>
    </div>
  );
};

export default About;
