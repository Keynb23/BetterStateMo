// src/About/About.jsx
// This is the updated About page. It will only contain the general "About Us" content.
// The "Meet the Owners" section has been moved to the bottom of this file.
import EditedDroneVid from '../assets/videos/EditedDroneVid.mp4';
import './AboutStyles.css';

export default function About() {
  return (
    <div className="about-page-container">
      <h3 className="about-opening-text">
        Proudly serving Mid-Missouri with expert, eco-friendly pool cleaning services.
      </h3>
      <div className="about-us-section">
        <div className="section-title">
          <h1>About Us</h1>
        </div>
        <div className="about-sec-text">
          <p className="about-sec-p">
            Founded in 2023, with over 10 years of experience. Better State is dedicated to giving
            you Better Piece of mind. Our mission is to ensure every pool in Mid-Missouri is
            sparkling clean, safe, and a source of enjoyment for its owners. We utilize the latest
            eco-friendly techniques and products to minimize environmental impact.
          </p>

          <h4 className="about-sec-footer">We are built on Trust, Reliability, and Quality.</h4>
        </div>
        <div className="about-trucks-container">
          <video
            src={EditedDroneVid}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="about-video"
          >
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    </div>
  );
}

// OWNER SECTION IF WE EVER NEED TO RE-ADD IT ------------------------------

/* Andrew's Section(I commented this out. I want to keep it commented out, just moved to the bottom of the file) */
/* <div
                    className={getColumnClass('andrew')}
                    onMouseEnter={handleMouseEnter.bind(null, 'andrew')}
                    onClick={() => handleSectionClick('andrew')}
                >
                    <div className="column-content">
                        <div className="section-title">
                            <h1>Meet Andrew</h1>
                        </div>
                        <img src={owners.andrew} alt="Andrew Royer" className="owner-image" />
                        <div className="text-block">
                            <h2>Andrew Royer</h2>
                            <p>
                                Andrew runs Better State Mo. Don't hesitate to call! or something idk. he hasn't
                                really given me anything to put here
                                <span className="andrew-number">573-823-6325</span>
                            </p>
                            <div className={`hidden-details ${activeSection === 'andrew' ? 'show' : ''}`}>
                                <p>Andrew founded Better State in 2023, leveraging over a decade of experience in pool maintenance and care. His passion for delivering "Better Pools" drives the company's commitment to excellence and customer satisfaction.</p>
                            </div>
                        </div>
                    </div>
                </div> */

/* Josh's Section (I commented this out. I want to keep it commented out, just moved to the bottom of the file) */
/* <div
                    className={getColumnClass('josh')}
                    onMouseEnter={handleMouseEnter.bind(null, 'josh')}
                    onClick={() => handleSectionClick('josh')}
                >
                    <div className="column-content">
                        <div className="section-title">
                            <h1>Meet Joshua</h1>
                        </div>
                        <img src={owners.josh} alt="Joshua Efferson" className="owner-image" />
                        <div className="text-block">
                            <h2>Joshua Efferson</h2>
                            <p>
                                Joshua is an U.S Army Veteran. He runs our other company,{' '}
                                <a href="https://coatyourpool.com/" className="Othersite-link">
                                    Coat Your Pool
                                </a>
                            </p>
                            <div className={`hidden-details ${activeSection === 'josh' ? 'show' : ''}`}>
                                <p>Joshua, a proud U.S. Army Veteran, brings discipline and precision to every aspect of Better State's operations. His expertise also extends to pool coating through his other successful venture, Coat Your Pool, ensuring comprehensive pool solutions.</p>
                            </div>
                        </div>
                    </div>
                </div> */
