// src/hooks/useMediaQuery.js
import { useState, useEffect } from 'react';

function useMediaQuery(query) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // Check if window is defined (for SSR compatibility)
    if (typeof window !== 'undefined') {
      const mediaQueryList = window.matchMedia(query);

      // Set initial match state
      setMatches(mediaQueryList.matches);

      // Function to update state on media query changes
      const listener = (event) => setMatches(event.matches);

      // Add listener
      mediaQueryList.addEventListener('change', listener);

      // Cleanup listener on unmount
      return () => {
        mediaQueryList.removeEventListener('change', listener);
      };
    }
  }, [query]); // Re-run effect if the query string changes

  return matches;
}

export default useMediaQuery;