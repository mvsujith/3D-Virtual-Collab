import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass";

const ExplodingVoxelScene = ({ autoStart = true, onAnimationComplete }) => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0a);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 10);

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    mountRef.current.appendChild(renderer.domElement);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 5;
    controls.maxDistance = 50;

    // Clock for animation timing
    const clock = new THREE.Clock();

    // Post-processing setup
    const composer = new EffectComposer(renderer);

    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      1.5, // strength
      0.4, // radius
      0.85 // threshold
    );
    composer.addPass(bloomPass);

    const outputPass = new OutputPass();
    composer.addPass(outputPass);

    // Create point texture (soft circular)
    const createPointTexture = () => {
      const size = 64;
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");

      const gradient = ctx.createRadialGradient(
        size / 2,
        size / 2,
        0,
        size / 2,
        size / 2,
        size / 2
      );
      gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
      gradient.addColorStop(0.5, "rgba(255, 255, 255, 0.5)");
      gradient.addColorStop(1, "rgba(255, 255, 255, 0)");

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, size, size);

      return new THREE.CanvasTexture(canvas);
    };

    // Custom shader material
    const pointTexture = createPointTexture();

    const vertexShader = `
      attribute vec3 offset;
      uniform float uTime;
      uniform float uPointSize;
      
      void main() {
        vec3 pos = position;
        
        // Exploding effect: push points along their offset direction
        float explosionFactor = smoothstep(0.0, 1.0, uTime);
        pos += offset * explosionFactor * 5.0;
        
        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        gl_Position = projectionMatrix * mvPosition;
        
        // Point size shrinks over time (4 -> 1)
        float sizeMultiplier = 1.0 - smoothstep(0.0, 1.0, uTime) * 0.75;
        gl_PointSize = uPointSize * sizeMultiplier * (300.0 / -mvPosition.z);
      }
    `;

    const fragmentShader = `
      uniform sampler2D uPointTexture;
      uniform float uTime;
      uniform vec3 uColor;
      
      void main() {
        vec2 coords = gl_PointCoord;
        
        // Sample the point texture
        vec4 texColor = texture2D(uPointTexture, coords);
        
        // Fade out over time
        float opacity = (1.0 - smoothstep(0.0, 1.0, uTime)) * texColor.a;
        
        // Add some color variation based on position
        vec3 finalColor = uColor + sin(gl_FragCoord.xy * 0.01) * 0.2;
        
        gl_FragColor = vec4(finalColor, opacity);
        
        if (gl_FragColor.a < 0.01) discard;
      }
    `;

    // Animation state
    let pointCloud = null;
    let animationStartTime = 0;
    let isAnimating = false;
    const animationDuration = 3.0; // 3 seconds

    // Load GLTF model and convert to point cloud
    const loader = new GLTFLoader();
    loader.load(
      "/sci-fi_space_station.glb",
      (gltf) => {
        console.log("✅ Space station model loaded successfully");

        // Extract geometry from all meshes in the model
        const positions = [];
        const colors = [];

        gltf.scene.traverse((child) => {
          if (child.isMesh && child.geometry) {
            const geometry = child.geometry;
            const positionAttribute = geometry.attributes.position;
            const colorAttribute = geometry.attributes.color;

            if (positionAttribute) {
              // Apply the mesh's world matrix to positions
              child.updateWorldMatrix(true, false);
              const worldMatrix = child.matrixWorld;

              for (let i = 0; i < positionAttribute.count; i++) {
                const vertex = new THREE.Vector3().fromBufferAttribute(
                  positionAttribute,
                  i
                );
                vertex.applyMatrix4(worldMatrix);

                positions.push(vertex.x, vertex.y, vertex.z);

                // Add colors (white with slight variation)
                const colorVariation = Math.random() * 0.3 + 0.7;
                colors.push(
                  colorVariation,
                  colorVariation * 0.9,
                  colorVariation * 1.1
                );
              }
            }
          }
        });

        console.log(`📊 Generated ${positions.length / 3} points from model`);

        // Create BufferGeometry for point cloud
        const pointGeometry = new THREE.BufferGeometry();
        pointGeometry.setAttribute(
          "position",
          new THREE.Float32BufferAttribute(positions, 3)
        );
        pointGeometry.setAttribute(
          "color",
          new THREE.Float32BufferAttribute(colors, 3)
        );

        // Generate random offset directions for each point
        const offsets = [];
        for (let i = 0; i < positions.length / 3; i++) {
          const offset = new THREE.Vector3(
            (Math.random() - 0.5) * 2,
            (Math.random() - 0.5) * 2,
            (Math.random() - 0.5) * 2
          ).normalize();

          // Add some randomness to the offset magnitude
          const magnitude = Math.random() * 0.5 + 0.5;
          offset.multiplyScalar(magnitude);

          offsets.push(offset.x, offset.y, offset.z);
        }
        pointGeometry.setAttribute(
          "offset",
          new THREE.Float32BufferAttribute(offsets, 3)
        );

        // Create shader material
        const pointMaterial = new THREE.ShaderMaterial({
          uniforms: {
            uTime: { value: 0.0 },
            uPointSize: { value: 4.0 },
            uPointTexture: { value: pointTexture },
            uColor: { value: new THREE.Color(0x4fc3f7) },
          },
          vertexShader,
          fragmentShader,
          transparent: true,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
          vertexColors: true,
        });

        // Create point cloud
        pointCloud = new THREE.Points(pointGeometry, pointMaterial);
        scene.add(pointCloud);

        // Start animation if autoStart is enabled
        if (autoStart) {
          startExplosion();
        }
      },
      (progress) => {
        console.log(
          "📦 Loading progress:",
          (progress.loaded / progress.total) * 100 + "%"
        );
      },
      (error) => {
        console.error("❌ Error loading space station model:", error);
      }
    );

    // Animation functions
    const startExplosion = () => {
      if (!pointCloud || isAnimating) return;

      console.log("💥 Starting explosion animation");
      isAnimating = true;
      animationStartTime = clock.getElapsedTime();

      // Reset uniforms
      pointCloud.material.uniforms.uTime.value = 0.0;
    };

    const resetAnimation = () => {
      if (!pointCloud) return;

      console.log("🔄 Resetting animation");
      isAnimating = false;
      pointCloud.material.uniforms.uTime.value = 0.0;
    };

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(10, 10, 5);
    scene.add(directionalLight);

    // Animation loop
    const animate = () => {
      const elapsedTime = clock.getElapsedTime();

      // Update controls
      controls.update();

      // Update explosion animation
      if (pointCloud && isAnimating) {
        const animationTime =
          (elapsedTime - animationStartTime) / animationDuration;

        if (animationTime <= 1.0) {
          pointCloud.material.uniforms.uTime.value = animationTime;
        } else {
          // Animation complete
          isAnimating = false;
          pointCloud.material.uniforms.uTime.value = 1.0;

          if (onAnimationComplete) {
            onAnimationComplete();
          }

          // Auto-restart after 2 seconds
          setTimeout(() => {
            if (pointCloud) {
              startExplosion();
            }
          }, 2000);
        }
      }

      // Render
      composer.render();

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      composer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    // Expose control methods
    sceneRef.current.startExplosion = startExplosion;
    sceneRef.current.resetAnimation = resetAnimation;

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);

      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }

      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }

      // Dispose of resources
      if (pointCloud) {
        pointCloud.geometry.dispose();
        pointCloud.material.dispose();
      }

      pointTexture.dispose();
      renderer.dispose();
      composer.dispose();
    };
  }, [autoStart, onAnimationComplete]);

  // Control buttons
  const handleStart = () => {
    if (sceneRef.current?.startExplosion) {
      sceneRef.current.startExplosion();
    }
  };

  const handleReset = () => {
    if (sceneRef.current?.resetAnimation) {
      sceneRef.current.resetAnimation();
    }
  };

  return (
    <div className="relative w-full h-screen">
      <div ref={mountRef} className="w-full h-full" />

      {/* Control UI */}
      <div className="absolute top-4 right-4 space-y-2">
        <button
          onClick={handleStart}
          className="block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          💥 Start Explosion
        </button>
        <button
          onClick={handleReset}
          className="block px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors text-sm font-medium"
        >
          🔄 Reset
        </button>
      </div>

      {/* Info panel */}
      <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-sm text-white p-4 rounded-lg max-w-sm">
        <h3 className="font-bold text-lg mb-2">🚀 Exploding Voxel Scene</h3>
        <p className="text-sm text-gray-300 mb-2">
          Space station model converted to GPU-accelerated point cloud with
          exploding voxel animation.
        </p>
        <div className="text-xs text-gray-400">
          <div>• Mouse: Orbit camera</div>
          <div>• Wheel: Zoom in/out</div>
          <div>• Animation: 3s explosion loop</div>
        </div>
      </div>
    </div>
  );
};

export default ExplodingVoxelScene;
