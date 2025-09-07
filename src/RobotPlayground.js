import React, { forwardRef, useEffect, useRef } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";

const RobotPlayground = forwardRef((props, ref) => {
  const group = useRef();
  const { scene, animations } = useGLTF("/robot_playground.glb");
  const { actions, names } = useAnimations(animations, group);

  // Play animations when component mounts
  useEffect(() => {
    if (names.length > 0) {
      console.log("🎮 Robot Playground available animations:", names);

      // Play the first animation if available
      const firstAnimation = names[0];
      if (actions[firstAnimation]) {
        actions[firstAnimation].reset().fadeIn(0.5).play();
        console.log(`🎬 Playing Robot Playground animation: ${firstAnimation}`);
      }

      // If there are multiple animations, you can play them all or specific ones
      names.forEach((name) => {
        if (actions[name]) {
          actions[name].reset().fadeIn(0.5).play();
        }
      });
    } else {
      console.log("⚠️ No animations found in the Robot Playground model");
    }
  }, [actions, names]);

  return (
    <group ref={group} {...props}>
      <primitive ref={ref} object={scene} />
    </group>
  );
});

// Preload the model for better performance
useGLTF.preload("/robot_playground.glb");

export default RobotPlayground;
