// Card with 3D mouse-tracking tilt effect
import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

export default function Card3D({ children, style, className = '', intensity = 8 }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotX = useSpring(useTransform(y, [-0.5, 0.5], [intensity, -intensity]), { stiffness: 200, damping: 25 });
  const rotY = useSpring(useTransform(x, [-0.5, 0.5], [-intensity, intensity]), { stiffness: 200, damping: 25 });
  const glare = useSpring(useTransform(x, [-0.5, 0.5], ['rgba(255,255,255,0)', 'rgba(255,255,255,0.03)']), { stiffness: 200, damping: 25 });

  const handleMouseMove = (e) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const handleMouseLeave = () => { x.set(0); y.set(0); };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX: rotX, rotateY: rotY, transformStyle: 'preserve-3d', perspective: 1000, ...style }}
      className={`card ${className}`}
    >
      <motion.div
        style={{ background: glare, position: 'absolute', inset: 0, borderRadius: 'inherit', pointerEvents: 'none', zIndex: 10 }}
      />
      {children}
    </motion.div>
  );
}
