import React, {
  useRef,
  useState,
  useCallback,
  useEffect,
  Suspense,
} from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import { Leva } from "leva";
import { motion, AnimatePresence } from "framer-motion";
import GridPlane from "./GridPlane";
import WalkingCharacter from "./WalkingCharacter";
import ZoomIndicator from "./ZoomIndicator";
import AbandonedCar from "./AbandonedCar";
import RobotPlayground from "./RobotPlayground";
import TokyoModel from "./TokyoModel";
import ProximityDetector from "./ProximityDetector";
import PopupOverlay from "./PopupOverlay";
import CollisionZoneVisualizer from "./CollisionZoneVisualizer";
import CollisionPopup from "./components/CollisionPopup";
import LoginPanel from "./components/LoginPanel";
import GamingClickEffect from "./components/GamingClickEffect";
import SujithCollabTransition from "./components/SujithCollabTransition";
import SpaceStation from "./components/SpaceStation";
import WebGLMonitor from "./components/WebGLMonitor";
import { webglContextManager } from "./utils/webglContextManager";
import "./App.css";

// App states
const APP_STATES = {
  LOGIN: "login",
  TRANSITION: "transition",
  MAIN_APP: "main_app",
};

const Scene = ({
  orbitControlsRef,
  onSoldierRef,
  soldierRef,
  onProximityEnter,
  onCollision,
}) => {
  // Define collision zones with manual position coordinates [x, y, z]
  const collisionZones = [
    {
      name: "Car",
      position: [10, 2.5, -5],
      radius: 4.0,
      color: "#ff6b6b",
    },
    {
      name: "Tokyo",
      position: [0, 8, 20],
      radius: 10.5,
      color: "#4ecdc4",
    },
  ];

  // Extract positions for the actual models (keeping them in sync with collision zones)
  const carPosition = [12, 2, -4];
  const tokyoPosition = [4, 8, 20];

  return (
    <>
      {/* HDR Environment mapping for realistic sky and lighting */}
      <Environment
        files="/passendorf_snow_4k.exr"
        background={true}
        ground={{
          height: 10,
          radius: 80,
          scale: 120,
        }}
      />
      {/* Camera positioned for optimal grid viewing */}
      <perspectiveCamera
        makeDefault
        position={[0, 12, 20]}
        fov={75}
        near={0.1}
        far={1000}
      />
      {/* Lighting */}
      <ambientLight intensity={0.2} color="#ffffff" />
      <directionalLight
        position={[10, 10, 5]}
        intensity={0.5}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      {/* 3D Models */}
      <AbandonedCar position={carPosition} scale={[6, 6, 6]} />
      <RobotPlayground position={[18, 0, 2]} scale={[2, 2, 2]} />
      <TokyoModel
        position={tokyoPosition}
        scale={[0.04, 0.04, 0.04]}
        animationSpeed={0.3}
      />
      {/* Collision zone visualization */}
      <CollisionZoneVisualizer obstacles={collisionZones} visible={true} />{" "}
      {/* Walking animated character */}
      <WalkingCharacter
        orbitControlsRef={orbitControlsRef}
        onSoldierRef={onSoldierRef}
        collisionZones={collisionZones}
        onCollision={onCollision}
      />
      {/* Proximity detection logic */}
      {soldierRef.current && (
        <ProximityDetector
          soldierRef={soldierRef}
          collisionZones={collisionZones}
          onProximityEnter={onProximityEnter}
          onProximityExit={() => {
            console.log("🚶 Soldier left proximity zone");
          }}
        />
      )}
      {/* Classic 3D editor ground grid */}
      <GridPlane />
      {/* Orbit controls for camera interaction */}
      <OrbitControls
        ref={orbitControlsRef}
        enableDamping
        dampingFactor={0.05}
        enablePan={true}
        enableRotate={true}
        enableZoom={true}
        mouseButtons={{
          LEFT: 0,
          MIDDLE: 1,
          RIGHT: -1,
        }}
        touches={{
          ONE: "rotate",
          TWO: "dolly-pan",
        }}
        minDistance={5}
        maxDistance={50}
        maxPolarAngle={Math.PI / 2}
        target={[0, 0, 0]}
      />
    </>
  );
};

