import { useState, useEffect, useRef } from "react"; // Import React, useState
import { useMedia } from "../context/MediaContext";
import './ComponentStyles.css';

const Gallery = () => {
  const { videos, pools } = useMedia();

  // State to manage modal visibility and the media item to display
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);

  const mediaItems = [
    ...(pools || []).map((src, idx) => ({ id: `pool-${idx}`, src, type: "image", alt: `Pool image ${idx + 1}` })),
    ...(videos || []).map((src, idx) => ({ id: `video-${idx}`, src, type: "video", alt: `Video thumbnail ${idx + 1}` })),
  ];

  if (mediaItems.length === 0) {
    return (
      <div className="gallery-loading">
        <p>Loading gallery items or no items available...</p>
      </div>
    );
  }

  const handleMediaLoad = (e) => {
    const mediaElement = e.target;
    const figureElement = mediaElement.closest('figure');

    if (!figureElement) return;

    const gridAutoRowsUnit = 10;

    let naturalWidth;
    let naturalHeight;

    if (mediaElement.tagName === 'IMG') {
      naturalWidth = mediaElement.naturalWidth;
      naturalHeight = mediaElement.naturalHeight;
    } else if (mediaElement.tagName === 'VIDEO') {
      naturalWidth = mediaElement.videoWidth;
      naturalHeight = mediaElement.videoHeight;
    } else {
      return;
    }

    if (naturalWidth && naturalHeight) {
      const figureWidth = figureElement.clientWidth;
      const expectedHeight = figureWidth * (naturalHeight / naturalWidth);
      const rowSpan = Math.ceil(expectedHeight / gridAutoRowsUnit) + 1;

      figureElement.style.gridRowEnd = `span ${rowSpan > 0 ? rowSpan : 1}`;
    }
  };

  // Function to open the modal
  const openModal = (item) => {
    setSelectedMedia(item);
    setModalOpen(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setModalOpen(false);
    setSelectedMedia(null);
  };

  return (
    <div className="gallery-container">
      <aside className="Gallery-sidebar">
        <h2>Gallery Info</h2>
        <p>Explore our beautiful collection of pools and videos.</p>
      </aside>

      <main className="Gallery-main">
        <h1>Photo Gallery</h1>
        <div className="gallery">
          {mediaItems.map((item) => (
            // Add onClick handler to the figure element
            <figure key={item.id} onClick={() => openModal(item)}>
              {item.type === "image" ? (
                <img
                  src={item.src}
                  alt={item.alt}
                  loading="lazy"
                  onLoad={handleMediaLoad}
                />
              ) : (
                <video
                  src={item.src}
                  alt={item.alt}
                  loading="lazy"
                  onLoadedMetadata={handleMediaLoad}
                  autoPlay
                  loop
                  muted
                  playsInline
                  controls={false}
                />
              )}
              <figcaption>
                <h3>{item.title || item.alt}</h3>
                <p>{item.description || 'Click to view details.'}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </main>

      {/* The Modal Component */}
      {modalOpen && selectedMedia && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}> {/* Prevent clicks inside from closing */}
            <button className="modal-close-btn" onClick={closeModal}>&times;</button>
            {selectedMedia.type === "image" ? (
              <img src={selectedMedia.src} alt={selectedMedia.alt} className="modal-media" />
            ) : (
              <video
                src={selectedMedia.src}
                alt={selectedMedia.alt}
                className="modal-media"
                controls // Show controls in modal
                autoPlay // Autoplay when opened
                loop // Loop in modal
                muted={false} // Unmute in modal for user control
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