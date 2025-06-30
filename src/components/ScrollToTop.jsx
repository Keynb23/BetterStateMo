import { useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';


export default function ScrollToTop() {
const { pathname } = useLocation();
console.log(pathname)


useLayoutEffect(() => {
// Use setTimeout to ensure scroll happens after render
setTimeout(() => {
// Try all possible scrollable containers
const container = document.querySelector('.app-container');
if (container) {
container.scrollTop = 0;
container.scrollLeft = 0;
}
window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
document.documentElement.scrollTop = 0;
document.body.scrollTop = 0;
}, 0);
}, [pathname]);


return null;
}