import React, { useEffect, useRef } from "react";
import { LaserFlow } from "./LaserFlow";
import Image from "../../assets/grid.jpg";
import Navbar from "../../Components/navbar/Navbar";
import Dashboard from "./Dashboard";

export const Home = () => {
  const revealImgRef = useRef(null);

  useEffect(() => {
    const el = revealImgRef.current;
    if (!el) return;

    const handlePointerMove = (ev) => {
      el.style.setProperty("--cursor-x", `${ev.clientX}px`);
      el.style.setProperty("--cursor-y", `${ev.clientY}px`);
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, []);

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
        <div ref={revealImgRef} className="reveal-image" />

        <LaserFlow
          horizontalBeamOffset={0.1}
          verticalBeamOffset={0}
          wispDensity={1.2}
          mouseTiltStrength={0.015}
          flowSpeed={0.35}
          fogIntensity={0.5}
          wispSpeed={12}
          color={"#8b00ff"}
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