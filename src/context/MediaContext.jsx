import { createContext, useContext } from 'react'

// import images
import andrew from '../assets/owners/andrew.jpg'
import josh from '../assets/owners/josh.jpg'

// import pools images (example)
import pool1 from '../assets/pools/apt.complex.jpg'
import pool2 from '../assets/pools/blue-wood.jpg'
import pool3 from '../assets/pools/bluepool.jpg'
import pool4 from '../assets/pools/cleanbox.jpg'
import pool5 from '../assets/pools/dirtybox.jpg'
import pool6 from '../assets/pools/fire-pool-finish.jpg'
import pool7 from '../assets/pools/fire-wood-blue.jpg'
import pool8 from '../assets/pools/hottub.square.jpg'
import pool9 from '../assets/pools/paintchips.jpg'
import pool10 from '../assets/pools/paintchipsno.jpg'
import pool11 from '../assets/pools/pool-fire.jpg'
import pool12 from '../assets/pools/pool-wood.jpg'
import pool13 from '../assets/pools/pool.jpg'
import pool14 from '../assets/pools/pool1.jpg'
import pool15 from '../assets/pools/whitepool.jpg'
import pool16 from '../assets/pools/wood-blue-finish.jpg'
import pool17 from '../assets/pools/aria.jpg'
import pool18 from '../assets/pools/aria.after.jpg' 
import pool19 from '../assets/pools/apt.complex.jpg' 
import pool20 from '../assets/pools/citypool.jpg'



// logo import
import logo from '../assets/owners/logo.jpg'

// videos 

import Video1 from '../assets/videos/fire.mp4'
import Video2 from '../assets/videos/fire2.mp4'
import underWater from '../assets/videos/underwater.mp4'


// 1. Create context
const MediaContext = createContext()

// 2. Create provider
export const MediaProvider = ({ children }) => {
  const owners = {
    andrew,
    josh,
    logo,
  }

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
    pool20
  ]

  const videos = [
    Video1,
    Video2,
    underWater,
  ]


  return (
    <MediaContext.Provider value={{ owners, pools, videos}}>
      {children}
    </MediaContext.Provider>
  )
}

// 3. Custom hook (optional but clean)
export const useMedia = () => useContext(MediaContext)
