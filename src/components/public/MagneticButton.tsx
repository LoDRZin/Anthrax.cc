"use client";

import { useRef, useState, ReactNode } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  href?: string;
}

export default function MagneticButton({ children, className, href }: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Springs parameters to make it smooth and bouncy
  const springConfig = { damping: 15, stiffness: 150, mass: 0.1 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    
    // Calculate the distance. The further away from the center, the more it moves.
    const distanceX = clientX - centerX;
    const distanceY = clientY - centerY;
    
    // Magnetic pull strength (e.g. max 20px)
    x.set(distanceX * 0.2);
    y.set(distanceY * 0.2);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const content = (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      className={`relative cursor-pointer ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Liquid Shader / Glowing border simulation using CSS radial gradients tracked to mouse */}
      {isHovered && (
        <motion.div 
          className="absolute inset-0 pointer-events-none rounded-xl"
          style={{
            background: `radial-gradient(circle at center, rgba(255,255,255,0.15) 0%, transparent 60%)`,
            x: useSpring(x, { damping: 10, stiffness: 50 }),
            y: useSpring(y, { damping: 10, stiffness: 50 }),
          }}
        />
      )}
      {children}
    </motion.div>
  );

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className="block w-full">
        {content}
      </a>
    );
  }

  return content;
}