function App() {
  const orbitControlsRef = useRef();
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [appState, setAppState] = useState(APP_STATES.LOGIN);
  const [isCollisionPopupVisible, setIsCollisionPopupVisible] = useState(false);
  const [collisionInfo, setCollisionInfo] = useState(null);
  const [webglAvailable, setWebglAvailable] = useState(null);
  const soldierRef = useRef(null);

  // Check WebGL availability on mount
  useEffect(() => {
    const isAvailable = webglContextManager.isWebGLAvailable();
    setWebglAvailable(isAvailable);

    if (!isAvailable) {
      console.error("❌ WebGL is not available on this device/browser");
    } else {
      console.log("✅ WebGL is available");
      console.log("🔍 WebGL Debug Info:", webglContextManager.getDebugInfo());
    }
  }, []);
  // Handle soldier reference from WalkingCharacter
  const handleSoldierRef = useCallback((ref) => {
    console.log("🤖 Received soldier reference:", ref);
    soldierRef.current = ref;
  }, []);

  // Handle proximity detection
  const handleProximityEnter = useCallback(
    (zone, distance) => {
      console.log(
        `🎉 Proximity callback triggered for ${zone.name}! Distance: ${distance}, Current popup state: ${isPopupVisible}`
      );
      if (!isPopupVisible) {
        console.log("🚀 Opening popup!");
        setIsPopupVisible(true);
      }
    },
    [isPopupVisible]
  );
  const handleClosePopup = useCallback(() => {
    console.log("❌ Closing popup");
    setIsPopupVisible(false);
  }, []);

  // Handle collision detection
  const handleCollision = useCallback((collisionData) => {
    console.log("🚫 Collision detected with:", collisionData.name);
    setCollisionInfo(collisionData);
    setIsCollisionPopupVisible(true);
  }, []);

  const handleCloseCollisionPopup = useCallback(() => {
    console.log("❌ Closing collision popup");
    setIsCollisionPopupVisible(false);
    setCollisionInfo(null);
  }, []);

  // Handle login button click with gaming effect
  const handleLoginClick = () => {
    setShowLogin(true);
  };

  // Handle successful login
  const handleLoginSuccess = (credentials) => {
    console.log("Login successful:", credentials);
    setShowLogin(false);
    setAppState(APP_STATES.TRANSITION);
  };

  // Handle transition completion
  const handleTransitionComplete = () => {
    setAppState(APP_STATES.MAIN_APP);
  };

  // Debug popup state changes
  useEffect(() => {
    console.log("🎭 Popup state changed to:", isPopupVisible);
  }, [isPopupVisible]);
  // Disable right-click context menu globally
  useEffect(() => {
    const handleContextMenu = (e) => {
      e.preventDefault();
    };

    document.addEventListener("contextmenu", handleContextMenu);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  }, []);

  // If WebGL is not available, show error state
  if (webglAvailable === false) {
    return (
      <div className="w-full h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
        <div className="text-white text-center max-w-md mx-auto p-8">
          <div className="text-6xl mb-4">🚫</div>
          <h2 className="text-3xl font-bold mb-4">WebGL Not Supported</h2>
          <p className="text-gray-300 mb-6">
            Your browser doesn't support WebGL or it has been disabled. This
            application requires WebGL to render 3D graphics.
          </p>
          <div className="bg-blue-900/30 border border-blue-600/50 rounded-lg p-4 mb-6 text-left text-sm">
            <h3 className="font-semibold text-blue-400 mb-2">
              💡 Try These Steps:
            </h3>
            <ul className="text-blue-200 space-y-1">
              <li>• Enable WebGL in your browser settings</li>
              <li>• Update your browser to the latest version</li>
              <li>• Update your graphics drivers</li>
              <li>• Try a different browser (Chrome, Firefox, Edge)</li>
              <li>• Restart your computer</li>
            </ul>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Show loading state while checking WebGL
  if (webglAvailable === null) {
    return (
      <div className="w-full h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
        <div className="text-white text-center">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Checking WebGL support...</p>
        </div>
      </div>
    );
  }
  // Login screen with initial 3D background
  if (appState === APP_STATES.LOGIN) {
    return (
      <div className="w-full h-screen relative overflow-hidden bg-black">
        {/* 3D Scene Canvas as background */}{" "}
        <Canvas
          className="w-full h-full"
          camera={{
            position: [0, 0, 8],
            fov: 75,
            near: 0.1,
            far: 1000,
          }}
          gl={{
            ...webglContextManager.getOptimalSettings(),
            alpha: true,
            stencil: false,
            depth: true,
            premultipliedAlpha: false,
            logarithmicDepthBuffer: false,
          }}
          onCreated={({ gl, scene, camera }) => {
            // Register context with manager
            const cleanup = webglContextManager.registerContext(
              gl,
              "login-scene"
            );

            // Set clear color
            gl.setClearColor(0x000000, 0);

            // Configure WebGL context
            gl.setPixelRatio(Math.min(window.devicePixelRatio, 1));
            gl.setSize(window.innerWidth, window.innerHeight);

            // Add WebGL context loss handlers with recovery
            const canvas = gl.domElement;
            const handleContextLost = (event) => {
              console.warn(
                "🔴 Login WebGL context lost. Preventing default and attempting recovery."
              );
              event.preventDefault();

              // Record context loss
              webglContextManager.recordContextLoss("login-scene");

              // Notify context manager
              cleanup();

              // Attempt to recreate context after a delay
              setTimeout(() => {
                try {
                  const loseContext = gl.getExtension("WEBGL_lose_context");
                  if (loseContext) {
                    loseContext.restoreContext();
                  }
                  console.log("🟢 Login WebGL context recovery attempted.");
                } catch (error) {
                  console.error("❌ Failed to restore WebGL context:", error);
                }
              }, 1000);
            };

            const handleContextRestored = () => {
              console.log("🟢 Login WebGL context restored successfully.");
              // Re-register with context manager
              webglContextManager.registerContext(gl, "login-scene");
              // Reinitialize any necessary WebGL state
              gl.setClearColor(0x000000, 0);
            };

            canvas.addEventListener(
              "webglcontextlost",
              handleContextLost,
              false
            );
            canvas.addEventListener(
              "webglcontextrestored",
              handleContextRestored,
              false
            );

            // Store cleanup function
            return () => {
              canvas.removeEventListener("webglcontextlost", handleContextLost);
              canvas.removeEventListener(
                "webglcontextrestored",
                handleContextRestored
              );
              cleanup();
            };
          }}
          fallback={
            <div className="w-full h-full bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
              <div className="text-white text-center">
                <h2 className="text-2xl mb-4">WebGL not available</h2>
                <p className="text-gray-400">
                  Your browser doesn't support WebGL or it's disabled.
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  Reload Page
                </button>
              </div>
            </div>
          }
        >
          {" "}
          <Environment
            files="/RenderCrate-HDRI_Orbital_40_4K.exr"
            background={true}
          />
          <ambientLight intensity={0.3} />
          <directionalLight position={[10, 10, 5]} intensity={0.5} />
          {/* Space Station 3D Model with loading fallback */}
          <Suspense
            fallback={
              <mesh position={[0, 0, 0]} rotation={[0, 0, 0]}>
                <icosahedronGeometry args={[2, 1]} />
                <meshStandardMaterial
                  color="#4ecdc4"
                  wireframe={true}
                  transparent={true}
                  opacity={0.3}
                />
              </mesh>
            }
          >
            <SpaceStation
              position={[0, 0, 0]}
              scale={[2, 2, 2]}
              enableMouseInteraction={true}
            />
          </Suspense>
        </Canvas>
        {/* UI Overlay */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Sujith Collab Button */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 pointer-events-auto">
            <GamingClickEffect onClickEffect={handleLoginClick}>
              <motion.button
                className="glass glow btn-hover px-8 py-4 rounded-full text-white font-semibold text-lg tracking-wide border border-blue-400/30 bg-gradient-to-r from-blue-600/20 to-purple-600/20"
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 0 30px rgba(59, 130, 246, 0.6)",
                }}
                whileTap={{ scale: 0.95 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                }}
              >
                <span className="relative z-10 flex items-center gap-2">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                    />
                  </svg>
                  Sujith Collab
                </span>
              </motion.button>
            </GamingClickEffect>
          </div>{" "}
          {/* Version indicator */}
          <div className="absolute top-4 right-4 text-white/50 text-sm font-mono">
            v1.0.0
          </div>
          {/* Loading indicator */}
          <div className="absolute top-4 left-4">
            <div className="glass rounded-lg px-3 py-2">
              <div className="flex items-center gap-2 text-white/70 text-sm">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                3D Scene Active
              </div>
            </div>
          </div>
          {/* Mouse interaction hint */}
          <div className="absolute bottom-4 right-4">
            <motion.div
              className="glass rounded-lg px-3 py-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 2, duration: 1 }}
            >
              <div className="flex items-center gap-2 text-white/60 text-xs">
                <motion.div
                  animate={{
                    x: [0, 5, -5, 0],
                    y: [0, -3, 3, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="w-3 h-3 border border-blue-400 rounded-sm bg-blue-400/20"
                />
                Move mouse to interact
              </div>
            </motion.div>
          </div>
        </div>
        {/* Login Panel Modal */}
        <AnimatePresence>
          {showLogin && (
            <LoginPanel
              onClose={() => setShowLogin(false)}
              onLogin={handleLoginSuccess}
            />
          )}
        </AnimatePresence>
        {/* Background gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/20 pointer-events-none" />
      </div>
    );
  }

  // Transition screen
  if (appState === APP_STATES.TRANSITION) {
    return (
      <SujithCollabTransition
        isVisible={true}
        onComplete={handleTransitionComplete}
      />
    );
  }
  // Main 3D application
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        margin: 0,
        padding: 0,
        overflow: "hidden",
      }}
    >
      {/* WebGL Status Monitor */}
      <WebGLMonitor />
      {/* Leva GUI controls */}
      <Leva collapsed={false} />
      {/* Zoom Indicator */}
      <ZoomIndicator orbitControlsRef={orbitControlsRef} />{" "}
      <Canvas
        style={{
          width: "100%",
          height: "100%",
        }}
        gl={{
          ...webglContextManager.getOptimalSettings(),
          alpha: false,
          stencil: false,
          depth: true,
          premultipliedAlpha: false,
          logarithmicDepthBuffer: false,
        }}
        dpr={webglContextManager.getOptimalSettings().dpr}
        onCreated={({ gl, scene, camera }) => {
          // Register context with manager
          const cleanup = webglContextManager.registerContext(gl, "main-scene");

          // Configure WebGL conservatively
          gl.setPixelRatio(Math.min(window.devicePixelRatio, 1.25));
          gl.setSize(window.innerWidth, window.innerHeight);

          // Add WebGL context loss handlers for main scene with recovery
          const canvas = gl.domElement;
          const handleContextLost = (event) => {
            console.warn(
              "🔴 Main scene WebGL context lost. Preventing default and attempting recovery."
            );
            event.preventDefault();

            // Record context loss
            webglContextManager.recordContextLoss("main-scene");

            // Notify context manager
            cleanup();

            // Attempt to recreate context after a delay
            setTimeout(() => {
              try {
                const loseContext = gl.getExtension("WEBGL_lose_context");
                if (loseContext) {
                  loseContext.restoreContext();
                }
                console.log("🟢 Main scene WebGL context recovery attempted.");
              } catch (error) {
                console.error(
                  "❌ Failed to restore main scene WebGL context:",
                  error
                );
                // Optionally reload the page as last resort
                setTimeout(() => {
                  console.log(
                    "🔄 Reloading page due to WebGL context failure..."
                  );
                  window.location.reload();
                }, 2000);
              }
            }, 1000);
          };

          const handleContextRestored = () => {
            console.log("🟢 Main scene WebGL context restored successfully.");
            // Re-register with context manager
            webglContextManager.registerContext(gl, "main-scene");
            // Reinitialize any necessary WebGL state here
          };

          canvas.addEventListener("webglcontextlost", handleContextLost, false);
          canvas.addEventListener(
            "webglcontextrestored",
            handleContextRestored,
            false
          );

          // Store cleanup function
          return () => {
            canvas.removeEventListener("webglcontextlost", handleContextLost);
            canvas.removeEventListener(
              "webglcontextrestored",
              handleContextRestored
            );
            cleanup();
          };
        }}
        fallback={
          <div className="w-full h-full bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
            <div className="text-white text-center">
              <h2 className="text-2xl mb-4">3D Scene Unavailable</h2>
              <p className="text-gray-400 mb-4">
                WebGL context could not be created or was lost.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Reload Application
              </button>
            </div>
          </div>
        }
      >
        {" "}
        <Scene
          orbitControlsRef={orbitControlsRef}
          onSoldierRef={handleSoldierRef}
          soldierRef={soldierRef}
          onProximityEnter={handleProximityEnter}
          onCollision={handleCollision}
        />
      </Canvas>
      {/* Popup Overlay */}
      <PopupOverlay isVisible={isPopupVisible} onClose={handleClosePopup} />
      {/* Collision Popup */}
      <CollisionPopup
        isVisible={isCollisionPopupVisible}
        onClose={handleCloseCollisionPopup}
        collisionInfo={collisionInfo}
      />
    </div>
  );
}

export default App;
