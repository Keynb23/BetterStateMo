import ecoFriendly from "../assets/objections/ecoFriendly.png";
import Savings from "../assets/objections/Savings.png";
import Missouri from "../assets/states/Missouri.png";

export default function ObjectionBlockers() {
  return (
    // This new wrapper will handle the overall centering and stacking
    <div className="objection-blockers-wrapper">
      {/* Image blocks row - remains as is for its internal layout */}
      <div className="main-content-row">
        <div className="objection-block-item">
          <img className="obj-img" src={ecoFriendly} alt="eco Friendly" />
          <div className="img-text">
            <p>We only use eco friendly products and materials</p>
          </div>
        </div>

        <div className="map-with-text-section">
          <div className="Missouri-map-container-styled">
            <img src={Missouri} alt="Missouri" />
          </div>
          <p className="map-description-text">
            service all of central missouri
          </p>
        </div>

        <div className="objection-block-item">
          <img className="obj-img" src={Savings} alt="Savings" />
          <div className="img-text">
            <p>We offer competitive pricing and discounts</p>
          </div>
        </div>
      </div>
      {/* Slogan section - remains as is for its internal layout */}
      <div className="slogan-container">
        <div className="slogan-static-part">
          <h1>BETTER</h1>
        </div>
        <div className="slogan-dynamic-word-stack">
          <h1 className="swap-word word-1">POOLS</h1>
          <h1 className="swap-word word-2">TOGETHER</h1>
          <h1 className="swap-word word-3">STATE</h1>
        </div>
      </div>
    </div>
  );
}
