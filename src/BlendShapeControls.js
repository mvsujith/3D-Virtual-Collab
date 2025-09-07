import React, { useRef, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useControls } from "leva";
import * as THREE from "three";

const BlendShapeControls = ({ model, mixer }) => {
  const [morphTargets, setMorphTargets] = useState({});
  const [blendWeights, setBlendWeights] = useState({});

  // Find all morph targets in the model
  useEffect(() => {
    if (!model) return;

    const targets = {};
    const weights = {};

    model.traverse((child) => {
      if (child.isMesh && child.morphTargetDictionary) {
        const morphDict = child.morphTargetDictionary;
        Object.keys(morphDict).forEach((key) => {
          if (!targets[key]) {
            targets[key] = {
              mesh: child,
              index: morphDict[key],
            };
            weights[key] = 0;
          }
        });
      }
    });

    setMorphTargets(targets);
    setBlendWeights(weights);
  }, [model]);

  // Create Leva controls for blend shapes
  const controls = useControls(
    "Blend Shapes",
    Object.keys(morphTargets).reduce((acc, key) => {
      acc[key] = {
        value: 0,
        min: 0,
        max: 1,
        step: 0.01,
      };
      return acc;
    }, {})
  );

  // Animation controls
  const animationControls = useControls("Animation Blending", {
    idleWeight: { value: 1, min: 0, max: 1, step: 0.01 },
    walkWeight: { value: 0, min: 0, max: 1, step: 0.01 },
    runWeight: { value: 0, min: 0, max: 1, step: 0.01 },
    transitionSpeed: { value: 0.5, min: 0.1, max: 2, step: 0.1 },
    timeScale: { value: 1, min: 0.1, max: 3, step: 0.1 },
  });

  // Update morph targets
  useFrame(() => {
    Object.keys(controls).forEach((key) => {
      if (morphTargets[key]) {
        const { mesh, index } = morphTargets[key];
        if (mesh.morphTargetInfluences) {
          mesh.morphTargetInfluences[index] = controls[key];
        }
      }
    });
  });

  return null; // This component only manages controls
};

export default BlendShapeControls;
