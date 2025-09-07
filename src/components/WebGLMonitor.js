import React, { useState, useEffect } from "react";
import { webglContextManager } from "../utils/webglContextManager";

const WebGLMonitor = () => {
  const [contextInfo, setContextInfo] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const updateContextInfo = () => {
      const debugInfo = webglContextManager.getDebugInfo();
      setContextInfo(debugInfo);
    };

    // Update immediately
    updateContextInfo();

    // Update every 5 seconds
    const interval = setInterval(updateContextInfo, 5000);

    return () => clearInterval(interval);
  }, []);

  if (!contextInfo) {
    return null;
  }

  const getStatusColor = () => {
    if (!contextInfo.available) return "bg-red-500";
    if (contextInfo.activeContexts > 1) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getStatusText = () => {
    if (!contextInfo.available) return "WebGL Unavailable";
    if (contextInfo.activeContexts > 1) return "Multiple Contexts";
    return "WebGL Active";
  };

  return (
    <div className="fixed top-4 left-4 z-50">
      <div className="bg-black/80 backdrop-blur-sm rounded-lg border border-gray-700">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 px-3 py-2 text-white text-sm hover:bg-white/10 rounded-lg transition-colors"
        >
          <div
            className={`w-3 h-3 rounded-full ${getStatusColor()} animate-pulse`}
          />
          <span>{getStatusText()}</span>
          <svg
            className={`w-4 h-4 transition-transform ${
              isExpanded ? "rotate-180" : ""
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {isExpanded && contextInfo.available && (
          <div className="px-3 pb-3 text-xs text-gray-300 space-y-1 border-t border-gray-700 mt-2 pt-2">
            <div>
              <strong>Renderer:</strong> {contextInfo.unmaskedRenderer}
            </div>
            <div>
              <strong>Vendor:</strong> {contextInfo.unmaskedVendor}
            </div>
            <div>
              <strong>Version:</strong> {contextInfo.version}
            </div>
            <div>
              <strong>Active Contexts:</strong> {contextInfo.activeContexts}
            </div>
            <div>
              <strong>Max Texture Size:</strong> {contextInfo.maxTextureSize}
            </div>
            {window.performance && window.performance.memory && (
              <div>
                <strong>Memory:</strong>{" "}
                {Math.round(window.performance.memory.usedJSHeapSize / 1048576)}
                MB
              </div>
            )}
          </div>
        )}

        {isExpanded && !contextInfo.available && (
          <div className="px-3 pb-3 text-xs text-red-300 border-t border-gray-700 mt-2 pt-2">
            <div>WebGL is not available or has been disabled.</div>
            <button
              onClick={() => window.location.reload()}
              className="mt-2 px-2 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700 transition-colors"
            >
              Reload Page
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WebGLMonitor;
