// /src/About/About.jsx
import './AboutStyles.css';

// About Component
export default function About() {
 return (
<div className="about-page-container">
 <div className="section-title">
<h1>About BetterStatePools</h1>
 </div>
 <div className="about-us-section">
<div className="about-sec-text">

 {/* NEW: Mission Statement / Headline */}
 <h2 className="about-sec-h2">Your Trusted Partner in Pool Care</h2>
 
 {/* NEW: History and Experience Paragraph */}
 <p className="about-sec-p-header">
BetterStatePools was officially founded in 2023, 
yet our team brings over 10 years of professional experience to every pool we service. 
We understand that your pool is a major investment and a place for relaxation and it should be treated that way.
 </p>

 {/* NEW: Core Mission & Location */}
 <p className="about-sec-p">
Our mission in Mid-Missouri is simple: to deliver Trust, Reliability, 
and Quality service so you can enjoy better peace of mind. We ensure your pool is always sparkling clean,
 perfectly safe, and a hassle-free source of enjoyment for your family.
 </p>
 
 {/* NEW: Values and Differentiator (Eco-Friendly) */}
 <p className="about-sec-p">
We utilize the latest techniques and high-quality,
 eco-friendly products to minimize environmental impact while maximizing water clarity and equipment lifespan.
 </p>

 {/* NEW: Slogan/CTA Footer */}
 <h4 className="about-sec-footer">
Enjoy your pool—We'll handle the rest.
 </h4>
</div>
 </div>
</div>
 );
}