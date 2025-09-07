import React, { useRef, useEffect, useState } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const SpaceStation = ({
  position = [0, 0, 0],
  scale = [1, 1, 1],
  enableMouseInteraction = true,
  ...props
}) => {
  const group = useRef();
  const { scene, animations } = useGLTF("/sci-fi_space_station.glb");
  const { actions } = useAnimations(animations, group);
  const { size } = useThree();
  // Mouse position tracking with useRef for performance
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  // Click and keyboard interaction states
  const [spacePressed, setSpacePressed] = useState(false);
  const [clickPosition, setClickPosition] = useState({ x: 0, y: 0 });
  const clickBoostRef = useRef(0);

  // Start animations if they exist
  useEffect(() => {
    if (actions && Object.keys(actions).length > 0) {
      Object.values(actions).forEach((action) => {
        action.play();
      });
    }
  }, [actions]);
  // Mouse movement handler
  useEffect(() => {
    if (!enableMouseInteraction) return;

    const handleMouseMove = (event) => {
      // Normalize mouse coordinates to -1 to 1 range
      const x = (event.clientX / size.width) * 2 - 1;
      const y = -(event.clientY / size.height) * 2 + 1;

      mouseRef.current.targetX = x;
      mouseRef.current.targetY = y;
    };
    const handleClick = (event) => {
      // Get click position for targeted effects
      const x = (event.clientX / size.width) * 2 - 1;
      const y = -(event.clientY / size.height) * 2 + 1;

      setClickPosition({ x, y });
      clickBoostRef.current = 1;
    };

    const handleKeyDown = (event) => {
      if (event.code === "Space") {
        event.preventDefault();
        setSpacePressed(true);
      }
    };

    const handleKeyUp = (event) => {
      if (event.code === "Space") {
        setSpacePressed(false);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("click", handleClick);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("click", handleClick);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [size, enableMouseInteraction]);
  // Animation frame with enhanced interactions
  useFrame((state) => {
    if (!group.current) return;

    // Decay click boost over time
    clickBoostRef.current = THREE.MathUtils.lerp(
      clickBoostRef.current,
      0,
      0.05
    );

    // Calculate dynamic speeds based on interactions
    const baseSpeed = 0.08;
    const clickMultiplier = 1 + clickBoostRef.current * 3; // 4x speed boost on click
    const spaceMultiplier = spacePressed ? 2 : 1; // 2x speed when space held
    const totalSpeed = baseSpeed * clickMultiplier * spaceMultiplier;

    // Enhanced mouse following with dynamic speed
    mouseRef.current.x = THREE.MathUtils.lerp(
      mouseRef.current.x,
      mouseRef.current.targetX,
      totalSpeed
    );
    mouseRef.current.y = THREE.MathUtils.lerp(
      mouseRef.current.y,
      mouseRef.current.targetY,
      totalSpeed
    );

    if (enableMouseInteraction) {
      // Base rotation multipliers
      const rotationBoost = 1 + clickBoostRef.current * 2; // Extra rotation on click
      const spaceRotationBoost = spacePressed ? 1.5 : 1; // Faster rotation with space

      // Apply enhanced mouse-based rotation with interaction boosts
      group.current.rotation.x = mouseRef.current.y * 0.25 * rotationBoost;
      group.current.rotation.y =
        state.clock.elapsedTime * 0.3 * spaceRotationBoost +
        mouseRef.current.x * 0.5 * rotationBoost;
      group.current.rotation.z = mouseRef.current.x * 0.15 * rotationBoost;

      // Enhanced position offset with click effects
      const positionBoost = 1 + clickBoostRef.current * 1.5; // More movement on click
      const clickInfluence =
        clickBoostRef.current > 0.1
          ? {
              x: clickPosition.x * 0.2 * clickBoostRef.current,
              y: clickPosition.y * 0.2 * clickBoostRef.current,
            }
          : { x: 0, y: 0 };

      group.current.position.x =
        position[0] +
        mouseRef.current.x * 0.6 * positionBoost +
        clickInfluence.x;
      group.current.position.y =
        position[1] +
        mouseRef.current.y * 0.4 * positionBoost +
        clickInfluence.y;
      group.current.position.z =
        position[2] +
        (spacePressed ? Math.sin(state.clock.elapsedTime * 2) * 0.2 : 0); // Space = floating effect
    } else {
      // Enhanced default rotation when mouse interaction is disabled
      const baseRotationSpeed = spacePressed ? 0.6 : 0.3;
      group.current.rotation.y = state.clock.elapsedTime * baseRotationSpeed;
      group.current.position.set(...position);
    }
  });

  return (
    <group ref={group} scale={scale} {...props}>
      <primitive object={scene.clone()} />
    </group>
  );
};

// Preload the model
useGLTF.preload("/sci-fi_space_station.glb");

export default SpaceStation;
