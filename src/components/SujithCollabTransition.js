import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SujithCollabTransition = ({ isVisible, onComplete }) => {
  const [currentPhase, setCurrentPhase] = useState("entering");

  useEffect(() => {
    if (isVisible) {
      setCurrentPhase("entering");

      const showTextTimer = setTimeout(() => {
        setCurrentPhase("showing");
      }, 500);

      const exitTimer = setTimeout(() => {
        setCurrentPhase("exiting");
      }, 2500);

      const completeTimer = setTimeout(() => {
        if (onComplete) {
          onComplete();
        }
      }, 3500);

      return () => {
        clearTimeout(showTextTimer);
        clearTimeout(exitTimer);
        clearTimeout(completeTimer);
      };
    }
  }, [isVisible, onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="absolute inset-0 opacity-10">
            <div
              className="w-full h-full"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(59, 130, 246, 0.3) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(59, 130, 246, 0.3) 1px, transparent 1px)
                `,
                backgroundSize: "50px 50px",
                animation: "gridMove 2s linear infinite",
              }}
            />
          </div>

          <div className="relative z-10">
            <AnimatePresence>
              {currentPhase !== "entering" && (
                <motion.div
                  className="text-center"
                  initial={{ scale: 0.5, opacity: 0, rotateX: -90 }}
                  animate={{
                    scale: currentPhase === "exiting" ? 1.2 : 1,
                    opacity: currentPhase === "exiting" ? 0 : 1,
                    rotateX: 0,
                  }}
                  exit={{ scale: 1.2, opacity: 0, rotateX: 90 }}
                  transition={{
                    duration: currentPhase === "exiting" ? 1 : 0.8,
                    ease: "easeOut",
                    type: "spring",
                    stiffness: 100,
                  }}
                >
                  <h1 className="text-8xl md:text-9xl font-bold text-white mb-4 tracking-wider">
                    <span
                      className="inline-block bg-gradient-to-r from-blue-400 via-purple-500 to-blue-600 bg-clip-text text-transparent"
                      style={{
                        textShadow: "0 0 40px rgba(59, 130, 246, 0.8)",
                        filter: "drop-shadow(0 0 20px rgba(59, 130, 246, 0.6))",
                      }}
                    >
                      Sujith Collab
                    </span>
                  </h1>

                  <motion.div
                    className="h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent mx-auto"
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
                  />

                  <motion.p
                    className="text-xl text-blue-300 mt-6 font-light tracking-wide"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1, duration: 0.8 }}
                  >
                    ENTERING THE GRID
                  </motion.p>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="absolute inset-0 pointer-events-none">
              <motion.div
                className="absolute top-0 left-0 w-32 h-32 border-l-4 border-t-4 border-blue-500"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              />

              <motion.div
                className="absolute top-0 right-0 w-32 h-32 border-r-4 border-t-4 border-blue-500"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
              />

              <motion.div
                className="absolute bottom-0 left-0 w-32 h-32 border-l-4 border-b-4 border-blue-500"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              />

              <motion.div
                className="absolute bottom-0 right-0 w-32 h-32 border-r-4 border-b-4 border-blue-500"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.8 }}
              />
            </div>
          </div>

          <style jsx>{`
            @keyframes gridMove {
              0% {
                transform: translate(0, 0);
              }
              100% {
                transform: translate(50px, 50px);
              }
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SujithCollabTransition;
