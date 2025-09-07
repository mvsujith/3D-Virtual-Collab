import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const GamingClickEffect = ({ onClickEffect, children, ...props }) => {
  const [effects, setEffects] = useState([]);

  const createEffect = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const newEffect = {
      id: Date.now() + Math.random(),
      x,
      y,
    };

    setEffects((prev) => [...prev, newEffect]);

    // Remove effect after animation
    setTimeout(() => {
      setEffects((prev) => prev.filter((effect) => effect.id !== newEffect.id));
    }, 800);

    // Call the original click handler
    if (onClickEffect) {
      onClickEffect(event);
    }
  };

  return (
    <div className="relative overflow-hidden" onClick={createEffect} {...props}>
      {children}

      <AnimatePresence>
        {effects.map((effect) => (
          <div key={effect.id} className="absolute pointer-events-none">
            {/* Ripple Effect */}
            <motion.div
              className="absolute w-4 h-4 border-2 border-blue-400 rounded-full"
              style={{
                left: effect.x - 8,
                top: effect.y - 8,
              }}
              initial={{ scale: 0, opacity: 1 }}
              animate={{ scale: 8, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />

            {/* Burst Effect */}
            <motion.div
              className="absolute w-2 h-2 bg-blue-400 rounded-full"
              style={{
                left: effect.x - 4,
                top: effect.y - 4,
              }}
              initial={{ scale: 0, opacity: 0.8 }}
              animate={{ scale: 4, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />

            {/* Racing-style sparks */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full"
                style={{
                  left: effect.x,
                  top: effect.y,
                }}
                initial={{
                  scale: 0,
                  x: 0,
                  y: 0,
                  opacity: 1,
                }}
                animate={{
                  scale: [0, 1, 0],
                  x: Math.cos((i * 60 * Math.PI) / 180) * 40,
                  y: Math.sin((i * 60 * Math.PI) / 180) * 40,
                  opacity: [1, 1, 0],
                }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 0.6,
                  ease: "easeOut",
                  delay: i * 0.05,
                }}
              />
            ))}
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default GamingClickEffect;
