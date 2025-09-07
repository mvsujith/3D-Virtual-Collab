# Exploding Voxel Scene Implementation

This implementation creates a GPU-accelerated exploding voxel effect using Three.js and React Three Fiber.

## Features

- ✅ **GLTFLoader** - Loads the sci-fi space station model
- ✅ **BufferGeometry** - Converts mesh vertices to point cloud
- ✅ **Custom Shaders** - Vertex and fragment shaders with time-based animation
- ✅ **GPU Acceleration** - All animation calculations done on GPU
- ✅ **Point Texture** - Soft circular texture for realistic particles
- ✅ **Post-processing** - Bloom effect for enhanced visuals
- ✅ **Orbit Controls** - Interactive camera controls
- ✅ **Auto-loop** - Continuous animation with 2-second pause

## Technical Implementation

### Vertex Shader

- Pushes each point along its random `offset` direction
- Uses `smoothstep(0,1,uTime)` for smooth animation curves
- Shrinks `gl_PointSize` from 4→1 over time
- Distance-based point scaling for depth perception

### Fragment Shader

- Samples soft circular point texture
- Fades opacity from 1→0 using `smoothstep`
- Adds subtle color variation based on screen coordinates
- Discards transparent pixels for performance

### Animation System

- 3-second explosion duration
- Time uniform from 0→1
- Automatic reset and restart with 2-second delay
- Smooth easing functions for natural motion

## Files

### React Components

- `ExplodingVoxelSceneReact.js` - React Three Fiber implementation
- `ExplodingVoxelScene.js` - Vanilla Three.js implementation

### Demo Pages

- `exploding-voxel-demo.html` - Standalone HTML demo
- Integrated into main app with "🚀 Voxel Demo" button

## Usage

### In React App

```jsx
import ExplodingVoxelSceneReact from "./components/ExplodingVoxelSceneReact";

<ExplodingVoxelSceneReact
  autoStart={true}
  onAnimationComplete={() => console.log("Animation complete!")}
/>;
```

### Standalone HTML

Open `public/exploding-voxel-demo.html` in a browser.

## Controls

- **Mouse**: Orbit camera around the scene
- **Mouse Wheel**: Zoom in/out
- **💥 Start Explosion**: Manually trigger animation
- **🔄 Reset**: Reset to initial state
- **⏯️ Toggle Auto-Loop**: Enable/disable automatic restarts

## Technical Details

### Shader Uniforms

- `uTime`: Animation progress (0.0 → 1.0)
- `uPointSize`: Base point size (4.0)
- `uPointTexture`: Soft circular texture
- `uColor`: Base particle color

### Vertex Attributes

- `position`: Original vertex positions from GLTF model
- `color`: Per-vertex color variations
- `offset`: Random 3D direction vectors for explosion

### Performance Optimizations

- GPU-based animation (no CPU vertex updates)
- Additive blending for overdraw performance
- Distance-based point scaling
- Texture-based soft particles
- Conservative WebGL settings

## Model Requirements

The implementation expects a GLTF model at:

```
/sci-fi_space_station.glb
```

The model is automatically converted to a point cloud by:

1. Traversing all mesh children
2. Extracting vertex positions
3. Applying world matrix transformations
4. Generating random offset directions
5. Creating BufferGeometry with custom attributes

## Integration Notes

- Uses WebGL context manager for stability
- Includes fallback UI for WebGL unavailable
- Post-processing bloom for visual enhancement
- Responsive design with proper cleanup
- Error boundaries for robust error handling
