import React, { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useGLTF, useAnimations } from "@react-three/drei";
import * as THREE from "three";
import { CharacterControls } from "./characterControls";
import { KeyDisplay } from "./utils";

const WalkingCharacter = ({
  orbitControlsRef,
  onSoldierRef,
  collisionZones = [],
  onCollision = null,
}) => {
  const characterRef = useRef();
  const { scene, animations } = useGLTF("/Soldier.glb");
  const { actions, mixer } = useAnimations(animations, characterRef);
  const { camera } = useThree();

  // Character controls
  const characterControls = useRef(null);
  const keyDisplay = useRef(null);
  const keysPressed = useRef({});
  const clock = useRef(new THREE.Clock()); // Expose the character ref to parent component
  useEffect(() => {
    if (scene && onSoldierRef) {
      console.log("🎯 Setting soldier reference to scene object");
      onSoldierRef(scene);
    }
  }, [scene, onSoldierRef]);

  // Setup model material and shadows
  useEffect(() => {
    if (scene) {
      scene.traverse((object) => {
        if (object.isMesh) {
          object.castShadow = true;
          object.receiveShadow = true;
        }
      });
    }
  }, [scene]);

  // Initialize character controls when everything is loaded
  useEffect(() => {
    if (scene && mixer && actions && orbitControlsRef.current && camera) {
      // Create animations map
      const animationsMap = new Map();

      // Filter out T-Pose and map animations
      const gltfAnimations = animations.filter((a) => a.name !== "TPose");
      gltfAnimations.forEach((clip) => {
        const action = mixer.clipAction(clip);
        animationsMap.set(clip.name, action);
      }); // Create character controls
      characterControls.current = new CharacterControls(
        scene,
        mixer,
        animationsMap,
        orbitControlsRef.current,
        camera,
        "Idle",
        collisionZones,
        onCollision
      );

      // Create key display
      keyDisplay.current = new KeyDisplay();

      console.log(
        "Character controls initialized with animations:",
        Array.from(animationsMap.keys())
      );
    }

    return () => {
      if (keyDisplay.current) {
        keyDisplay.current.destroy();
      }
    };
  }, [
    scene,
    mixer,
    actions,
    orbitControlsRef,
    camera,
    animations,
    collisionZones,
    onCollision,
  ]);

  // Update collision zones when they change
  useEffect(() => {
    if (characterControls.current && collisionZones) {
      characterControls.current.updateCollisionZones(collisionZones);
    }
  }, [collisionZones]);

  // Keyboard event handlers
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (keyDisplay.current) {
        keyDisplay.current.down(event.key);
      }

      if (event.shiftKey && characterControls.current) {
        characterControls.current.switchRunToggle();
      } else {
        keysPressed.current[event.key.toLowerCase()] = true;
      }
    };

    const handleKeyUp = (event) => {
      if (keyDisplay.current) {
        keyDisplay.current.up(event.key);
      }
      keysPressed.current[event.key.toLowerCase()] = false;
    };

    const handleResize = () => {
      if (keyDisplay.current) {
        keyDisplay.current.updatePosition();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);
    window.addEventListener("resize", handleResize);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Animation frame logic
  useFrame(() => {
    if (characterControls.current) {
      const delta = clock.current.getDelta();
      characterControls.current.update(delta, keysPressed.current);
    }
  });
  return (
    <group ref={characterRef} position={[0, 0, 0]}>
      <primitive object={scene} />
    </group>
  );
};

// Preload the model
useGLTF.preload("/Soldier.glb");

export default WalkingCharacter;
