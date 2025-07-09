import useMediaQuery from '../context/useMediaQuery'; // Import the new hook
import AboutDesktop from './AboutDesktop';
import AboutMobile from './AboutMobile';
import { Fragment } from 'react';

export default function About() {
    // Use the custom hook to determine if the screen matches a mobile breakpoint
    // This query string must match your CSS media query breakpoint
    const isMobile = useMediaQuery('(max-width: 768px)');

    return (
        <Fragment>
            {isMobile ? <AboutMobile /> : <AboutDesktop />}
        </Fragment>
    );
}