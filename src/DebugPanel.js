import React, { useState, useEffect } from "react";

const DebugPanel = ({ soldierRef, obstacles }) => {
  const [debugInfo, setDebugInfo] = useState({
    soldierPosition: { x: 0, y: 0, z: 0 },
    distances: {},
  });

  useEffect(() => {
    const interval = setInterval(() => {
      if (soldierRef.current) {
        const position = soldierRef.current.position;
        const distances = {};

        obstacles.forEach((obstacle) => {
          const dist = Math.sqrt(
            Math.pow(position.x - obstacle.position[0], 2) +
              Math.pow(position.z - obstacle.position[2], 2)
          );
          distances[obstacle.name] = {
            distance: dist.toFixed(2),
            inCollisionZone: dist <= obstacle.radius,
          };
        });

        setDebugInfo({
          soldierPosition: {
            x: position.x.toFixed(2),
            y: position.y.toFixed(2),
            z: position.z.toFixed(2),
          },
          distances,
        });
      }
    }, 100); // Update every 100ms

    return () => clearInterval(interval);
  }, [soldierRef, obstacles]);

  return (
    <div
      style={{
        position: "absolute",
        top: "20px",
        left: "20px",
        background: "rgba(0, 0, 0, 0.8)",
        color: "white",
        padding: "15px",
        borderRadius: "8px",
        fontSize: "12px",
        fontFamily: "monospace",
        minWidth: "200px",
        zIndex: 1000,
      }}
    >
      <div style={{ fontWeight: "bold", marginBottom: "10px" }}>
        🔧 Debug Info
      </div>

      <div style={{ marginBottom: "10px" }}>
        <div>📍 Soldier Position:</div>
        <div style={{ marginLeft: "10px" }}>
          X: {debugInfo.soldierPosition.x}
          <br />
          Y: {debugInfo.soldierPosition.y}
          <br />
          Z: {debugInfo.soldierPosition.z}
        </div>
      </div>

      <div>
        <div>📏 Distances to Obstacles:</div>
        {Object.entries(debugInfo.distances).map(([name, info]) => (
          <div key={name} style={{ marginLeft: "10px", marginTop: "5px" }}>
            <span
              style={{
                color: info.inCollisionZone ? "#ff6b6b" : "#4ecdc4",
              }}
            >
              {name}: {info.distance} units
              {info.inCollisionZone && " ⚠️"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DebugPanel;
