import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // If a hash exists, let the browser handle scrolling to the specific section.
    // We only want to scroll to top on *pure route changes* without a hash.
    if (hash) {
      return;
    }

    // Use setTimeout with a 0ms delay. This defers the scroll operation
    // until after the current browser task (like rendering the new route) is complete.
    // This gives `window.scrollTo` a better chance to execute without conflict.
    const timer = setTimeout(() => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth', // Keeping 'smooth' as you prefer
      });
    }, 0); // 0ms delay: executes as soon as the browser is free

    // Cleanup function to clear the timeout if the component unmounts
    // or the pathname/hash changes again before the timeout fires.
    return () => clearTimeout(timer);
  }, [pathname, hash]); // Effect depends on pathname and hash changes

  return null;
};

export default ScrollToTop;