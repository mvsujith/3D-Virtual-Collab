import React, { useRef, useState, useEffect } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

// A helper component to manage collision detection between character and multiple objects
const CharacterCollision = ({
  characterRef,
  obstacles = [], // Array of {ref, name, radius} objects
  onCollisionEnter,
  onCollisionExit,
}) => {
  const [collisions, setCollisions] = useState(new Set());
  const characterPosition = useRef(new THREE.Vector3());
  const previousCollisions = useRef(new Set());

  useFrame(() => {
    if (!characterRef.current) return;

    // Update character position
    characterPosition.current.copy(characterRef.current.position);

    const currentCollisions = new Set();

    // Check each obstacle
    obstacles.forEach((obstacle, index) => {
      if (!obstacle.ref.current) return;

      const obstaclePosition = new THREE.Vector3();
      obstaclePosition.copy(obstacle.ref.current.position);

      // Calculate distance between character and obstacle (ignoring y-axis height)
      const distance = Math.sqrt(
        Math.pow(characterPosition.current.x - obstaclePosition.x, 2) +
          Math.pow(characterPosition.current.z - obstaclePosition.z, 2)
      );

      const isColliding = distance < (obstacle.radius || 4.0);
      const obstacleKey = obstacle.name || `obstacle_${index}`;

      if (isColliding) {
        currentCollisions.add(obstacleKey);

        // Check if this is a new collision
        if (!previousCollisions.current.has(obstacleKey)) {
          console.log(`🚗 Collision started with ${obstacleKey}`);
          if (onCollisionEnter) {
            onCollisionEnter(obstacleKey, distance);
          }
        }
      } else {
        // Check if collision ended
        if (previousCollisions.current.has(obstacleKey)) {
          console.log(`✅ Collision ended with ${obstacleKey}`);
          if (onCollisionExit) {
            onCollisionExit(obstacleKey, distance);
          }
        }
      }

      // Debug logging (reduced frequency)
      if (Math.random() < 0.005) {
        // Only log 0.5% of the time
        console.log(
          `Distance to ${obstacleKey}: ${distance.toFixed(
            2
          )}, collision: ${isColliding}`
        );
      }
    });

    // Update state
    setCollisions(currentCollisions);
    previousCollisions.current = new Set(currentCollisions);
  });

  return null; // This is a logical component, no rendering
};

export default CharacterCollision;
