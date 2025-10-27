"use client";
import React, { useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import { cn } from "./utils";
import { Tent } from "lucide-react";
import { Cog } from "lucide-react";
import { BellDot, User, Database } from "lucide-react";
import { Link } from "react-router-dom"; // Use Link for client-side routing

const defaultNavItems = [
  {
    name: "Home",
    link: "/",
    icon: <BellDot className="h-5 w-5" />,
  },
  {
    name: "Classification",
    link: "/classification",
    icon: <Cog className="h-5 w-5" />,
  },
  {
    name: "Data",
    link: "/data",
    icon: <Database className="h-5 w-5" />,
  },
];

export const Navbar = ({ navItems = defaultNavItems, className }) => {
  const { scrollYProgress } = useScroll();
  const [visible, setVisible] = useState(true);
  const [hoveredIndex, setHoveredIndex] = useState(null); // State to track hovered item

  useMotionValueEvent(scrollYProgress, "change", (current) => {
    if (typeof current === "number") {
      const direction = current - scrollYProgress.getPrevious();
      const threshold = 0.05;

      if (current < threshold) {
        setVisible(true);
      } else {
        setVisible(direction < 0);
      }
    }
  });

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{
          opacity: 1,
          y: 0,
        }}
        animate={{
          y: visible ? 0 : -100,
          opacity: visible ? 1 : 0,
        }}
        transition={{
          duration: 0.3,
          ease: "easeInOut",
        }}
        className={cn(
          "flex w-[80%] fixed top-6 inset-x-0 mx-auto border border-white/[0.2] rounded-full bg-black/30 backdrop-blur-xl backdrop-saturate-150 shadow-lg z-50 px-6 py-3 items-center justify-between",
          className
        )}
      >
        <Tent className="w-6 h-6 text-white/90" />
        <div className="flex items-center gap-6">
          <nav className="flex items-center gap-4">
            {navItems.map((navItem, idx) => (
              <Link
                key={`nav-item-${idx}`}
                to={navItem.link}
                className="relative p-2 rounded-full text-white/80 hover:text-white transition-colors duration-300"
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <AnimatePresence>
                  {hoveredIndex === idx && (
                    <motion.span
                      className="absolute inset-0 rounded-full bg-white/10"
                      layoutId="hoverBackground" // This creates the magic sliding effect
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1, transition: { duration: 0.15 } }}
                      exit={{
                        opacity: 0,
                        transition: { duration: 0.15, delay: 0.2 },
                      }}
                    />
                  )}
                </AnimatePresence>
                <span className="relative z-10">{navItem.icon}</span>
              </Link>
            ))}
          </nav>
          <button className="relative px-4 py-2 text-sm font-medium text-white border border-white/[0.2] rounded-full hover:bg-white/10 transition-all duration-200 group">
            <User />
            <span className="absolute inset-x-0 mx-auto -bottom-px h-px w-4/5 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Navbar;
