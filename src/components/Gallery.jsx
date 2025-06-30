import { useState, useEffect, useRef } from 'react';
import { useMedia } from '../context/MediaContext';
import './ComponentStyles.css';
import ScrollToTop from './ScrollToTop';

const Gallery = () => {
  const { videos, pools } = useMedia();

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [shuffledMediaItems, setShuffledMediaItems] = useState([]);
  const [touchStartY, setTouchStartY] = useState(null);
  const [touchStartX, setTouchStartX] = useState(null);
  const [isZoomed, setIsZoomed] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const modalRef = useRef(null);
  const mediaRef = useRef(null);

  // New state to store the scroll position before modal opens
  const [lastScrollY, setLastScrollY] = useState(0);

  const shuffleArray = (array) => {
    let currentIndex = array.length, randomIndex;
    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
  };

  useEffect(() => {
    const combinedItems = [
      ...(pools || []).map((src, idx) => ({
        id: `pool-${idx}`,
        src,
        type: 'image',
        alt: `Pool image ${idx + 1}`,
      })),
      ...(videos || []).map((src, idx) => ({
        id: `video-${idx}`,
        src,
        type: 'video',
        alt: `Video thumbnail ${idx + 1}`,
      })),
    ];
    const shuffled = shuffleArray([...combinedItems]);
    setShuffledMediaItems(shuffled);
  }, [videos, pools]);

  const openModal = (item) => {
    const index = shuffledMediaItems.findIndex((i) => i.id === item.id);
    setSelectedMedia(item);
    setCurrentIndex(index);
    setModalOpen(true);

    // Save current scroll position
    setLastScrollY(window.scrollY);
    // Apply overflow hidden and fix position to prevent scroll jump
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${window.scrollY}px`;
    document.body.style.width = '100%';
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedMedia(null);
    setTouchStartY(null);
    setIsZoomed(false);

    // Restore original body styles and scroll position
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    window.scrollTo(0, lastScrollY);
  };

  const handleTouchStart = (e) => {
    if (window.innerWidth > 768) return;

    if (e.touches.length === 2) {
      setIsZoomed(true);
    } else if (e.touches.length === 1) {
      setTouchStartX(e.touches[0].clientX);
      setTouchStartY(e.touches[0].clientY);
    }
  };

  const handleTouchMove = (e) => {
    if (isZoomed) return;
    // Prevent default touchmove behavior (like scrolling) on the modal
    if (modalOpen) {
      e.preventDefault();
    }
  }

  const handleTouchEnd = (e) => {
    if (window.innerWidth > 768) return;

    if (isZoomed) {
      setIsZoomed(false);
      setTouchStartX(null);
      setTouchStartY(null);
      return;
    }

    if (touchStartX === null && touchStartY === null) return;

    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;

    const deltaX = touchStartX - touchEndX;
    const deltaY = touchStartY - touchEndY;

    // Handle swipe down to close
    // Check if the primary movement was vertical and downwards
    if (Math.abs(deltaY) > Math.abs(deltaX) && deltaY < -50) {
      closeModal();
    } else if (Math.abs(deltaX) > 50) {
      // Handle horizontal swipe for navigation
      const direction = deltaX > 0 ? 1 : -1;
      const nextIndex = (currentIndex + direction + shuffledMediaItems.length) % shuffledMediaItems.length;
      setCurrentIndex(nextIndex);
      setSelectedMedia(shuffledMediaItems[nextIndex]);
    }

    setTouchStartX(null);
    setTouchStartY(null);
  };

  useEffect(() => {
    if (modalOpen && modalRef.current) {
      const modal = modalRef.current;
      modal.addEventListener('touchstart', handleTouchStart, { passive: false });
      modal.addEventListener('touchmove', handleTouchMove, { passive: false });
      modal.addEventListener('touchend', handleTouchEnd);

      return () => {
        modal.removeEventListener('touchstart', handleTouchStart);
        modal.removeEventListener('touchmove', handleTouchMove);
        modal.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [touchStartX, touchStartY, currentIndex, modalOpen, shuffledMediaItems, isZoomed]);

  if (shuffledMediaItems.length === 0) {
    return (
      <div className="gallery-loading">
        <p>Loading gallery items or no items available...</p>
      </div>
    );
  }

  return (
    <>
      <ScrollToTop />
    <div className="gallery-container">
      <main className="Gallery-main">
        <h1 className="Gallery-title">Gallery</h1>
        <div className="gallery">
          {shuffledMediaItems.map((item) => (
            <div className="gallery-item" key={item.id} onClick={() => openModal(item)}>
              {item.type === 'image' ? (
                <img src={item.src} alt={item.alt} loading="lazy" />
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
          <div className="modal-content" ref={modalRef} onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={closeModal}>
              &times;
            </button>
            {selectedMedia.type === 'image' ? (
              <img src={selectedMedia.src} alt={selectedMedia.alt} className="modal-media" ref={mediaRef} />
            ) : (
              <video
                src={selectedMedia.src}
                alt={selectedMedia.alt}
                className="modal-media"
                controls
                autoPlay
                loop
                muted
                playsInline
                ref={mediaRef}
              />
            )}
          </div>
        </div>
      )}
    </div>
    </>
  );
};

export default Gallery;