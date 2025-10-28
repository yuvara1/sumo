"use client";

import { useEffect } from "react";
import { motion, stagger, useAnimate } from "motion/react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import React from "react";
import '../Home.css';
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const TextGenerateEffect = ({
  words,
  className,
  filter = true,
  duration = 2,
}) => {
  const [scope, animate] = useAnimate();
  const wordsArray = words.split(" ");

  useEffect(() => {
    if (!scope.current) return;

    animate(
      "span",
      {
        opacity: 1,
        filter: filter ? "blur(0px)" : "none",
      },
      {
        duration: duration ?? 1,
        delay: stagger(0.2),
      }
    );
  }, [animate, filter, duration, words]);

  const renderWords = () => (
    <motion.div ref={scope} >
      {wordsArray.map((word, idx) => (
        <motion.span
          key={`${word}-${idx}`}
          className="text-black opacity-0 dark:text-white"
          style={{
            filter: filter ? "blur(10px)" : "none",
          }}
        >
          {word}{" "}
        </motion.span>
      ))}
    </motion.div>
  );

  return (
    <div className={cn("text-effect__wrapper font-bold", className)}>
      <div className="text-effect__line">
        {renderWords()}
      </div>
    </div>
  );
};

export default TextGenerateEffect;
