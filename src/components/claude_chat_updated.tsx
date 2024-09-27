import React, { useState } from 'react';
import { motion, Variants } from 'framer-motion';

const letters = 'INFRA.struktur'.split('');

const AnimatedHeader: React.FC = () => {
  const [isBridge, setIsBridge] = useState<boolean>(true); // Start with the bridge state

  const animationDuration = 1; // Variable to set the speed of the animation (in seconds)

  const letterSpacing = 30; // Adjust letter spacing as needed
  const svgWidth = 600; // Width of the SVG canvas
  const svgHeight = 150; // Height of the SVG canvas

  const contentWidth = (letters.length - 1) * letterSpacing; // Total width of the text
  const baseX = (svgWidth - contentWidth) / 2; // Center the text horizontally

  const baseY = 80; // Adjusted to fit within the new SVG height
  const letterHeight = 32; // Approximate height of the letters

  const pillarModifier = 20; // Adjusts the pillar top position
  const streetY = baseY + 10; // Position of the street line (adjusted)
  const maxArchHeight = 40; // Maximum height of the arch (adjusted)
  const extraPillarHeight = 40; // Extra height for pillars to extend below the street (adjusted)
  const pylonWidth = 10; // Width of the pylons
  const pylonHeight = 20; // Height of the pylons below the street (adjusted)

  // Calculate positions
  const normalPositions = letters.map((_, index) => ({
    x: baseX + index * letterSpacing,
    y: baseY,
  }));

  const bridgePositions = letters.map((_, index) => {
    const x = baseX + index * letterSpacing;
    let y = baseY;

    if (index !== 4 && index !== 9) {
      // Forming the arch (cables) with letters
      const distanceFromPillar = Math.min(
        Math.abs(index - 4),
        Math.abs(index - 9)
      );
      const archHeight = maxArchHeight - distanceFromPillar * 8; // Adjusted for new maxArchHeight
      y = baseY - archHeight;
    }
    return { x, y };
  });

  // Variants for letters
  const letterVariants: Variants = {
    normal: (index: number) => ({
      x: normalPositions[index].x,
      y: normalPositions[index].y,
      scaleY: 1,
      transition: { duration: animationDuration, ease: 'easeInOut' },
    }),
    bridge: (index: number) => {
      const isPillarA = index === 4; // 'A'
      const isPillarU = index === 9; // 'u'
      if (isPillarA || isPillarU) {
        // For pillars
        const x = bridgePositions[index].x;
        const pillarTopY = baseY - maxArchHeight + pillarModifier; // Align top with arch
        const pillarBottomY = streetY + extraPillarHeight; // Extend below street
        const pillarHeight = pillarBottomY - pillarTopY;

        // No adjustment needed for 'u' in this setup
        const scaleY = pillarHeight / letterHeight;

        return {
          x,
          y: pillarTopY,
          scaleY,
          transition: { duration: animationDuration, ease: 'easeInOut' },
        };
      } else {
        // For arch letters
        return {
          x: bridgePositions[index].x,
          y: bridgePositions[index].y,
          scaleY: 1,
          transition: { duration: animationDuration, ease: 'easeInOut' },
        };
      }
    },
  };

  // Variants for street line and pylons
  const streetVariants: Variants = {
    normal: {
      opacity: 0,
      transition: { duration: animationDuration, ease: 'easeInOut' },
    },
    bridge: {
      opacity: 1,
      transition: { duration: animationDuration, ease: 'easeInOut' },
    },
  };

  // Toggle animation
  const triggerAnimation = () => {
    setIsBridge((prev) => !prev);
  };

  return (
    <div className="relative flex flex-col items-center justify-center bg-gray-100">
      <svg
        width="100%"
        height={svgHeight}
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Street line */}
        <motion.line
          x1={baseX - letterSpacing / 2}
          y1={streetY}
          x2={baseX + contentWidth + letterSpacing / 2}
          y2={streetY}
          stroke="black"
          strokeWidth="4"
          variants={streetVariants}
          initial="bridge" // Start with the bridge state
          animate={isBridge ? 'bridge' : 'normal'}
        />
        {/* Bridge pylons */}
        {['A', 'u'].map((pillarLetter, i) => {
          const index = pillarLetter === 'A' ? 4 : 9;
          const x = bridgePositions[index].x - pylonWidth / 2;
          const y = streetY; // Adjusted to touch the street
          return (
            <motion.rect
              key={`pylon-${i}`}
              x={x}
              y={y}
              width={pylonWidth}
              height={pylonHeight}
              fill="black"
              variants={streetVariants}
              initial="bridge"
              animate={isBridge ? 'bridge' : 'normal'}
              transition={{ duration: animationDuration, ease: 'easeInOut' }}
            />
          );
        })}
        {/* Letters */}
        {letters.map((letter, index) => (
          <motion.text
            key={index}
            variants={letterVariants}
            custom={index}
            initial="bridge" // Start with the bridge state
            animate={isBridge ? 'bridge' : 'normal'}
            style={{ transformOrigin: 'center top' }} // Scale from the top
            fontSize="24" // Adjusted font size for better fit
            fontWeight="bold"
            textAnchor="middle"
          >
            {letter}
          </motion.text>
        ))}
      </svg>
      <button
        onClick={triggerAnimation}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
      >
        Trigger Animation
      </button>
    </div>
  );
};

export default AnimatedHeader;