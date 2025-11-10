import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useFavorites } from "../state/FavoritesContext";
import { useLanguage } from "../state/LanguageContext";

const QuickAccess = ({ onCitySelect }) => {
  // Pull quick-access data from context.
  // If a value isn't present, default to an empty array so the UI doesn't crash.
  const {
    favorites = [],
    recentSearches = [],
    clearRecentSearches,
    clearFavorites, // if your context doesn’t expose this, the button simply won’t render
  } = useFavorites();

  const { t } = useLanguage();

  // Simple 2-tab UI: "recent" | "favorites"
  const [activeTab, setActiveTab] = useState("recent");

  // Hide the whole block if there’s nothing useful to show.
  if (favorites.length === 0 && recentSearches.length === 0) return null;

  return (
    <motion.div
      // subtle entrance so the section doesn’t “pop” in too hard
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700"
      aria-label={t("quickAccess") || "Quick access"}
    >
      {/* ----- Tabs header ----- */}
      <div
        className="flex border-b border-gray-200 dark:border-gray-700"
        role="tablist"
      >
        <button
          onClick={() => setActiveTab("recent")}
          role="tab"
          aria-selected={activeTab === "recent"}
          className={`flex-1 py-3 text-sm font-medium transition-colors ${
            activeTab === "recent"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          }`}
        >
          {t("recentSearches")} ({recentSearches.length})
        </button>

        <button
          onClick={() => setActiveTab("favorites")}
          role="tab"
          aria-selected={activeTab === "favorites"}
          className={`flex-1 py-3 text-sm font-medium transition-colors ${
            activeTab === "favorites"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          }`}
        >
          {t("favoriteCities")} ({favorites.length})
        </button>
      </div>

      {/* ----- Tab body ----- */}
      <div className="p-4">
        {/* AnimatePresence lets the two panels cross-fade when you switch tabs */}
        <AnimatePresence mode="wait">
          {activeTab === "recent" ? (
            <motion.div
              key="recent"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-2"
              role="tabpanel"
            >
              {recentSearches.length > 0 ? (
                <>
                  {/* Row: title + optional "clear all" if the context exposed it */}
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      {t("recentSearches")}
                    </h3>

                    {typeof clearRecentSearches === "function" && (
                      <button
                        onClick={clearRecentSearches}
                        className="text-xs text-red-500 hover:text-red-700 transition-colors"
                        aria-label={
                          t("clearAll") || "Clear all recent searches"
                        }
                      >
                        {t("clearAll")}
                      </button>
                    )}
                  </div>

                  {/* Pills for each recent city; clicking triggers a search upstream */}
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((city) => (
                      <motion.button
                        key={`${city.id}-${city.name}`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onCitySelect(city.name)}
                        className="px-3 py-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-lg text-sm hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                        aria-label={`${t("search")} ${city.name}`}
                      >
                        {city.name}
                        {city.country ? `, ${city.country}` : ""}
                      </motion.button>
                    ))}
                  </div>
                </>
              ) : (
                // Empty state for recent tab
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                  {t("noRecentSearches")}
                </p>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="favorites"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-2"
              role="tabpanel"
            >
              {favorites.length > 0 ? (
                <>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      {t("favoriteCities")}
                    </h3>

                    {/* If your context provides a clearFavorites, show the action */}
                    {typeof clearFavorites === "function" && (
                      <button
                        onClick={clearFavorites}
                        className="text-xs text-red-500 hover:text-red-700 transition-colors"
                        aria-label={t("clearAll") || "Clear all favorites"}
                      >
                        {t("clearAll")}
                      </button>
                    )}
                  </div>

                  {/* Pills for favorites; matches the amber styling you used elsewhere */}
                  <div className="flex flex-wrap gap-2">
                    {favorites.map((city) => (
                      <motion.button
                        key={`${city.id}-${city.name}`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onCitySelect(city.name)}
                        className="px-3 py-2 bg-amber-50 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 rounded-lg text-sm border border-amber-200 dark:border-amber-700 hover:bg-amber-100 dark:hover:bg-amber-800 transition-colors"
                        aria-label={`${t("search")} ${city.name}`}
                      >
                        {city.name}
                        {city.country ? `, ${city.country}` : ""}
                      </motion.button>
                    ))}
                  </div>
                </>
              ) : (
                // Empty state for favorites tab
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                  {t("noFavoriteCities")}
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default QuickAccess;
