import React, { useState, lazy, Suspense } from "react";
import { Routes, Route, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "./state/LanguageContext";
import ThemeToggle from "./components/ThemeToggle";
import LanguageSwitcher from "./components/LanguageSwitcher";
import OfflineBanner from "./components/OfflineBanner";

const Dashboard = lazy(() => import("./pages/Dashboard"));
const About = lazy(() => import("./pages/About"));
const Settings = lazy(() => import("./pages/Settings"));

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center text-white/80">
    <div className="loader" />
    <span className="ml-4">Loading...</span>
  </div>
);

const AppContent = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t, direction } = useLanguage();

  React.useEffect(() => {
    const onEsc = (e) => e.key === "Escape" && setIsMobileMenuOpen(false);
    document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, []);

  return (
    <div
      dir={direction}
      className="
        min-h-screen flex flex-col
        bg-gradient-to-br from-blue-400 via-blue-500 to-purple-600
        dark:from-gray-900 dark:via-blue-900 dark:to-purple-900
        transition-colors duration-200
      "
    >
      {/* page background */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-400 via-blue-500 to-purple-600 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900 -z-10" />

      <OfflineBanner />

      {/* ===== NAVBAR =====
         Grid with 3 columns: LEFT (burger), CENTER (title), RIGHT (links + controls).
         No absolute positioning → no vertical misalignment.
      */}
      <nav
        className="
          sticky top-0 z-40 border-b border-gray-200/70 dark:border-white/10 backdrop-blur-md
          bg-white/70
          dark:bg-slate-900/65   /* darker than page bg so it reads as a bar */
        "
      >
        {/* subtle white wash only in light mode */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-white/50 to-transparent dark:hidden" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
          {/* 3 columns; everything sits on the same baseline */}
          <div className="grid grid-cols-[auto,1fr,auto] items-center h-14 sm:h-16 gap-3">
            {/* LEFT: mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen((s) => !s)}
              className="sm:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100/80 dark:text-white/85 dark:hover:bg-white/10"
              aria-label={t("toggleMenu") || "Toggle menu"}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            {/* CENTER: brand (kept truly centered; no scale on hover to avoid “jump”) */}
            <div className="flex justify-center">
              <Link to="/" className="inline-flex">
                <span className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white hover:opacity-90">
                  {t("weatherDashboard") || "Weather Dashboard"}
                </span>
              </Link>
            </div>

            {/* RIGHT: desktop links + controls in one row, centered vertically */}
            <div className="flex items-center justify-end gap-4">
              <div className="hidden sm:flex items-center gap-4">
                <NavLink to="/" label={t("dashboard") || "Dashboard"} />
                <NavLink to="/about" label={t("about") || "About"} />
                <NavLink to="/settings" label={t("settings") || "Settings"} />
              </div>

              {/* controls (match the links baseline and stay to the far right) */}
              <div className="flex items-center gap-2">
                <LanguageSwitcher />
                <ThemeToggle />
              </div>
            </div>
          </div>

          {/* Mobile menu (slides under the bar) */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                id="mobile-menu"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="sm:hidden overflow-hidden border-t border-gray-200/70 dark:border-white/10
                           bg-white/85 dark:bg-slate-900/70 backdrop-blur-md"
              >
                <div className="py-2 space-y-1">
                  <MobileNavLink
                    to="/"
                    label={t("dashboard") || "Dashboard"}
                    onClick={() => setIsMobileMenuOpen(false)}
                  />
                  <MobileNavLink
                    to="/about"
                    label={t("about") || "About"}
                    onClick={() => setIsMobileMenuOpen(false)}
                  />
                  <MobileNavLink
                    to="/settings"
                    label={t("settings") || "Settings"}
                    onClick={() => setIsMobileMenuOpen(false)}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>

      {/* MAIN (grows and pushes footer) */}
      <main className="flex-1" aria-live="polite">
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/about" element={<About />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </Suspense>
      </main>

      {/* FOOTER (same visual language as the nav) */}
      <footer className="mt-auto border-t border-gray-200/70 dark:border-white/10 backdrop-blur-md bg-white/80 dark:bg-slate-900/65">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
          <p className="text-center text-gray-700 dark:text-white/80 text-xs sm:text-sm">
            © 2025 {t("weatherDashboard") || "Weather Dashboard"}.{" "}
            {t("allRightsReserved") || "All rights reserved."}
          </p>
        </div>
      </footer>
    </div>
  );
};

/* ---------- Links with correct colors in both modes ---------- */
const NavLink = ({ to, label }) => (
  <Link to={to}>
    <motion.span
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      className="
        font-semibold whitespace-nowrap text-sm sm:text-base transition-colors
        text-gray-700 hover:text-gray-900
        dark:text-white/80 dark:hover:text-white
      "
    >
      {label}
    </motion.span>
  </Link>
);

const MobileNavLink = ({ to, label, onClick }) => (
  <Link to={to} onClick={onClick}>
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="block px-3 py-2 rounded-lg font-semibold text-base
                 text-gray-800 hover:bg-gray-100
                 dark:text-white/90 dark:hover:bg-white/10"
    >
      {label}
    </motion.div>
  </Link>
);

export default AppContent;
