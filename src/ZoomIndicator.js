import React, { useState, useEffect } from "react";

const ZoomIndicator = ({ orbitControlsRef }) => {
  const [zoomPercentage, setZoomPercentage] = useState(100);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let timeoutId;

    const updateZoom = () => {
      if (orbitControlsRef.current) {
        const controls = orbitControlsRef.current;
        const minDistance = controls.minDistance || 5;
        const maxDistance = controls.maxDistance || 50;
        const currentDistance = controls.getDistance(); // Calculate zoom percentage (inverse relationship - closer = higher zoom)
        // At minDistance (5) = 100% zoom, at maxDistance (50) = 8% zoom (92% zoomed out)
        const normalizedDistance =
          (currentDistance - minDistance) / (maxDistance - minDistance);
        const percentage = Math.round(100 - normalizedDistance * 92);

        setZoomPercentage(Math.max(8, Math.min(100, percentage)));
        setIsVisible(true);

        // Hide after 2 seconds of no zoom activity
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          setIsVisible(false);
        }, 2000);
      }
    };

    // Listen for zoom events
    const handleWheel = () => {
      // Small delay to let the controls update
      setTimeout(updateZoom, 50);
    };

    // Initial zoom calculation
    updateZoom();

    // Add event listeners
    document.addEventListener("wheel", handleWheel);

    // Cleanup
    return () => {
      document.removeEventListener("wheel", handleWheel);
      clearTimeout(timeoutId);
    };
  }, [orbitControlsRef]);

  return (
    <div
      style={{
        position: "absolute",
        top: "20px",
        left: "50%",
        transform: "translateX(-50%)",
        background: "rgba(0, 0, 0, 0.8)",
        color: "#fff",
        padding: "8px 16px",
        borderRadius: "20px",
        fontSize: "14px",
        fontWeight: "600",
        zIndex: 1000,
        transition: "opacity 0.3s ease",
        opacity: isVisible ? 1 : 0,
        pointerEvents: "none",
        userSelect: "none",
        display: "flex",
        alignItems: "center",
        gap: "8px",
      }}
    >
      <div style={{ fontSize: "16px" }}>🔍</div>
      <div>
        <div style={{ fontSize: "12px", opacity: 0.8 }}>Zoom</div>
        <div style={{ fontSize: "16px" }}>{zoomPercentage}%</div>
      </div>
      <div
        style={{
          width: "100px",
          height: "4px",
          background: "rgba(255, 255, 255, 0.3)",
          borderRadius: "2px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${((zoomPercentage - 8) / 92) * 100}%`,
            height: "100%",
            background: "linear-gradient(90deg, #4CAF50, #2196F3)",
            borderRadius: "2px",
            transition: "width 0.2s ease",
          }}
        />
      </div>
    </div>
  );
};

export default ZoomIndicator;
