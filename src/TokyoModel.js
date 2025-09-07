import React, { useRef, useEffect } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const TokyoModel = ({
  position = [0, 0, 0],
  scale = [1, 1, 1],
  animationSpeed = 0.5,
}) => {
  const groupRef = useRef();
  const { scene, animations } = useGLTF("/littlest_tokyo.glb");
  const { actions, mixer } = useAnimations(animations, groupRef);
  // Setup animations when component mounts
  useEffect(() => {
    console.log("LittlestTokyo.glb loaded:");
    console.log("- Scene:", scene);
    console.log("- Animations found:", animations.length);
    console.log(
      "- Animation names:",
      animations.map((clip) => clip.name)
    );

    // Common pitfall check: Verify animations exist
    if (animations.length === 0) {
      console.warn("⚠️ No animations found in LittlestTokyo.glb");
      return;
    }

    // Play all available animations using the actions object from useAnimations
    Object.keys(actions).forEach((name) => {
      console.log(`Playing animation: "${name}"`);

      const action = actions[name];

      // Configure animation settings
      action.setLoop(THREE.LoopRepeat); // Loop the animation
      action.clampWhenFinished = false; // Don't clamp at the end
      action.timeScale = animationSpeed; // Control the animation speed

      // Start playing
      action.play();
    });

    // Cleanup function
    return () => {
      if (mixer) {
        mixer.stopAllAction();
      }
    };
  }, [animations, mixer, scene, animationSpeed, actions]);

  // Update animations in render loop - CRITICAL for animations to work!
  useFrame((state, delta) => {
    if (mixer) {
      mixer.update(delta);
    }
  });

  return (
    <group ref={groupRef} position={position} scale={scale}>
      <primitive object={scene} castShadow receiveShadow />
    </group>
  );
};

// Preload the model for better performance
useGLTF.preload("/littlest_tokyo.glb");

export default TokyoModel;
