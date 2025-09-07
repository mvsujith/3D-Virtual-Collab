import React, { forwardRef, useEffect, useRef } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";

const AbandonedCar = forwardRef((props, ref) => {
  const group = useRef();
  const { scene, animations } = useGLTF("/obot_-_cute_robot_challenge.glb");
  const { actions, names } = useAnimations(animations, group);

  // Play animations when component mounts
  useEffect(() => {
    if (names.length > 0) {
      console.log("🤖 Available animations:", names);

      // Play the first animation if available
      const firstAnimation = names[0];
      if (actions[firstAnimation]) {
        actions[firstAnimation].reset().fadeIn(0.5).play();
        console.log(`🎬 Playing animation: ${firstAnimation}`);
      }

      // If there are multiple animations, you can play them all or specific ones
      // Example: Play all animations
      names.forEach((name) => {
        if (actions[name]) {
          actions[name].reset().fadeIn(0.5).play();
        }
      });
    } else {
      console.log("⚠️ No animations found in the model");
    }
  }, [actions, names]);

  return (
    <group ref={group} {...props}>
      <primitive ref={ref} object={scene} />
    </group>
  );
});

// Preload the model for better performance
useGLTF.preload("/obot_-_cute_robot_challenge.glb");

export default AbandonedCar;
