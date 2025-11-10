import { useEffect } from "react";

/**
 * Keyboard helpers for your search box.
 *
 * Shortcuts:
 *  - "/" or Ctrl+/ (and ⌘/ on mac)  → focus the search input
 *  - Esc                              → clear & blur the search input
 *  - Enter (while search is focused)  → submit the query via onSearch
 *
 * Notes:
 *  - We attach a single keydown listener on document.
 *  - We avoid hijacking "/" if the user is already typing in another field.
 */
export const useKeyboardShortcuts = (searchRef, onSearch, onClear) => {
  useEffect(() => {
    const handleKeyPress = (event) => {
      const el = searchRef?.current;

      // If the event target is a text-editing element (and it's not our own search),
      // don't steal its keystrokes. This prevents "/" from yanking focus away
      // while the user is typing in another input/textarea/contentEditable.
      const target = event.target;
      const isEditable =
        target?.isContentEditable ||
        ["INPUT", "TEXTAREA"].includes(target?.tagName);
      const isOurSearch = el && target === el;

      // --- Focus search: "/" or Ctrl+/ or Meta+/ (mac) ---
      // We only react if the user isn't already typing inside some other field.
      if (
        !isOurSearch &&
        !isEditable &&
        (event.key === "/" || // plain "/"
          (event.key === "/" && (event.ctrlKey || event.metaKey))) // Ctrl+/ or ⌘+/
      ) {
        event.preventDefault();
        if (el) el.focus();
        return;
      }

      // --- Clear search: Escape ---
      if (event.key === "Escape") {
        if (el) {
          el.value = "";
          el.blur(); // blur to get out of the field
          if (onClear) onClear(); // let the app reset results, etc.
        }
        return;
      }

      // --- Submit search: Enter (only when our search has focus) ---
      if (event.key === "Enter" && isOurSearch) {
        event.preventDefault();
        const value = el.value?.trim();
        if (onSearch && value) onSearch(value);
        return;
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [searchRef, onSearch, onClear]);
};
