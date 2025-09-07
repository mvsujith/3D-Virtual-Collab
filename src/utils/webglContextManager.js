// WebGL Context Manager Utility
// Helps prevent WebGL context loss by managing context creation and cleanup

class WebGLContextManager {
  constructor() {
    this.activeContexts = new Set();
    this.maxContexts = 1; // Reduced to 1 to prevent conflicts
    this.contextLossCallbacks = new Map();
    this.lastContextLoss = null;
    this.contextLossCount = 0;

    // Monitor memory usage
    this.monitorMemory();
  }

  // Monitor WebGL memory usage
  monitorMemory() {
    if (window.performance && window.performance.memory) {
      setInterval(() => {
        const memory = window.performance.memory;
        const usedMB = Math.round(memory.usedJSHeapSize / 1048576);
        const totalMB = Math.round(memory.totalJSHeapSize / 1048576);

        if (usedMB > 200) {
          // Warn if using more than 200MB
          console.warn(`⚠️ High memory usage: ${usedMB}MB/${totalMB}MB`);

          // Force garbage collection if available
          if (window.gc) {
            window.gc();
          }
        }
      }, 10000); // Check every 10 seconds
    }
  }
  // Register a new WebGL context
  registerContext(gl, id = "default") {
    // Force cleanup of existing contexts if at limit
    if (this.activeContexts.size >= this.maxContexts) {
      console.warn(
        `⚠️ Maximum WebGL contexts (${this.maxContexts}) reached. Cleaning up old contexts.`
      );
      this.forceCleanupOldestContext();
    }

    this.activeContexts.add({ gl, id, createdAt: Date.now() });
    console.log(
      `🟢 WebGL context registered: ${id}. Active contexts: ${this.activeContexts.size}`
    );

    return () => this.unregisterContext(gl, id);
  }

  // Force cleanup of the oldest context
  forceCleanupOldestContext() {
    if (this.activeContexts.size === 0) return;

    const oldest = Array.from(this.activeContexts).sort(
      (a, b) => a.createdAt - b.createdAt
    )[0];
    if (oldest) {
      try {
        const loseExt = oldest.gl.getExtension("WEBGL_lose_context");
        if (loseExt) {
          loseExt.loseContext();
        }
        this.activeContexts.delete(oldest);
        console.log(`🗑️ Forced cleanup of oldest context: ${oldest.id}`);
      } catch (error) {
        console.warn("Failed to force cleanup context:", error);
      }
    }
  }

  // Unregister a WebGL context
  unregisterContext(gl, id = "default") {
    const context = Array.from(this.activeContexts).find(
      (ctx) => ctx.gl === gl && ctx.id === id
    );
    if (context) {
      this.activeContexts.delete(context);
      console.log(
        `🔴 WebGL context unregistered: ${id}. Active contexts: ${this.activeContexts.size}`
      );
    }
  }

  // Force cleanup of all contexts
  cleanup() {
    console.log(`🧹 Cleaning up ${this.activeContexts.size} WebGL contexts...`);
    this.activeContexts.forEach(({ gl, id }) => {
      try {
        if (gl && gl.getExtension && gl.getExtension("WEBGL_lose_context")) {
          gl.getExtension("WEBGL_lose_context").loseContext();
        }
      } catch (error) {
        console.warn(`Failed to cleanup context ${id}:`, error);
      }
    });
    this.activeContexts.clear();
  } // Get optimal WebGL settings based on current context load
  getOptimalSettings() {
    // Always use conservative settings to prevent context loss
    return {
      antialias: false, // Disabled to save memory
      powerPreference: "default", // Avoid high-performance to reduce conflicts
      preserveDrawingBuffer: false,
      failIfMajorPerformanceCaveat: true,
      alpha: false, // Disabled to save memory
      depth: true,
      stencil: false, // Disabled to save memory
      premultipliedAlpha: false,
      dpr: [0.5, 1], // Lower DPR to reduce memory usage
    };
  }

  // Record context loss for debugging
  recordContextLoss(id) {
    this.lastContextLoss = { id, timestamp: Date.now() };
    this.contextLossCount++;
    console.error(
      `📊 Context loss recorded for ${id}. Total losses: ${this.contextLossCount}`
    );

    // If too many context losses, suggest page reload
    if (this.contextLossCount >= 3) {
      console.error(
        "🚨 Multiple WebGL context losses detected. Consider reloading the page."
      );
      // Auto-reload after 5 seconds of excessive failures
      setTimeout(() => {
        if (this.contextLossCount >= 5) {
          console.log("🔄 Auto-reloading due to excessive WebGL failures...");
          window.location.reload();
        }
      }, 5000);
    }
  }

  // Check if WebGL is available
  isWebGLAvailable() {
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");

      if (!gl) {
        return false;
      }

      // Test basic WebGL functionality
      gl.clearColor(0, 0, 0, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);

      return true;
    } catch (error) {
      console.error("WebGL availability check failed:", error);
      return false;
    }
  }

  // Get WebGL debug info
  getDebugInfo() {
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");

      if (!gl) {
        return { available: false };
      }

      const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");

      return {
        available: true,
        vendor: gl.getParameter(gl.VENDOR),
        renderer: gl.getParameter(gl.RENDERER),
        version: gl.getParameter(gl.VERSION),
        shadingLanguageVersion: gl.getParameter(gl.SHADING_LANGUAGE_VERSION),
        unmaskedVendor: debugInfo
          ? gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL)
          : "Unknown",
        unmaskedRenderer: debugInfo
          ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
          : "Unknown",
        maxTextureSize: gl.getParameter(gl.MAX_TEXTURE_SIZE),
        maxVertexAttribs: gl.getParameter(gl.MAX_VERTEX_ATTRIBS),
        maxViewportDims: gl.getParameter(gl.MAX_VIEWPORT_DIMS),
        activeContexts: this.activeContexts.size,
      };
    } catch (error) {
      return { available: false, error: error.message };
    }
  }
}

// Create singleton instance
export const webglContextManager = new WebGLContextManager();

// Cleanup on page unload
window.addEventListener("beforeunload", () => {
  webglContextManager.cleanup();
});

// Log WebGL info on startup
console.log("🔍 WebGL Debug Info:", webglContextManager.getDebugInfo());

export default webglContextManager;
