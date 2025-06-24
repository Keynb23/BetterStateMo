import ecoFriendly from "../assets/objections/ecoFriendly.png";
import Savings from "../assets/objections/Savings.png";
import reliability from '../assets/objections/reliability.png';
import customerSatisfaction from '../assets/objections/customer-satisfaction.png';

import './ComponentStyles.css'


export default function ObjectionBlockers() {
  return (
    <section className="objection-blockers-wrapper"> {/* Changed to <section> for semantic HTML */}
      <h2 className="objection-blockers-title">Why Choose Us?</h2> {/* Added a title */}
      <div className="main-content-row">
        <div className="objection-block-item">
          <img className="obj-img" src={ecoFriendly} alt="Eco Friendly Products" /> {/* More descriptive alt text */}
          <div className="img-text">
            <h3>Eco-Friendly</h3> {/* Changed to h3 for semantic heading within item */}
            <p>We only use eco-friendly products and materials for a healthier environment.</p> {/* Clarified text */}
          </div>
        </div>

        <div className="objection-block-item">
          <img className="obj-img" src={Savings} alt="Cost Savings and Discounts" /> {/* More descriptive alt text */}
          <div className="img-text">
            <h3>Affordable Pricing</h3> {/* Changed to h3 and more direct */}
            <p>We offer competitive pricing and various discounts to fit your budget.</p> {/* Clarified text */}
          </div>
        </div>

        <div className="objection-block-item">
          <img className="obj-img" src={customerSatisfaction} alt="Customer Satisfaction" />
          <div className="img-text">
            <h3>Customer Satisfaction</h3>
            <p>Your satisfaction is our top priority, guaranteed with every service.</p>
          </div>
        </div>

        <div className="objection-block-item">
          <img className="obj-img" src={reliability} alt="Reliable Service" />
          <div className="img-text">
            <h3>Reliable Service</h3>
            <p>We pride ourselves on punctuality and consistent, high-quality service.</p>
          </div>
        </div>
      </div>
    </section>
  );
}