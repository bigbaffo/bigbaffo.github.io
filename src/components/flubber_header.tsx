import React, { useState, useRef, useEffect } from 'react';
import { interpolate } from 'flubber';

const HeaderComponent: React.FC = () => {
  const [isMorphed, setIsMorphed] = useState<boolean>(false);
  const pathRef = useRef<SVGPathElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);

  // Replace with your actual SVG path data
  const bridgePath: string = 'M...'; // Your bridge path
  const textPath: string = 'M...'; // Your text path

  useEffect(() => {
    // Intersection Observer to detect when the header scrolls into view
    const observerOptions: IntersectionObserverInit = {
      root: null,
      rootMargin: '0px',
      threshold: 0.5,
    };

    const handleIntersection: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !isMorphed) {
          startMorph();
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, observerOptions);

    if (headerRef.current) {
      observer.observe(headerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [isMorphed]);

  const startMorph = () => {
    const fromPath = isMorphed ? textPath : bridgePath;
    const toPath = isMorphed ? bridgePath : textPath;

    const interpolator = interpolate(fromPath, toPath, { maxSegmentLength: 2 });

    let frame = 0;
    const totalFrames = 60;

    const animate = () => {
      const t = frame / totalFrames;
      const d = interpolator(t);
      if (pathRef.current) {
        pathRef.current.setAttribute('d', d);
      }
      frame++;
      if (frame <= totalFrames) {
        requestAnimationFrame(animate);
      } else {
        setIsMorphed(!isMorphed);
      }
    };

    animate();
  };

  const handleButtonClick = () => {
    startMorph();
  };

  return (
    <div ref={headerRef}>
      <svg width="400" height="100">
        <path
          ref={pathRef}
          d={isMorphed ? textPath : bridgePath}
          fill="none"
          stroke="black"
          strokeWidth="2"
        />
      </svg>
      <button onClick={handleButtonClick}>Trigger Animation</button>
    </div>
  );
};

export default HeaderComponent;
