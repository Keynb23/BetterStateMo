import "./ComponentStyles.css";
import { useMedia } from "../context/MediaContext";
import Slogan from "./Slogan";

const Hero = () => {
  const { videos } = useMedia();
  const { pools } = useMedia();

  return (
    <>
      <div className="Hero-container">
        
          <div className="Hero-content">
            <h1 className="Hero-title">Better State</h1>
            <p className="Hero-description">Your Mid Missouri Pool Guys</p>
          </div>

        <div className="Hero-bottom">
          <div className="Hero-videos">
            {videos.map((video, index) => (
              <div key={index} className="Hero-video">
                <h2>{video.title}</h2>
                <p>{video.description}</p>
              </div>
            ))}
          </div>
          <div className="hero-slogan-section">
            <Slogan />
          </div>
          <div className="Hero-pools">
            {pools.map((pool, index) => (
              <div key={index} className="Hero-pool">
                <h2>{pool.name}</h2>
                <p>{pool.details}</p>
              </div>
            ))}
          </div>

          
        </div>
      </div>
    </>
  );
};

export default Hero;
