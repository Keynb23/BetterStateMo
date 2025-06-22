import { useState } from "react";

const HamburgerBtn = () => {
  const [isActive, setIsActive] = useState(false);

  const toggleHamburger = () => {
    setIsActive((prev) => !prev);
  };

  // 🔧 Updated styles for bars
  const lineStyle = {
    width: "30px", // Slightly reduced for a cleaner look
    height: "3px", // Slimmer for a modern feel
    backgroundColor: "var(--text)", // Using a dark color for contrast on a light navbar
    transition: "all 0.3s ease-in-out",
    borderRadius: "3px",
  };

  return (
    <div
      style={{
        width: "50px",
        height: "50px",
        position: "relative",
        cursor: "pointer",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
      onClick={toggleHamburger}
    >
      {/* Bars */}
      <div
        style={{
          ...lineStyle,
          position: "absolute",
          top: isActive ? "23px" : "15px", // Adjusted positions for new height
          transform: isActive ? "rotate(45deg)" : "none",
        }}
      />
      <div
        style={{
          ...lineStyle,
          position: "absolute",
          top: "23px",
          opacity: isActive ? 0 : 1,
        }}
      />
      <div
        style={{
          ...lineStyle,
          position: "absolute",
          top: isActive ? "23px" : "31px", // Adjusted positions for new height
          transform: isActive ? "rotate(-45deg)" : "none",
        }}
      />

      {/* Circle ring, updated with the new color palette */}
      <div
        style={{
          position: "absolute",
          width: "50px", // Sized to fit the container
          height: "50px",
          borderRadius: "50%",
          border: isActive
            ? "2px solid var(--Service-Blue)" // Active state uses the main action color
            : "2px solid var(--Light-Steel)", // Default state is subtle
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          boxSizing: "border-box",
          transition: "all 0.3s ease-in-out",
        }}
      />
    </div>
  );
};

export default HamburgerBtn;
