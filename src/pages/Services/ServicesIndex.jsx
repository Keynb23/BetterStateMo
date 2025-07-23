import { Fragment } from 'react';
import useMediaQuery from '../../context/useMediaQuery';
import ServicesMobile from './ServicesMobile';
import Services from './Services';
export default function ServicesIndex() {
  // Sets the breakpoint to match the CSS file exactly
  const isMobile = useMediaQuery('(max-width: 767px)');

  

  return (
    <Fragment>
      {isMobile ? <ServicesMobile /> : <Services />}
    </Fragment>
  );
}