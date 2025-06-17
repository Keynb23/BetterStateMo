import { useMedia } from "../context/MediaContext";
import { useEffect, useRef } from "react";
import './ComponentStyles.css'

import Masonry from "masonry-layout";

const gridItems = [
  [],
  ["grid-item--width2", "grid-item--height2"],
  ["grid-item--height3"],
  ["grid-item--height2"],
  ["grid-item--width3"],
  [],
  [],
  ["grid-item--height2"],
  ["grid-item--width2", "grid-item--height3"],
  [],
  ["grid-item--height2"],
  [],
  ["grid-item--width2", "grid-item--height2"],
  ["grid-item--width2"],
  [],
  ["grid-item--height2"],
  [],
  [],
  ["grid-item--height3"],
  ["grid-item--height2"],
  [],
  [],
  ["grid-item--height2"],
];

export default function Gallery() {
  const { videos, pools } = useMedia();
  const gridRef = useRef(null);

  // Compose a single array of all media: pools followed by videos
  const mediaItems = [
    ...pools.map((src, idx) => ({ type: "image", src, key: `pool-${idx}` })),
    ...videos.map((src, idx) => ({ type: "video", src, key: `video-${idx}` })),
  ];

  useEffect(() => {
    if (gridRef.current) {
      new Masonry(gridRef.current, {
        itemSelector: ".grid-item",
        columnWidth: 160,
      });
    }
  }, []);

  return (
    <div className="Gallery">
      <h1>Gallery</h1>
      <div className="grid" ref={gridRef}>
        {gridItems.map((extraClasses, i) => {
          // Select the media for this grid cell, looping if not enough media
          const media = mediaItems[i % mediaItems.length];

          return (
            <div key={i} className={["grid-item", ...extraClasses].join(" ")}>
              {media?.type === "image" ? (
                <img
                  src={media.src}
                  alt={`Pool ${i + 1}`}
                  style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 5 }}
                  draggable={false}
                />
              ) : media?.type === "video" ? (
                <video
                  src={media.src}
                  style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 5 }}
                  autoPlay
                  loop
                  muted
                  playsInline
                  controls={false}
                />
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}