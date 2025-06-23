import { useMedia } from "../context/MediaContext";
import './PageStyles.css'

export default function About() {
  const { owners } = useMedia();

  return (
    <>
      <div className="about-container">
        <div className="about-content">
          {/* Changed this to div with section-title class */}
          <div className="section-title">
            <h1>About Us</h1>
          </div>

          <div className="about-section">
            {/* Grouped paragraphs in a div for better structure and potential future styling */}
            <div>
              <p>
                Better State is a Veteran-owned business proudly serving Mid-Missouri
                with expert, eco-friendly pool cleaning services Co-Owned by Andrew
                Royer and Joshua Efferson.
              </p>

              <p>
                Better State is built on trust,
                reliability, and a shared passion for helping people enjoy clean and
                safe pools...
              </p>
            </div>
          </div>

          <div className="meet-us">
            {/* Changed this to div with section-title class, also updated the h1 to remove the border-bottom property because the border is being handled on the .meet-us > h1 in css now */}
            <div className="section-title">
              <h1>Meet The Owners</h1>
            </div>

            <div className="meet-row">
              <img src={owners.andrew} alt="Andrew" />
              <div className="text-block">
                <h2>Andrew Royer</h2>
                <p>
                  Loves basketball, working out, and hard work. What else does he love? I don't know
                  to be honest. I'm just a web developer who snaps him and would say what's up to him
                  at the gym. I'm just trying to fill in this space here with random words to see what it looks like.
                </p>
              </div>
            </div>

            <div className="meet-row row-reverse">
              <img src={owners.josh} alt="Josh" />
              <div className="text-block">
                <h2>Joshua Efferson</h2>
                <p>
                  Joshua is a U.S. Veteran with a commitment to hard work and
                  quality service. That's all I know about him. I think he has a kid. I'm assuming that's his dog.
                  Probably married. Could be a Viltrumite with the mustache. Keep an eye on'em. Get it? Eye on'em?
                  like the dude that Seth Rogan voices in Invincible? Oh you haven't seen Invincible?
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}