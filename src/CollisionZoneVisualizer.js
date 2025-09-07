import React from "react";
import * as THREE from "three";

const CollisionZoneVisualizer = ({ obstacles, visible = true }) => {
  if (!visible) return null;

  return (
    <>
      {obstacles.map((obstacle, index) => (
        <mesh
          key={obstacle.name || `zone_${index}`}
          position={[obstacle.position[0], 0.1, obstacle.position[2]]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <ringGeometry args={[obstacle.radius - 0.5, obstacle.radius, 32]} />
          <meshBasicMaterial
            color={obstacle.color || "#ff6b6b"}
            transparent
            opacity={0.3}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </>
  );
};

export default CollisionZoneVisualizer;
