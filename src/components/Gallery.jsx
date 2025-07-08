import { useState, useEffect, useRef } from 'react';
import { useMedia } from '../context/MediaContext';
import './ComponentStyles.css';

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
  const mediaRef = useRef(null); // Ref for the modal media (video/image)

  const [isMuted, setIsMuted] = useState(true); // Start muted by default as per common practice for autoplay videos
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 768); // New state to track desktop view

  const [lastScrollY, setLastScrollY] = useState(0);

  const shuffleArray = (array) => {
    let currentIndex = array.length,
      randomIndex;
    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
  };

  // Effect to update isDesktop on window resize
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth > 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
    setIsMuted(true); // Ensure video starts muted when opened

    setLastScrollY(window.scrollY);
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
    setIsMuted(true); // Reset mute state when closing modal

    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    window.scrollTo(0, lastScrollY);
  };

  const handleToggleMute = () => {
    if (mediaRef.current && selectedMedia.type === 'video') {
      mediaRef.current.muted = !mediaRef.current.muted;
      setIsMuted(mediaRef.current.muted);
    }
  };

  // Only handle touch events on non-desktop (mobile/tablet)
  const handleTouchStart = (e) => {
    if (isDesktop) return; // Only apply touch logic if not desktop

    if (e.touches.length === 2) {
      setIsZoomed(true);
    } else if (e.touches.length === 1) {
      setTouchStartX(e.touches[0].clientX);
      setTouchStartY(e.touches[0].clientY);
    }
  };

  const handleTouchMove = (e) => {
    if (isDesktop) return; // Only apply touch logic if not desktop
    if (isZoomed) return;
    if (modalOpen) {
      e.preventDefault();
    }
  };

  const handleTouchEnd = (e) => {
    if (isDesktop) return; // Only apply touch logic if not desktop

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

    const isTap = Math.abs(deltaX) < 10 && Math.abs(deltaY) < 10;

    if (isTap) {
      if (selectedMedia.type === 'video') {
        handleToggleMute();
      }
    } else if (Math.abs(deltaY) > Math.abs(deltaX) && deltaY < -50) {
      closeModal();
    } else if (Math.abs(deltaX) > 50) {
      const direction = deltaX > 0 ? 1 : -1;
      const nextIndex =
        (currentIndex + direction + shuffledMediaItems.length) % shuffledMediaItems.length;
      setCurrentIndex(nextIndex);
      setSelectedMedia(shuffledMediaItems[nextIndex]);
    }

    setTouchStartX(null);
    setTouchStartY(null);
  };

  useEffect(() => {
    if (modalOpen && modalRef.current) {
      const modal = modalRef.current;
      // Only add touch event listeners if not desktop
      if (!isDesktop) {
        modal.addEventListener('touchstart', handleTouchStart, { passive: false });
        modal.addEventListener('touchmove', handleTouchMove, { passive: false });
        modal.addEventListener('touchend', handleTouchEnd);
      }

      return () => {
        if (!isDesktop) {
          modal.removeEventListener('touchstart', handleTouchStart);
          modal.removeEventListener('touchmove', handleTouchMove);
          modal.removeEventListener('touchend', handleTouchEnd);
        }
      };
    }
  }, [
    touchStartX,
    touchStartY,
    currentIndex,
    modalOpen,
    shuffledMediaItems,
    isZoomed,
    selectedMedia,
    isDesktop,
  ]); // Add isDesktop to dependencies

  useEffect(() => {
    if (selectedMedia && selectedMedia.type === 'video' && mediaRef.current) {
      // On desktop, we want controls, so muted should be false initially if controls are present
      // On mobile, we manage mute with tap, so start muted.
      if (isDesktop) {
        mediaRef.current.muted = false; // Video starts unmuted on desktop with controls
        setIsMuted(false);
      } else {
        mediaRef.current.muted = true; // Video starts muted on mobile
        setIsMuted(true);
      }
    }
  }, [isMuted, selectedMedia, isDesktop]); // Add isDesktop to dependencies

  if (shuffledMediaItems.length === 0) {
    return (
      <div className="gallery-loading">
        <p>Loading gallery items or no items available...</p>
      </div>
    );
  }

  return (
    <>
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
                <img
                  src={selectedMedia.src}
                  alt={selectedMedia.alt}
                  className="modal-media"
                  ref={mediaRef}
                />
              ) : (
                <>
                  <video
                    src={selectedMedia.src}
                    alt={selectedMedia.alt}
                    className="modal-media"
                    autoPlay
                    loop
                    // Conditionally apply muted and controls based on isDesktop
                    muted={!isDesktop || isMuted} // Muted if mobile, or if desktop AND user muted it
                    playsInline
                    controls={isDesktop} // ONLY show native controls on desktop
                    ref={mediaRef}
                  />
                  {/* Conditionally render "tap to unmute" text only on mobile and when muted */}
                  {!isDesktop && isMuted && <p className="mute-vid-text">Tap to Unmute</p>}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Gallery;
