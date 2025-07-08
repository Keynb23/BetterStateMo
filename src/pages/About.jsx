import { useMedia } from '../context/MediaContext';
import './PageStyles.css';
// import closeup from '../assets/Trucks/closeup.jpg';
// import WhiteBTtruck from '../assets/Trucks/blackClose.jpg';
// import Cleaners from '../assets/animate/Cleaners.jpg';

export default function About() {
  const { owners } = useMedia();

  return (
    <>
    
      <div className="about-container">
        <div className="section-title">
            <h1>About Us</h1>
          </div>
        <div className="about-content">
          <div className="about-section">
            <p className="about-sec-p">
              Founded in 2023, with over 10 years of experience. Better State is dedicated to giving
              you Better Pools.
            </p>
            <p className="about-sec-p">
              Proudly serving Mid-Missouri with expert, eco-friendly pool cleaning services.
            </p>
            <p className="about-sec-p">We are built on Trust, Reliability, and Quality. NOTE:
              I'm not sure if I want these cards to be that light gray almost white color or
              this dark gray almost black color. What do you think? The contact page is the lighter version.
            </p>
            {/* <div className="about-trucks-container">
          <img className="about-images" src={closeup} alt="Truck" />
          <img className="about-images" src={WhiteBTtruck} alt="Truck" />
          <img className="about-images" src={Cleaners} alt="Truck" />
        </div> */}
          </div>
          
        </div>
        {/* ---------------- MEET THE OWNERS -----------------*/}
        <div className="meet-us">
          <div className="section-title">
            <h1>Meet The Owners</h1>
          </div>
          <div className="meet-row">
            <img src={owners.andrew} alt="Andrew" />
            <div className="text-block">
              <h2>Andrew Royer</h2>
              <p>
                Andrew runs Better State Mo. Don't hesitate to call! or something idk. 
                he hasn't really given me anything to put here
                <span className="andrew-number">573-823-6325</span>
              </p>
            </div>
          </div>
          <div className="meet-row row-reverse">
            <img src={owners.josh} alt="Josh" />
            <div className="text-block">
              <h2>Joshua Efferson</h2>
              <p>Joshua is an U.S Army Veteran. He runs our other company, <a href="https://coatyourpool.com/" className="Othersite-link">Coat Your Pool</a></p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
