import React, { useEffect, useRef, useState } from "react";
import { LaserFlow } from "./LaserFlow";
import Image from "../../assets/grid.jpg";
import Navbar from "../../Components/navbar/Navbar";
import Dashboard from "./Dashboard";
import "./Home.css";
import TextEffect from "./motionText/TextEffect";
import PixelBlast from "./pixelEffect/PixelEffect";

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
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1024px)");
    const syncViewport = (event) => setIsMobileOrTablet(event.matches);
    syncViewport(mq);
    mq.addEventListener("change", syncViewport);
    return () => mq.removeEventListener("change", syncViewport);
  }, []);

  useEffect(() => {
    const el = revealImgRef.current;
    if (!el) return;
    const handleMove = ({ clientX, clientY }) => {
      el.style.setProperty("--mx", `${clientX}px`);
      el.style.setProperty("--my", `${clientY}px`);
    };
    window.addEventListener("pointermove", handleMove, { passive: true });
    return () => window.removeEventListener("pointermove", handleMove);
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        height: "auto",
        backgroundColor: "#000000ff",
        overflowX: "hidden",
      }}
      onMouseLeave={() => {
        if (revealImgRef.current) {
          revealImgRef.current.style.setProperty("--mx", "-9999px");
          revealImgRef.current.style.setProperty("--my", "-9999px");
        }
      }}
    >
      {isMobileOrTablet ? (
        <div
          style={{
            width: "100%",
            height: "100vh",
            position: "relative",
            zIndex: 0,
            overflow: "hidden",
            pointerEvents: "auto",
          }}
        >
          <PixelBlast
            variant="circle"
            pixelSize={6}
            color="#746c8fff"
            patternScale={3}
            patternDensity={1.2}
            pixelSizeJitter={0.5}
            enableRipples
            rippleSpeed={0.4}
            rippleThickness={0.12}
            rippleIntensityScale={1.5}
            liquid
            liquidStrength={0.12}
            liquidRadius={1.2}
            liquidWobbleSpeed={5}
            speed={0.6}
            edgeFade={0.25}
            className="mobile-pixelblast"
            style={{ width: "100%", height: "100%" }}
          />
        </div>
      ) : (
        <div
          className="laser-flow"
          style={{
            position: "relative",
            height: "100vh",
            inset: 0,
            zIndex: 0,
            pointerEvents: "none",
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
      )}

      <div className="text-effect">
        <TextEffect
          words="SUMO: Smart Unified Management Operator"
          className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl"
        />
      </div>

      <Navbar />

      <div style={{ position: "relative", zIndex: 1 }}>
        <Dashboard />
      </div>
    </div>
  );
};

export default Home;