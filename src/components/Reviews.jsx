import { useEffect } from 'react';
import './ComponentStyles.css';

const Reviews = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://featurable.com/assets/bundle.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      if (document.body.contains(script)) document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="reviews-container">
      <h2 className="reviews-title">Still not sold?</h2>
      <h3>Check out what our past customers had to say about us.</h3>
      <div id="featurable-ca2a761d-f9d6-426a-aa61-453c29b316b6" data-featurable-async></div>
      <div className="brand_hider"></div>
    </div>
  );
};

export default Reviews;
