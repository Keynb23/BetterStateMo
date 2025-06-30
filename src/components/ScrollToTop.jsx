// ScrollToTop.jsx (Updated and Corrected)
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function ScrollToTop() {
  const { pathname } = useLocation();

  // Define the pages that should always load at the top
  const pagesToScroll = ['/setapt', '/login', '/profile', '/gallery'];

  useEffect(() => {
    // Check if the current page is one of the designated pages
    if (pagesToScroll.includes(pathname)) {
      // Find the main scrollable container in your app
      const scrollableContainer = document.querySelector('.app-container');
      
      // Use the container if found, otherwise default to the window
      const elementToScroll = scrollableContainer || window;

      elementToScroll.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant'
      });
    }
  }, [pathname]); // Effect runs every time the page URL changes

  return null; // This component does not render anything
}

export default ScrollToTop;