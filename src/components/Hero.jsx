import "./ComponentStyles.css";
import { useMedia } from "../context/MediaContext"; // Correct import for the hook
import Slogan from "./Slogan";

const Hero = () => { // <
  const { videos, pools } = useMedia(); 

  const backgroundVideo = videos.find((video) =>
    video.includes("underWater.mp4")
  );

  const featuredVideo = videos[0];
  const featuredImage = pools[3];

  return (
    <>
      <div className="Hero-container">
        <div className="Hero-content">
          <h1 className="Hero-title">Better State</h1>
          <p className="Hero-description">Your Mid Missouri Pool Guys</p>
        </div>

        <div className="Hero-videos">
            {featuredVideo && (
              <div className="Hero-video">
                <video controls src={featuredVideo}/>
              </div>
            )}
          </div>

          <div className="Hero-pools">
            {featuredImage && (
              <div className="Hero-pool">
                <img
                  src={featuredImage}
                  alt="Featured Pool"/>
              </div>
            )}
          </div>

        <div className="Hero-bottom">
          {backgroundVideo && (
            <video
              autoPlay
              loop
              muted
              playsInline
              className="Hero-background-media"
            >
              <source src={backgroundVideo} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}
          

          <div className="hero-slogan-section">
            <Slogan />
          </div>

          
        </div>
      </div>
    </>
  );
};

export default Hero;