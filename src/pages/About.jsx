import { useMedia } from "../context/MediaContext";
import './PageStyles.css'

export default function About() {
  const { owners } = useMedia();

  return (
    <>
    <div className="about-container">
      
      <div className="about-section">
        <h1 className="section-title">About Us</h1>
        <p>
          Better State is a Veteran-owned business proudly serving Mid-Missouri
          with expert, eco-friendly pool cleaning services Co-Owned by Andrew
          Royer and Joshua Efferson. Better State is built on trust,
          reliability, and a shared passion for helping people enjoy clean and
          safe pools...
        </p>
      </div>

      <div className="meet-us">
        <h1>Meet The Owners</h1>
        <div className="meet-row">
          <img src={owners.andrew} alt="Andrew" />
          <div className="text-block">
            <h2>Andrew Royer</h2>
            <p>Loves basketball, working out, and hard work.</p>
          </div>
        </div>

        <div className="meet-row row-reverse">
          <img src={owners.josh} alt="Josh" />
          <div className="text-block">
            <h2>Joshua Efferson</h2>
            <p>
              Joshua is a U.S. Veteran with a commitment to hard work and
              quality service.
            </p>
          </div>
        </div>
      </div>
    </div>
        </>
  );
}
