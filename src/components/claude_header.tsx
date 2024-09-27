import React, { useState, useEffect, useRef } from 'react';
import { motion, Variants } from 'framer-motion';

interface AnimatedHeaderProps {
  text: string;
}

const AnimatedHeader: React.FC<AnimatedHeaderProps> = ({ text }) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.5 }
    );

    if (headerRef.current) {
      observer.observe(headerRef.current);
    }

    return () => {
      if (headerRef.current) {
        observer.unobserve(headerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true);
    }
  }, [isVisible]);

  const handleAnimationComplete = () => {
    setIsAnimating(false);
  };

  const triggerAnimation = () => {
    setIsAnimating(true);
  };

  const bridgeVariants: Variants = {
    hidden: { opacity: 1, pathLength: 1 },
    visible: { opacity: 0, pathLength: 0, transition: { duration: 2 } },
  };

  const textVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { delay: 1.5, duration: 1 } },
  };

  return (
    <div className="relative h-screen flex flex-col items-center justify-center bg-gray-100">
      <div ref={headerRef} className="text-center">
        <motion.svg
          width="400"
          height="200"
          viewBox="0 0 400 200"
          initial="hidden"
          animate={isAnimating ? "visible" : "hidden"}
          onAnimationComplete={handleAnimationComplete}
        >
          <motion.path
            d="M20 140 C100 80 300 80 380 140 M100 140 L100 60 M300 140 L300 60 M0 140 L400 140"
            stroke="black"
            strokeWidth="4"
            fill="transparent"
            variants={bridgeVariants}
          />
          <motion.text
            x="200"
            y="100"
            textAnchor="middle"
            fontSize="32"
            fontWeight="bold"
            variants={textVariants}
          >
            {text}
          </motion.text>
        </motion.svg>
      </div>
      <button
        onClick={triggerAnimation}
        className="mt-8 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
      >
        Trigger Animation
      </button>
    </div>
  );
};

export default AnimatedHeader;