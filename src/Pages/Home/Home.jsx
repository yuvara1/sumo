import React from "react";
import { useRef } from "react";
import { LaserFlow } from "./LaserFlow";
import Image from "../../assets/grid.jpg";
import Navbar from "../../Components/navbar/Navbar";
import Dashboard from "./Dashboard";

export const Home = () => {
  const COLORS = {
    primary: "#4d108eff",
    secondary: "#BD93F9",
    accent: "#8BE9FD",
    background: "#282A36",
    surface: "#44475A",
    text: "#F8F8F2",
  };

  const revealImgRef = useRef(null);

  return (
    <div
      style={{
        minHeight: "1300px",
        height: "auto",
        // position: "relative",
        backgroundColor: "#000000ff",
        overflowX: "hidden", // Allow vertical scrolling
      }}
      onMouseMove={(e) => {
        // Use clientX/Y and add scrollY for correct positioning
        const x = e.clientX;
        const y = e.clientY + window.scrollY;
        if (revealImgRef.current) {
          revealImgRef.current.style.setProperty("--mx", `${x}px`);
          revealImgRef.current.style.setProperty("--my", `${y}px`);
        }
      }}
      onMouseLeave={() => {
        if (revealImgRef.current) {
          revealImgRef.current.style.setProperty("--mx", "-9999px");
          revealImgRef.current.style.setProperty("--my", "-9999px");
        }
      }}
    >
      {/* Layer 1: Fixed Background Effects */}
      <div
        style={{
          position: "relative",
          height: "100vh",
          inset: 0,
          zIndex: 0, // Lowest layer
          pointerEvents: "none", // Allow clicks to pass through
        }}
      >
        <LaserFlow
          horizontalBeamOffset={0.1}
          verticalBeamOffset={0}
          wispDensity={1.2}
          mouseTiltStrength={0.015}
          flowSpeed={0.35}
          fogIntensity={0.5}
          wispSpeed={12}
          color={COLORS.primary}
          style={{ height: "200vh" }}
        />
      </div>

      {/* Layer 2: Floating Navbar */}
      <Navbar />

      {/* Layer 3: Scrollable Content */}
      <div style={{ position: "relative", zIndex: 1 }}>
        <Dashboard />
      </div>
    </div>
  );
};

export default Home;
