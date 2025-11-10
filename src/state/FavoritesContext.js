import React, { createContext, useContext, useState, useEffect } from "react";

const FavoritesContext = createContext();

/**
 * Small hook wrapper so consumers get a nice error
 * if they forget to wrap the app with <FavoritesProvider>.
 */
export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
};

export const FavoritesProvider = ({ children }) => {
  // In-memory state mirrors localStorage
  const [favorites, setFavorites] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);

  /**
   * On first mount, hydrate from localStorage.
   * We keep parsing simple; if JSON is corrupted, the try/catch
   * note below shows how you could harden this without changing UX.
   */
  useEffect(() => {
    const savedFavorites = localStorage.getItem("weatherFavorites");
    const savedRecent = localStorage.getItem("weatherRecentSearches");

    // NOTE: if you want to be extra safe, wrap JSON.parse in try/catch.
    if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
    if (savedRecent) setRecentSearches(JSON.parse(savedRecent));
  }, []);

  /**
   * Add a city to favorites.
   * Assumes caller passes an object like { id, name, country, coord }.
   * If you want to avoid duplicates, you can early-return when it already exists.
   */
  const addFavorite = (cityData) => {
    const newFavorites = [...favorites, cityData];
    setFavorites(newFavorites);
    localStorage.setItem("weatherFavorites", JSON.stringify(newFavorites));
  };

  /**
   * Remove a city from favorites by its OpenWeather city id.
   */
  const removeFavorite = (cityId) => {
    const newFavorites = favorites.filter((city) => city.id !== cityId);
    setFavorites(newFavorites);
    localStorage.setItem("weatherFavorites", JSON.stringify(newFavorites));
  };

  /**
   * Track recent searches (most-recent first).
   * - Dedupes by id (latest click wins).
   * - Keeps only the last 5.
   */
  const addRecentSearch = (cityData) => {
    const newRecent = [
      cityData,
      ...recentSearches.filter((city) => city.id !== cityData.id),
    ].slice(0, 5);
    setRecentSearches(newRecent);
    localStorage.setItem("weatherRecentSearches", JSON.stringify(newRecent));
  };

  /**
   * Clear only the recent searches.
   * Useful when the user wants a clean slate but keep favorites.
   */
  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.setItem("weatherRecentSearches", JSON.stringify([]));
  };

  /**
   * Quick check to know if a city is already favorited.
   * Handy for toggling heart icons.
   */
  const isFavorite = (cityId) => {
    return favorites.some((city) => city.id === cityId);
  };

  // Context value exposed to consumers
  const value = {
    favorites,
    recentSearches,
    addFavorite,
    removeFavorite,
    addRecentSearch,
    clearRecentSearches,
    isFavorite,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};
