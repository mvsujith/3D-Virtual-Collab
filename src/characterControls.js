import * as THREE from "three";
import { DIRECTIONS } from "./utils";

export class CharacterControls {
  constructor(
    model,
    mixer,
    animationsMap,
    orbitControl,
    camera,
    currentAction,
    collisionZones = [],
    onCollision = null
  ) {
    this.model = model;
    this.mixer = mixer;
    this.animationsMap = animationsMap;
    this.currentAction = currentAction;
    this.orbitControl = orbitControl;
    this.camera = camera;
    this.collisionZones = collisionZones; // Store collision zones
    this.onCollision = onCollision; // Callback for collision events

    // State
    this.toggleRun = true;

    // Temporary data
    this.walkDirection = new THREE.Vector3();
    this.rotateAngle = new THREE.Vector3(0, 1, 0);
    this.rotateQuarternion = new THREE.Quaternion();
    this.cameraTarget = new THREE.Vector3();

    // Constants
    this.fadeDuration = 0.2;
    this.runVelocity = 5;
    this.walkVelocity = 2;

    // Start the initial animation
    this.animationsMap.forEach((value, key) => {
      if (key === currentAction) {
        value.play();
      }
    });

    this.updateCameraTarget(0, 0);
  }

  switchRunToggle() {
    this.toggleRun = !this.toggleRun;
  }

  update(delta, keysPressed) {
    const directionPressed = DIRECTIONS.some(
      (key) => keysPressed[key] === true
    );

    let play = "";
    if (directionPressed && this.toggleRun) {
      play = "Run";
    } else if (directionPressed) {
      play = "Walk";
    } else {
      play = "Idle";
    }

    if (this.currentAction !== play) {
      const toPlay = this.animationsMap.get(play);
      const current = this.animationsMap.get(this.currentAction);

      if (current && toPlay) {
        current.fadeOut(this.fadeDuration);
        toPlay.reset().fadeIn(this.fadeDuration).play();
        this.currentAction = play;
      }
    }
    this.mixer.update(delta); // Use dynamic collision zones from constructor
    const obstacles = this.collisionZones.map((zone) => ({
      name: zone.name,
      position: new THREE.Vector3(...zone.position),
      radius: zone.radius,
    }));

    // Debug: Log collision zones periodically
    if (Math.random() < 0.001) {
      // Log very rarely to avoid spam
      console.log("🎯 Current collision zones:", this.collisionZones);
      console.log("🎯 Converted obstacles:", obstacles);
    }

    if (this.currentAction === "Run" || this.currentAction === "Walk") {
      // Calculate towards camera direction
      const angleYCameraDirection = Math.atan2(
        this.camera.position.x - this.model.position.x,
        this.camera.position.z - this.model.position.z
      );

      // Diagonal movement angle offset
      const directionOffset = this.directionOffset(keysPressed);

      // Rotate model
      this.rotateQuarternion.setFromAxisAngle(
        this.rotateAngle,
        angleYCameraDirection + directionOffset
      );
      this.model.quaternion.rotateTowards(this.rotateQuarternion, 0.2);

      // Calculate direction
      this.camera.getWorldDirection(this.walkDirection);
      this.walkDirection.y = 0;
      this.walkDirection.normalize();
      this.walkDirection.applyAxisAngle(this.rotateAngle, directionOffset);

      // Run/walk velocity
      const velocity =
        this.currentAction === "Run" ? this.runVelocity : this.walkVelocity; // Predict next position
      const moveX = this.walkDirection.x * velocity * delta;
      const moveZ = this.walkDirection.z * velocity * delta;
      const nextX = this.model.position.x + moveX;
      const nextZ = this.model.position.z + moveZ;

      // Check collision with all obstacles
      let hasCollision = false;
      let collisionInfo = null;

      for (const obstacle of obstacles) {
        const distToObstacle = Math.sqrt(
          (nextX - obstacle.position.x) * (nextX - obstacle.position.x) +
            (nextZ - obstacle.position.z) * (nextZ - obstacle.position.z)
        );

        const currentDistToObstacle = Math.sqrt(
          (this.model.position.x - obstacle.position.x) *
            (this.model.position.x - obstacle.position.x) +
            (this.model.position.z - obstacle.position.z) *
              (this.model.position.z - obstacle.position.z)
        );

        // Check if we're approaching the obstacle or moving away from it
        const movingTowardsObstacle = distToObstacle < currentDistToObstacle;

        // Debug logging (reduced frequency)
        if (Math.random() < 0.01) {
          // Only log 1% of the time to reduce spam
          console.log(`${obstacle.name} collision check:`, {
            currentPos: { x: this.model.position.x, z: this.model.position.z },
            nextPos: { x: nextX, z: nextZ },
            obstaclePos: { x: obstacle.position.x, z: obstacle.position.z },
            currentDist: currentDistToObstacle.toFixed(2),
            nextDist: distToObstacle.toFixed(2),
            movingTowards: movingTowardsObstacle,
            isWithinRadius: distToObstacle <= obstacle.radius,
          });
        }

        // Check for collision
        if (distToObstacle <= obstacle.radius && movingTowardsObstacle) {
          hasCollision = true;
          collisionInfo = obstacle;
          break; // Stop checking other obstacles if we found a collision
        }
      }

      if (!hasCollision) {
        // No collision detected, allow movement
        this.model.position.x = nextX;
        this.model.position.z = nextZ;
        this.updateCameraTarget(moveX, moveZ);
      } else {
        // Collision detected, stop and idle
        console.log(
          `COLLISION DETECTED with ${collisionInfo.name} - character stopped`
        );

        // Trigger collision callback if provided
        if (this.onCollision && typeof this.onCollision === "function") {
          this.onCollision(collisionInfo);
        }

        if (this.currentAction !== "Idle") {
          const toPlay = this.animationsMap.get("Idle");
          const current = this.animationsMap.get(this.currentAction);
          if (current && toPlay) {
            current.fadeOut(this.fadeDuration);
            toPlay.reset().fadeIn(this.fadeDuration).play();
            this.currentAction = "Idle";
          }
        }
      }
    }
  }

  updateCameraTarget(moveX, moveZ) {
    // Move camera
    this.camera.position.x += moveX;
    this.camera.position.z += moveZ;

    // Update camera target
    this.cameraTarget.x = this.model.position.x;
    this.cameraTarget.y = this.model.position.y + 1;
    this.cameraTarget.z = this.model.position.z;
    this.orbitControl.target = this.cameraTarget;
  }

  directionOffset(keysPressed) {
    let directionOffset = 0; // w

    if (keysPressed["w"]) {
      if (keysPressed["a"]) {
        directionOffset = Math.PI / 4; // w+a
      } else if (keysPressed["d"]) {
        directionOffset = -Math.PI / 4; // w+d
      }
    } else if (keysPressed["s"]) {
      if (keysPressed["a"]) {
        directionOffset = Math.PI / 4 + Math.PI / 2; // s+a
      } else if (keysPressed["d"]) {
        directionOffset = -Math.PI / 4 - Math.PI / 2; // s+d
      } else {
        directionOffset = Math.PI; // s
      }
    } else if (keysPressed["a"]) {
      directionOffset = Math.PI / 2; // a
    } else if (keysPressed["d"]) {
      directionOffset = -Math.PI / 2; // d
    }

    return directionOffset;
  }

  // Method to update collision zones dynamically
  updateCollisionZones(newCollisionZones) {
    this.collisionZones = newCollisionZones;
    console.log("🔄 Collision zones updated:", newCollisionZones);
  }
}
