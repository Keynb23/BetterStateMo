import "./ComponentStyles.css";
// import { useMedia } from "../context/MediaContext";

const Hero = () => {
  // const { pools } = useMedia();

  // const featuredImage = pools[0];

  return (
    <>
      <div className="Hero-container">
        <div className="Hero-content">
          <h1 className="Hero-title">Better State Mo</h1>
          <p className="Hero-description">Your Mid Missouri Pool Guys</p>
        </div>

        {/* <div className="Hero-media">
          {featuredImage && (
            <div className="Hero-pool">
              <img src={featuredImage} alt="Featured Pool" />
            </div>
          )}
        </div> */}
        <div className="slogan-container">
          <h1>BETTER TOGETHER</h1>
          <h1>BETTER SERVICE</h1>
          <h1>BETTER POOLS</h1>
          {/* <h1>BETTER STATE</h1> */}
        </div>

        <button className="LearnMoreBtn">
          <a href="#about" className="btn">
            Learn More
          </a>
        </button>

        <div className="fillerContent">
          <p>
            We are a family-owned and operated pool service company based in
            Columbia, MO. Our mission is to provide the best pool service in
            Mid-Missouri. We take pride in our work and strive to exceed our
            customers' expectations.
          </p>
        </div>

      </div>
    </>
  );
};

export default Hero;
