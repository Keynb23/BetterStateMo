import { createContext, useContext } from 'react';

// import images
import andrew from '../assets/owners/andrew.jpg';
import josh from '../assets/owners/josh.jpg';

// import pools images (example)
import pool1 from '../assets/pools/apt.complex.jpg';
import pool2 from '../assets/pools/blue-wood.jpg';
import pool3 from '../assets/pools/bluepool.jpg';
import pool4 from '../assets/pools/cleanbox.jpg';
import pool5 from '../assets/pools/dirtybox.jpg';
import pool6 from '../assets/pools/fire-pool-finish.jpg';
import pool7 from '../assets/pools/fire-wood-blue.jpg';
import pool8 from '../assets/pools/hottub.square.jpg';
import pool9 from '../assets/pools/paintchips.jpg';
import pool10 from '../assets/pools/paintchipsno.jpg';
import pool11 from '../assets/pools/pool-fire.jpg';
import pool12 from '../assets/pools/pool-wood.jpg';
import pool13 from '../assets/pools/pool.jpg';
import pool14 from '../assets/pools/pool1.jpg';
import pool15 from '../assets/pools/whitepool.jpg';
import pool16 from '../assets/pools/wood-blue-finish.jpg';
import pool17 from '../assets/pools/aria.jpg';
import pool18 from '../assets/pools/aria.after.jpg';
import pool19 from '../assets/pools/apt.complex.jpg';
import pool20 from '../assets/pools/citypool.jpg';
import pool21 from '../assets/pools/smallApts.jpg';
import pool22 from '../assets/pools/squareaptPool.jpg';
import pool23 from '../assets/pools/diagPool.jpg';
import pool24 from '../assets/pools/Droneshot1.jpg';
import pool25 from '../assets/pools/LshapedPool.jpg';
import pool26 from '../assets/pools/BackYard.jpg';
import pool27 from '../assets/pools/BW.trees.jpg';
import pool28 from '../assets/pools/CircleAria.jpg';
import pool29 from '../assets/pools/glass.dif.pov.jpg';
import pool30 from '../assets/pools/glassWall.jpg';
import pool31 from '../assets/pools/longWeird.jpg';
import pool32 from '../assets/pools/pool009.jpg';
import pool33 from '../assets/pools/pool999.jpg';
import pool34 from '../assets/pools/poolv090.jpg';
import pool35 from '../assets/pools/smallpop.jpg';
import pool36 from '../assets/pools/Truck.jpg';
import pool37 from '../assets/pools/waterPark.jpg';
import pool38 from '../assets/pools/waterParkFilled.jpg';
import pool39 from '../assets/pools/BrownBlue.jpg'; // app BG image
import pool40 from '../assets/pools/BrownBlue2.jpg';  // app BG image
import pool41 from '../assets/pools/BrownBlue3.jpg';  // app BG image
import pool42 from '../assets/pools/DarkSquare1.jpg';
import pool43 from '../assets/pools/DarkSquare2.jpg';  // app BG image
import pool44 from '../assets/pools/Halfwall1.jpg';
import pool45 from '../assets/pools/Halfwall2.jpg';
import pool46 from '../assets/pools/Halfwall3.jpg';
import pool47 from '../assets/pools/Halfwall4.jpg';
import pool48 from '../assets/pools/LightBlueSqu.jpg'; // app BG image
import pool49 from '../assets/pools/LightBlueSqu2.jpg'; // app BG image
import pool50 from '../assets/pools/LightBlueSqu3.jpg';
import pool51 from '../assets/pools/Rounded1.jpg'; // app BG image
import pool52 from '../assets/pools/droneshot2.jpg'; // app BG image


// logo import
import Logo from '../assets/owners/Logo.png';

// videos

import Video1 from '../assets/videos/fire.mp4';
import Video2 from '../assets/videos/fire2.mp4';
import EditedDroneVid from '../assets/videos/EditedDroneVid.mp4';

// 1. Create context
const MediaContext = createContext();

// 2. Create provider
export const MediaProvider = ({ children }) => {
  const owners = {
    andrew,
    josh,
    Logo,
  };
  // 1 is 0, 2 is 1, etc.
  const pools = [
    pool1,
    pool2,
    pool3,
    pool4,
    pool5,
    pool6,
    pool7,
    pool8,
    pool9,
    pool10,
    pool11,
    pool12,
    pool13,
    pool14,
    pool15,
    pool16,
    pool17,
    pool18,
    pool19,
    pool20,
    pool21,
    pool22,
    pool23,
    pool24,
    pool25,
    pool26,
    pool27,
    pool28,
    pool29,
    pool30,
    pool31,
    pool32,
    pool33,
    pool34,
    pool35,
    pool36,
    pool37,
    pool38,
    pool39,  // app BG image
    pool40, // app BG image
    pool41,  // app BG image
    pool42,  
    pool43, // app BG image
    pool44,
    pool45,
    pool46,
    pool47,
    pool48, // app BG image
    pool49, // app BG image
    pool50,
    pool51, // app BG image
    pool52,  // app BG image
  ];

  //  use these for Background = [
  //   pool39,
  //   pool40,
  //   pool41,
  //   pool43,
  //   pool48,
  //   pool49,
  //   pool51,
  // ];

  const videos = [Video1, Video2, EditedDroneVid];

  return (
    <MediaContext.Provider value={{ owners, pools, videos }}>{children}</MediaContext.Provider>
  );
};

// 3. Custom hook (optional but clean)
export const useMedia = () => useContext(MediaContext);
