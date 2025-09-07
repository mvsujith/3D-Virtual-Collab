import React, { useRef, useEffect, useMemo } from "react";
import * as THREE from "three";
import { useLoader } from "@react-three/fiber";

const GridPlane = () => {
  const gridRef = useRef(); // Load the sand texture as snow texture
  const snowTexture = useLoader(THREE.TextureLoader, "/Sand 002_OCC.jpg");
  // Configure texture for seamless tiling
  useMemo(() => {
    if (snowTexture) {
      // Use RepeatWrapping for seamless tiling
      snowTexture.wrapS = THREE.RepeatWrapping;
      snowTexture.wrapT = THREE.RepeatWrapping;

      // Set repeat for texture tiling (adjust to make texture size appropriate)
      snowTexture.repeat.set(10, 10); // 10x10 tiles across the 100x100 plane

      // High quality filtering
      snowTexture.magFilter = THREE.LinearFilter;
      snowTexture.minFilter = THREE.LinearMipmapLinearFilter;
      snowTexture.generateMipmaps = true;

      // Ensure texture is properly uploaded
      snowTexture.needsUpdate = true;
    }
  }, [snowTexture]);

  useEffect(() => {
    if (gridRef.current) {
      // Create a grid helper with larger size to match the plane
      const grid = new THREE.GridHelper(
        120, // size - increased to match plane
        60, // divisions - increased proportionally
        0x888888, // center line color
        0x888888 // grid color
      );

      // Make the grid slightly transparent like in your reference
      grid.material.opacity = 0.8;
      grid.material.transparent = true;

      // Copy the grid geometry and material to our ref
      gridRef.current.geometry = grid.geometry;
      gridRef.current.material = grid.material;
    }
  }, []);
  return (
    <>
      {/* Grid overlay - positioned below the textured plane */}
      <primitive
        ref={gridRef}
        object={new THREE.GridHelper(120, 60, 0x888888, 0x888888)}
        position={[0, -0.01, 0]} // Slightly below the textured plane
      />
      {/* Textured ground plane with snow texture - positioned above grid */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[120, 120, 32, 32]} />
        <meshStandardMaterial
          color="#ffffff"
          aoMap={snowTexture}
          aoMapIntensity={1.0}
          transparent={true}
          opacity={0.8} // Make slightly transparent to see grid underneath
          roughness={0.9}
          metalness={0.0}
          envMapIntensity={0.3} // Reduced to prevent over-bright reflections
        />
      </mesh>
    </>
  );
};

export default GridPlane;
