import ecoFriendly from "../assets/objections/ecoFriendly.png";
import Savings from "../assets/objections/Savings.png";

import './ComponentStyles.css'


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

        

        <div className="objection-block-item">
          <img className="obj-img" src={Savings} alt="Savings" />
          <div className="img-text">
            <p>We offer competitive pricing and discounts</p>
          </div>
        </div>
      </div>
    </div>
  );
}
