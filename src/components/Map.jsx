import Missouri from "../assets/states/Missouri.png";
import './ComponentStyles.css'

export default function Map() {

    return (
        <>
        <div className="map-with-text-section">
                  <div className="Missouri-map-container-styled">
                    <img src={Missouri} alt="Missouri" />
                  </div>
                  <p className="map-description-text">
                  </p>
                </div>
                </>
    )
};