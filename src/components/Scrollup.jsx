import { useEffect } from 'react'

export default function ScrollUp() {
  useEffect(() => window.document.scrollingElement?.scrollTo(0, 0), [])

  return null
}


// import { useEffect } from 'react';
// import { useLocation } from 'react-router-dom';

// function ScrollToTop() {
//   const { pathname } = useLocation();

//   useEffect(() => {

//     document.documentElement.scrollTo({
//       top: 0,
//       left: 0,
//       behavior: 'auto', 
//     });
//   }, [pathname]);

//   return null;
// }

// export default ScrollToTop;

