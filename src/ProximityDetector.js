import { useFrame } from "@react-three/fiber";
import { useRef, useCallback } from "react";
import * as THREE from "three";

const ProximityDetector = ({
  soldierRef,
  collisionZones = [],
  onProximityEnter,
  onProximityExit,
}) => {
  const zonesInProximity = useRef(new Set());
  const debugCounter = useRef(0);

  const checkProximity = useCallback(() => {
    if (!soldierRef.current) {
      console.log("❌ No soldier reference available");
      return;
    }

    // Get soldier position
    const soldierPosition = new THREE.Vector3();
    soldierRef.current.getWorldPosition(soldierPosition);

    const currentProximityZones = new Set();

    // Check each collision zone
    collisionZones.forEach((zone) => {
      const zonePos = new THREE.Vector3(...zone.position);
      const distance = soldierPosition.distanceTo(zonePos);

      const isInProximity = distance <= zone.radius;

      if (isInProximity) {
        currentProximityZones.add(zone.name);

        // Check if this is a new proximity entry
        if (!zonesInProximity.current.has(zone.name)) {
          console.log(
            `🎯 Entered proximity zone: ${
              zone.name
            }! Distance: ${distance.toFixed(2)} units`
          );
          if (onProximityEnter) {
            onProximityEnter(zone, distance);
          }
        }
      } else {
        // Check if we left this proximity zone
        if (zonesInProximity.current.has(zone.name)) {
          console.log(
            `🚶 Left proximity zone: ${zone.name}. Distance: ${distance.toFixed(
              2
            )} units`
          );
          if (onProximityExit) {
            onProximityExit(zone, distance);
          }
        }
      }

      // Debug logging (only every 120 frames to reduce spam)
      debugCounter.current++;
      if (debugCounter.current % 120 === 0) {
        console.log(
          `� Soldier: (${soldierPosition.x.toFixed(
            1
          )}, ${soldierPosition.y.toFixed(1)}, ${soldierPosition.z.toFixed(1)})`
        );
        console.log(
          `🎯 ${zone.name}: (${zonePos.x.toFixed(1)}, ${zonePos.y.toFixed(
            1
          )}, ${zonePos.z.toFixed(1)})`
        );
        console.log(
          `📏 Distance to ${zone.name}: ${distance.toFixed(
            2
          )} units (trigger at ${zone.radius})`
        );
      }
    });

    // Update the zones we're currently in proximity to
    zonesInProximity.current = currentProximityZones;
  }, [soldierRef, collisionZones, onProximityEnter, onProximityExit]);

  useFrame(() => {
    checkProximity();
  });

  return null; // This is a logic-only component
};

export default ProximityDetector;
