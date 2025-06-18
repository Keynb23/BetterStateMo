import "./ComponentStyles.css";

const Hero = () => {
  return (
    <>
      <div className="Hero-container">
        <div id="wrapper">
          {Array.from({ length: 15 }).map((_, index) => (
            <div key={index}>
              <span className="dot"></span>
            </div>
          ))}
          </div>
          <div className="Hero-content">
            <h1 className="Hero-title">Better State</h1>
            <p className="Hero-description">
              Why go with okay, when you can have Better?
            </p>

            <div className="fillerContent">
              
            </div>
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

          {/* <button className="LearnMoreBtn">
          <a href="#about" className="btn">
            Learn More
          </a>
        </button> */}
        
      </div>
    </>
  );
};

export default Hero;
