import { useMedia } from '../context/MediaContext';
import './PageStyles.css';

export default function About() {
  const { owners } = useMedia();

  return (
    <>
      <div className="about-container">
        <div className="about-content">
          <div className="section-title">
            <h1>About Us</h1>
          </div>

          <div className="about-section">
            <p className="about-sec-p">
              Better State is a Veteran-owned business proudly serving Mid-Missouri with expert,
              eco-friendly pool cleaning services Co-Owned by Andrew Royer and Joshua Efferson.
            </p>

            <p className="about-sec-p">
              Better State is built on trust, reliability, and a shared passion for helping people
              enjoy clean and safe pools...
            </p>
          </div>
        </div>

        <div className="meet-us">
          <div className="section-title">
            <h1>Meet The Owners</h1>
          </div>

          <div className="meet-row">
            <img src={owners.andrew} alt="Andrew" />
            <div className="text-block">
              <h2>Andrew Royer</h2>
              <p>
                Loves basketball, working out, and hard work
                <p className="andrew-number">573-823-6325</p>
              </p>
            </div>
          </div>

          <div className="meet-row row-reverse">
            <img src={owners.josh} alt="Josh" />
            <div className="text-block">
              <h2>Joshua Efferson</h2>
              <p>
                Joshua is a U.S. Veteran with a commitment to hard work and quality service. That's
                all I know about him. I think he has a kid. I'm assuming that's his dog. Probably
                married. Could be a Viltrumite with the mustache. Keep an eye on'em. Get it? Eye
                on'em? like the dude that Seth Rogan voices in Invincible? Oh you haven't seen
                Invincible?
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
