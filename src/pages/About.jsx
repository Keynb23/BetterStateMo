import { useMedia } from "../context/MediaContext";

export default function About() {
  const { owners } = useMedia();

  return (
    <div className="about-container">
      <div className="about-section">
        <h1 className="section-title">About Us</h1>
        <p>
          Better State is a Veteran-owned business proudly serving Missouri with
          expert, eco-friendly pool cleaning services. Founded by Joshua
          Efferson, a U.S. Veteran with a commitment to hard work and quality
          service, and co-owned by Andrew Royer, Better State is built on trust,
          reliability, and a shared passion for helping people enjoy clean, safe
          pools...
        </p>
      </div>

      <div className="meet-us">
        <div className="meet-us-wrapper">
          <h1 className="section-title">Meet Us. added borders for a debug thing for later</h1>

          <div id='josh-row' className="meet-row">
            <img src={owners.josh} alt="Josh" />
            <div className="text-block">
              <h2>Joshua Efferson, CEO</h2>
              <p>Loves long walks on the beach</p>
            </div>
          </div>

          <div id='andrew-row' className="meet-row">
            <div className="text-block">
              <h2>Andrew Royer, COO</h2>
              <p>When he's not working, he's working out</p>
            </div>
            <img src={owners.andrew} alt="Andrew" />
          </div>
        </div>
      </div>

      <h3 className="slogan">
        Let us help you create a better state for your home or business.
      </h3>
    </div>
  );
}
