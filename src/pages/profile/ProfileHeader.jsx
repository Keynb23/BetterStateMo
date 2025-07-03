import './ProfileStyles.css';
import { useMedia } from '../../context/MediaContext';
import { useState, useEffect } from 'react';

const shuffleArray = (array) => {
    let currentIndex = array.length, randomIndex;
    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
  };

const ProfileHeader = ({ user, isOwner, handleStartNewRequest }) => {
  const { videos, pools } = useMedia();
  const [shuffledMediaItems, setShuffledMediaItems] = useState([]);

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

  return (
    <div className="Profile-Dashboard-Dashboard Profile-card-base">
      {shuffledMediaItems.map((item) => (
        <div className="dash-bg-item" key={item.id}>
          {item.type === 'image' ? (
            <img src={item.src} alt={item.alt}/>
          ) : (
            <video src={item.src} alt={item.alt} controls width="100%" />
          )}
        </div>
      ))}
            
      <h2 className="Profile-Dashboard-title">
        {isOwner ? 'Owner Dashboard' : 'My Dashboard'}
      </h2>
      <div className="Profile-Dashboard-card">
        <h3 className="Profile-Dashboard-subtitle">
          Welcome, {user.displayName || user.email}!
        </h3>
        <p className="Profile-Dashboard-text">
          {isOwner
            ? 'This is your administrative dashboard.'
            : '=====NOT DONE STYLING=======Here you can manage your appointments and profile settings.'}
        </p>
        {!isOwner && (
          <button onClick={handleStartNewRequest} className="Dashboard-newRequestBtn">
            Start a New Appointment/Quote Request
          </button>
        )}
      </div>
    </div>
  );
};

export default ProfileHeader;