import { useState } from "react";

const HamburgerBtn = () => {
  const [isActive, setIsActive] = useState(false);

  const toggleHamburger = () => {
    setIsActive(prev => !prev);
  };

  // 🔧 Updated styles for bars
  const lineStyle = {
    width: "35px",
    height: "4px",
    backgroundColor: "var(--usa-white)", // 🧼 Used your USA theme color
    transition: "all 0.3s ease-in-out",
    borderRadius: "4px",
  };

  return (
    <div
      style={{
        width: "50px",
        height: "50px",
        position: "relative",
        cursor: "pointer",
        display: "flex",               // ✅ Added for centering
        justifyContent: "center",     // ✅ Horizontal center
        alignItems: "center",         // ✅ Vertical center
      }}
      onClick={toggleHamburger}
    >
      {/* Bars */}
      <div
        style={{
          ...lineStyle,
          position: "absolute",
          top: isActive ? "22px" : "14px",
          transform: isActive ? "rotate(45deg)" : "none",
        }}
      />
      <div
        style={{
          ...lineStyle,
          position: "absolute",
          top: "22px",
          opacity: isActive ? 0 : 1,
        }}
      />
      <div
        style={{
          ...lineStyle,
          position: "absolute",
          top: isActive ? "22px" : "30px",
          transform: isActive ? "rotate(-45deg)" : "none",
        }}
      />

      {/* Circle ring */}
      <div
        style={{
          position: "absolute",
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          border: isActive
            ? "3px solid var(--sky-blue)"
            : "3px solid var(--usa-white)", // ✅ Styled to match USA theme
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
