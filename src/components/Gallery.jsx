import { useState, useEffect } from "react"; // Import useEffect
import { useMedia } from "../context/MediaContext";
import './ComponentStyles.css';

const Gallery = () => {
  const { videos, pools } = useMedia();

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [shuffledMediaItems, setShuffledMediaItems] = useState([]);

  // Function to shuffle an array
  const shuffleArray = (array) => {
    let currentIndex = array.length, randomIndex;
    // While there remain elements to shuffle.
    while (currentIndex !== 0) {
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
    return array;
  };

  useEffect(() => {
    // Combine and shuffle media items when videos or pools change
    const combinedItems = [
      ...(pools || []).map((src, idx) => ({ id: `pool-${idx}`, src, type: "image", alt: `Pool image ${idx + 1}` })),
      ...(videos || []).map((src, idx) => ({ id: `video-${idx}`, src, type: "video", alt: `Video thumbnail ${idx + 1}` })),
    ];
    setShuffledMediaItems(shuffleArray([...combinedItems])); // Create a shallow copy to shuffle
  }, [videos, pools]); // Re-shuffle when videos or pools data changes

  if (shuffledMediaItems.length === 0) {
    return (
      <div className="gallery-loading">
        <p>Loading gallery items or no items available...</p>
      </div>
    );
  }

  const openModal = (item) => {
    setSelectedMedia(item);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedMedia(null);
  };

  return (
    <div className="gallery-container">
      <main className="Gallery-main">
        <h1 className="Gallery-title">Gallery</h1>
        <div className="gallery">
          {shuffledMediaItems.map((item) => ( // Use shuffledMediaItems here
            <div className="gallery-item" key={item.id} onClick={() => openModal(item)}>
              {item.type === "image" ? (
                <img
                  src={item.src}
                  alt={item.alt}
                  loading="lazy"
                />
              ) : (
                <video
                  src={item.src}
                  alt={item.alt}
                  loading="lazy"
                  autoPlay
                  loop
                  muted
                  playsInline
                  controls={false}
                />
              )}
            </div>
          ))}
        </div>
      </main>

      {modalOpen && selectedMedia && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={closeModal}>&times;</button>
            {selectedMedia.type === "image" ? (
              <img src={selectedMedia.src} alt={selectedMedia.alt} className="modal-media" />
            ) : (
              <video
                src={selectedMedia.src}
                alt={selectedMedia.alt}
                className="modal-media"
                controls
                autoPlay
                loop
                muted={false}
                playsInline
              />
            )}
            <div className="modal-info">
              <h2>{selectedMedia.title || selectedMedia.alt}</h2>
              <p>{selectedMedia.description || ''}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;