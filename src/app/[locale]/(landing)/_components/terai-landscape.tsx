"use client";
import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";

interface TeraiLandscapeProps {
  opacity?: number; // Allow controlling the opacity from parent
}

const TeraiLandscape: React.FC<TeraiLandscapeProps> = ({ opacity = 1 }) => {
  // References for Three.js
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  // Check device on mount
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Three.js setup
  useEffect(() => {
    if (!mountRef.current) return;

    // Initialize Three.js scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Add fog for atmospheric depth - increased fog for better content visibility
    scene.fog = new THREE.FogExp2(0xdeeeff, 0.012); // Increased fog density

    // Camera setup - adjusted for better perspective
    const camera = new THREE.PerspectiveCamera(
      65,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );
    // Position camera based on device type
    if (isMobile) {
      camera.position.set(0, 15, 32); // Higher and further back on mobile
    } else {
      camera.position.set(0, 12, 28);
    }
    camera.lookAt(0, 0, -10);
    cameraRef.current = camera;

    // Renderer setup with higher quality settings and optimizations
    const renderer = new THREE.WebGLRenderer({
      antialias: !isMobile, // Disable antialiasing on mobile for performance
      alpha: true,
      precision: isMobile ? "mediump" : "highp", // Lower precision on mobile
      powerPreference: "high-performance",
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(
      Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2),
    );
    renderer.setClearColor(0xdeeeff, opacity); // Apply opacity from props
    renderer.outputColorSpace = THREE.SRGBColorSpace; // Better color representation

    // Add subtle shadows with optimized settings
    renderer.shadowMap.enabled = !isMobile; // Disable shadows on mobile for performance
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Enhanced lighting system
    // Base ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    // Main sunlight with optimized shadows
    const sunlight = new THREE.DirectionalLight(0xfffaf0, 1.2); // Warm sunlight
    sunlight.position.set(15, 30, 20);

    if (!isMobile) {
      sunlight.castShadow = true;
      sunlight.shadow.mapSize.width = 2048;
      sunlight.shadow.mapSize.height = 2048;
      sunlight.shadow.camera.near = 0.5;
      sunlight.shadow.camera.far = 100;
      sunlight.shadow.camera.left = -30;
      sunlight.shadow.camera.right = 30;
      sunlight.shadow.camera.top = 30;
      sunlight.shadow.camera.bottom = -30;
      sunlight.shadow.bias = -0.0003;
    }
    scene.add(sunlight);

    // Hemisphere light for more natural outdoor lighting
    const hemisphereLight = new THREE.HemisphereLight(
      0xadd8e6, // Sky color - light blue
      0x7cbe45, // Ground color - Terai green
      0.5,
    );
    scene.add(hemisphereLight);

    // Create Terai sky with gradient and clouds
    const createSky = () => {
      // Sky dome
      const skyGeometry = new THREE.SphereGeometry(500, 32, 32);
      const vertexShader = `
        varying vec3 vWorldPosition;
        void main() {
          vec4 worldPosition = modelMatrix * vec4(position, 1.0);
          vWorldPosition = worldPosition.xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `;
      const fragmentShader = `
        uniform vec3 topColor;
        uniform vec3 bottomColor;
        uniform float offset;
        uniform float exponent;
        varying vec3 vWorldPosition;
        void main() {
          float h = normalize(vWorldPosition + offset).y;
          gl_FragColor = vec4(mix(bottomColor, topColor, max(pow(max(h, 0.0), exponent), 0.0)), 1.0);
        }
      `;

      const skyMaterial = new THREE.ShaderMaterial({
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        uniforms: {
          topColor: { value: new THREE.Color(0x0077ff) },
          bottomColor: { value: new THREE.Color(0xdeeeff) },
          offset: { value: 33 },
          exponent: { value: 0.7 },
        },
        side: THREE.BackSide,
      });

      const sky = new THREE.Mesh(skyGeometry, skyMaterial);
      scene.add(sky);
      return sky;
    };

    const sky = createSky();

    // Create enhanced terrain with better textures and details
    const createTerrain = () => {
      // Smaller terrain plane with a more focused area
      const resolution = isMobile ? 100 : 200;
      const terrainSize = 100; // Reduced from 150 to create a more contained area
      const groundGeometry = new THREE.PlaneGeometry(
        terrainSize,
        terrainSize,
        resolution,
        resolution,
      );

      // Create realistic terrain variations for Terai region
      const positions = groundGeometry.attributes
        .position as THREE.BufferAttribute;

      // Use multiple noise frequencies for more natural terrain but flatten edges
      for (let i = 0; i < positions.count; i++) {
        const x = positions.getX(i);
        const y = positions.getY(i);

        // Calculate distance from center (normalized to 0-1 range)
        const distanceFromCenter =
          Math.sqrt(x * x + y * y) / (terrainSize * 0.5);
        // Edge falloff factor - terrain gradually flattens toward edges
        const edgeFalloff = Math.max(
          0,
          1 - Math.pow(distanceFromCenter * 1.2, 3),
        );

        // Combine multiple frequencies for more natural terrain
        let elevation = 0;

        // Apply terrain features only within the contained area
        if (distanceFromCenter < 0.8) {
          // Large-scale gentle undulations
          elevation += 0.15 * Math.sin(x * 0.02) * Math.sin(y * 0.02);

          // Medium-scale terrain features
          elevation += 0.08 * Math.cos(x * 0.1 + y * 0.1);

          // Small terrain details - less pronounced on mobile for performance
          if (!isMobile) {
            elevation += 0.02 * Math.sin(x * 0.2) * Math.cos(y * 0.3);
            elevation += 0.01 * Math.cos(x * 0.4 + y * 0.5);
          }

          // Apply the edge falloff
          elevation *= edgeFalloff;
        }

        positions.setZ(i, elevation);
      }

      groundGeometry.computeVertexNormals();

      // Create texture loader for ground materials
      const textureLoader = new THREE.TextureLoader();

      // Load and configure textures - use lightweight textures for mobile
      let groundMaterial;

      if (isMobile) {
        // Simpler material for mobile
        const greenShades = [
          new THREE.Color(0x8ed18e), // Light fertile green
          new THREE.Color(0x7cbe45), // Middle green
          new THREE.Color(0x5a9a4a), // Darker green
        ];

        // Add vertex colors for simple coloring
        const colors = [];
        for (let i = 0; i < positions.count; i++) {
          const x = positions.getX(i);
          const y = positions.getY(i);
          const z = positions.getZ(i);

          // Mix colors based on position and height
          const mixRatio =
            (Math.sin(x * 0.05) * 0.5 + 0.5) * (Math.cos(y * 0.05) * 0.5 + 0.5);
          const color = new THREE.Color().lerpColors(
            greenShades[0],
            greenShades[1],
            mixRatio,
          );

          colors.push(color.r, color.g, color.b);
        }

        groundGeometry.setAttribute(
          "color",
          new THREE.Float32BufferAttribute(colors, 3),
        );

        groundMaterial = new THREE.MeshStandardMaterial({
          vertexColors: true,
          roughness: 0.9,
          metalness: 0.1,
        });
      } else {
        // High-quality material with textures for desktop
        // Create procedural textures
        const canvas = document.createElement("canvas");
        canvas.width = 1024;
        canvas.height = 1024;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          // Create terrain texture gradient
          const gradient = ctx.createLinearGradient(0, 0, 1024, 1024);
          gradient.addColorStop(0, "#8ed18e");
          gradient.addColorStop(0.3, "#7cbe45");
          gradient.addColorStop(0.6, "#5a9a4a");
          gradient.addColorStop(1, "#3e7b3e");

          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, 1024, 1024);

          // Add some noise texture
          for (let i = 0; i < 10000; i++) {
            const x = Math.random() * 1024;
            const y = Math.random() * 1024;
            const size = Math.random() * 3 + 1;
            ctx.globalAlpha = Math.random() * 0.07;
            ctx.fillStyle = Math.random() > 0.5 ? "#ffffff" : "#000000";
            ctx.fillRect(x, y, size, size);
          }
        }

        const terrainTexture = new THREE.CanvasTexture(canvas);
        terrainTexture.wrapS = terrainTexture.wrapT = THREE.RepeatWrapping;
        terrainTexture.repeat.set(5, 5);

        groundMaterial = new THREE.MeshStandardMaterial({
          map: terrainTexture,
          roughness: 0.8,
          metalness: 0.1,
          roughnessMap: terrainTexture,
        });
      }

      const ground = new THREE.Mesh(groundGeometry, groundMaterial);
      ground.rotation.x = -Math.PI / 2;
      ground.position.y = -2;
      if (!isMobile) ground.receiveShadow = true;
      scene.add(ground);

      // Add a terrain edge/boundary to create a clean cutoff
      const createTerrainBoundary = () => {
        if (isMobile) return; // Skip on mobile for performance

        const edgeRadius = terrainSize * 0.5 * 0.85; // Slightly smaller than actual terrain
        const edgeHeight = 0.2;
        const edgeSegments = 64;

        const edgeGeometry = new THREE.CylinderGeometry(
          edgeRadius,
          edgeRadius,
          edgeHeight,
          edgeSegments,
          1,
          true, // Open cylinder (no top/bottom)
        );

        const edgeMaterial = new THREE.MeshStandardMaterial({
          color: 0x5a9a4a, // Match terrain color
          flatShading: true,
          roughness: 0.9,
          side: THREE.DoubleSide,
        });

        const edge = new THREE.Mesh(edgeGeometry, edgeMaterial);
        edge.rotation.x = Math.PI / 2;
        edge.position.y = -2 - edgeHeight / 2;
        scene.add(edge);

        return edge;
      };

      const terrainEdge = createTerrainBoundary();

      return { ground, terrainEdge };
    };

    const terrain = createTerrain();

    // Create enhanced vegetation with more variety and better distribution
    const createVegetation = () => {
      // Tree type 1 - taller trees (like Sal or similar)
      const tallTree = () => {
        const group = new THREE.Group();

        // Tree trunk with better geometry
        const trunkGeometry = new THREE.CylinderGeometry(0.15, 0.2, 2, 8);
        const trunkMaterial = new THREE.MeshStandardMaterial({
          color: 0x8b4513, // Brown
          roughness: 0.9,
        });
        const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
        if (!isMobile) trunk.castShadow = true;
        trunk.position.y = 1;
        group.add(trunk);

        // Tree foliage - multiple layers for more realistic appearance
        if (isMobile) {
          // Simple foliage for mobile
          const foliageGeometry = new THREE.ConeGeometry(0.8, 2.5, 8);
          const foliageMaterial = new THREE.MeshStandardMaterial({
            color: 0x4a7c59, // Dark green
            roughness: 0.8,
          });
          const foliage = new THREE.Mesh(foliageGeometry, foliageMaterial);
          if (!isMobile) foliage.castShadow = true;
          foliage.position.y = 2.7;
          group.add(foliage);
        } else {
          // Layered foliage for desktop
          const foliageColors = [
            0x4a7c59, // Dark green
            0x5a8c69, // Medium green
            0x6a9c79, // Light green
          ];

          for (let i = 0; i < 3; i++) {
            const size = 0.8 - i * 0.15;
            const height = 2.5 - i * 0.5;
            const yOffset = 2.7 + i * 0.4;

            const foliageGeometry = new THREE.ConeGeometry(size, height, 8);
            const foliageMaterial = new THREE.MeshStandardMaterial({
              color: foliageColors[i],
              roughness: 0.8,
            });
            const foliage = new THREE.Mesh(foliageGeometry, foliageMaterial);
            foliage.castShadow = true;
            foliage.position.y = yOffset;
            group.add(foliage);
          }
        }

        return group;
      };

      // Tree type 2 - smaller bushes and shrubs
      const shrub = () => {
        const group = new THREE.Group();

        // Small trunk
        const trunkGeometry = new THREE.CylinderGeometry(0.05, 0.07, 0.5, 8);
        const trunkMaterial = new THREE.MeshStandardMaterial({
          color: 0x8b4513,
          roughness: 0.9,
        });
        const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
        if (!isMobile) trunk.castShadow = true;
        trunk.position.y = 0.25;
        group.add(trunk);

        // Foliage as multiple spheres for more natural look
        const foliageMaterial = new THREE.MeshStandardMaterial({
          color: 0x65a30d,
          roughness: 0.8,
        });

        // Simple or complex based on device
        if (isMobile) {
          // Single sphere for mobile
          const foliageGeometry = new THREE.SphereGeometry(0.3, 8, 8);
          const foliage = new THREE.Mesh(foliageGeometry, foliageMaterial);
          if (!isMobile) foliage.castShadow = true;
          foliage.position.y = 0.5;
          group.add(foliage);
        } else {
          // Multiple overlapping spheres for desktop
          const spherePositions = [
            { x: 0, y: 0.5, z: 0, r: 0.3 },
            { x: 0.15, y: 0.55, z: 0.1, r: 0.25 },
            { x: -0.1, y: 0.6, z: -0.1, r: 0.2 },
            { x: 0, y: 0.7, z: 0, r: 0.2 },
          ];

          spherePositions.forEach((pos) => {
            const foliageGeometry = new THREE.SphereGeometry(pos.r, 8, 8);
            const foliage = new THREE.Mesh(foliageGeometry, foliageMaterial);
            foliage.castShadow = true;
            foliage.position.set(pos.x, pos.y, pos.z);
            group.add(foliage);
          });
        }

        return group;
      };

      // Tree type 3 - flowering small trees (to add color)
      const floweringTree = () => {
        if (isMobile) return shrub(); // Fallback to shrub on mobile

        const group = new THREE.Group();

        // Trunk
        const trunkGeometry = new THREE.CylinderGeometry(0.08, 0.1, 1.2, 8);
        const trunkMaterial = new THREE.MeshStandardMaterial({
          color: 0x8b4513,
          roughness: 0.9,
        });
        const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
        trunk.castShadow = true;
        trunk.position.y = 0.6;
        group.add(trunk);

        // Foliage with flowers
        const foliageColors = [
          0x65a30d, // Green
          0xf472b6, // Pink (flowers)
          0xff7f50, // Orange (flowers)
        ];

        // Create a base sphere of leaves
        const baseGeometry = new THREE.SphereGeometry(0.5, 10, 10);
        const baseMaterial = new THREE.MeshStandardMaterial({
          color: foliageColors[0],
          roughness: 0.8,
        });
        const basefoliage = new THREE.Mesh(baseGeometry, baseMaterial);
        basefoliage.castShadow = true;
        basefoliage.position.y = 1.4;
        group.add(basefoliage);

        // Add flower clusters
        const flowerPositions = [];
        for (let i = 0; i < 15; i++) {
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.random() * Math.PI;
          const radius = 0.5;

          const x = radius * Math.sin(phi) * Math.cos(theta);
          const y = radius * Math.cos(phi) + 1.4; // Center at foliage position
          const z = radius * Math.sin(phi) * Math.sin(theta);

          flowerPositions.push({ x, y, z });
        }

        flowerPositions.forEach((pos) => {
          const flowerColor =
            Math.random() > 0.5 ? foliageColors[1] : foliageColors[2];
          const flowerGeometry = new THREE.SphereGeometry(0.08, 6, 6);
          const flowerMaterial = new THREE.MeshStandardMaterial({
            color: flowerColor,
            roughness: 0.7,
            emissive: flowerColor,
            emissiveIntensity: 0.2,
          });
          const flower = new THREE.Mesh(flowerGeometry, flowerMaterial);
          flower.position.set(pos.x, pos.y, pos.z);
          group.add(flower);
        });

        return group;
      };

      // Add vegetation with intelligent distribution
      const vegetationCount = isMobile ? 60 : 150;
      const vegetationObjects = [];

      // Create biome-based distribution zones
      const zones = [
        { x: 0, z: 0, radius: 100, type: "mixed" }, // General mixed zone
        { x: -30, z: -30, radius: 25, type: "forest" }, // Forest patch
        { x: 40, z: 20, radius: 20, type: "meadow" }, // Open meadow
      ];

      const getTreeType = (x: any, z: any) => {
        // Find which zone this position is in
        for (const zone of zones) {
          const distance = Math.sqrt((x - zone.x) ** 2 + (z - zone.z) ** 2);

          if (distance <= zone.radius) {
            const rand = Math.random();

            switch (zone.type) {
              case "forest":
                return rand > 0.3
                  ? tallTree()
                  : rand > 0.1
                    ? shrub()
                    : floweringTree();
              case "meadow":
                return rand > 0.8
                  ? tallTree()
                  : rand > 0.4
                    ? floweringTree()
                    : shrub();
              case "mixed":
              default:
                return rand > 0.6
                  ? tallTree()
                  : rand > 0.3
                    ? shrub()
                    : floweringTree();
            }
          }
        }

        // Default to mixed
        const rand = Math.random();
        return rand > 0.6 ? tallTree() : rand > 0.3 ? shrub() : floweringTree();
      };

      for (let i = 0; i < vegetationCount; i++) {
        // Position vegetation with natural clustering and zones
        let x, z;

        if (Math.random() > 0.3) {
          // Create realistic clusters
          const clusterCenterX = (Math.random() - 0.5) * 80; // Reduced from 100
          const clusterCenterZ = (Math.random() - 0.5) * 80; // Reduced from 100
          const clusterRadius = 5 + Math.random() * 15;
          const angle = Math.random() * Math.PI * 2;
          const distance = Math.random() * clusterRadius;

          x = clusterCenterX + Math.cos(angle) * distance;
          z = clusterCenterZ + Math.sin(angle) * distance;
        } else {
          // Some individual trees
          x = (Math.random() - 0.5) * 90; // Reduced from 120
          z = (Math.random() - 0.5) * 90; // Reduced from 120
        }

        // Only add vegetation inside the terrain boundary
        const distanceFromCenter = Math.sqrt(x * x + z * z);
        if (distanceFromCenter < 45) {
          // Keep vegetation within bounds
          const vegetationType = getTreeType(x, z);

          vegetationType.position.set(x, -1.5, z);

          // Varied scale for realism
          const baseScale = 0.5 + Math.random() * 1;
          const scaleX = baseScale * (0.9 + Math.random() * 0.2);
          const scaleY = baseScale * (0.9 + Math.random() * 0.2);
          const scaleZ = baseScale * (0.9 + Math.random() * 0.2);
          vegetationType.scale.set(scaleX, scaleY, scaleZ);

          // Random rotation
          vegetationType.rotation.y = Math.random() * Math.PI * 2;

          scene.add(vegetationType);
          vegetationObjects.push(vegetationType);
        }
      }

      return vegetationObjects;
    };

    const vegetation = createVegetation();

    // Create a sun with better visual effects but less intensity
    const createSunWithEffects = () => {
      // Main sun sphere
      const sunGeometry = new THREE.SphereGeometry(5, 32, 32);
      const sunMaterial = new THREE.MeshBasicMaterial({
        color: 0xffeb80,
        transparent: true,
        opacity: 0.8, // Reduced opacity
      });
      const sun = new THREE.Mesh(sunGeometry, sunMaterial);
      sun.position.set(20, 30, -50);
      scene.add(sun);

      // Multiple layers of glow for more realistic effect
      const glowColors = [
        { color: 0xfffacd, size: 6, opacity: 0.3 }, // Inner light yellow
        { color: 0xfff9c4, size: 8, opacity: 0.2 }, // Middle pale yellow
        { color: 0xfff8e1, size: 12, opacity: 0.1 }, // Outer white-yellow
      ];

      const glowLayers: any[] = [];

      glowColors.forEach((glow) => {
        const sunGlowGeometry = new THREE.SphereGeometry(glow.size, 32, 32);
        const sunGlowMaterial = new THREE.MeshBasicMaterial({
          color: glow.color,
          transparent: true,
          opacity: glow.opacity,
          side: THREE.BackSide,
        });
        const sunGlow = new THREE.Mesh(sunGlowGeometry, sunGlowMaterial);
        sunGlow.position.copy(sun.position);
        scene.add(sunGlow);
        glowLayers.push(sunGlow);
      });

      return { sun, glowLayers };
    };

    const sky2 = createSunWithEffects();

    // Create birds flying in the distance
    const createBirds = () => {
      const birdsGroup = new THREE.Group();
      const birdCount = isMobile ? 8 : 20;

      // Simple but effective bird geometry
      for (let i = 0; i < birdCount; i++) {
        const birdGeometry = new THREE.BufferGeometry();

        // Create a V shape for the bird
        const vertices = new Float32Array([
          -0.5,
          0,
          0, // left wing
          0,
          0,
          0.3, // body front
          0.5,
          0,
          0, // right wing
        ]);

        birdGeometry.setAttribute(
          "position",
          new THREE.BufferAttribute(vertices, 3),
        );
        birdGeometry.computeVertexNormals();

        const birdMaterial = new THREE.MeshBasicMaterial({
          color: 0x000000, // Black silhouette
          side: THREE.DoubleSide,
        });

        const bird = new THREE.Mesh(birdGeometry, birdMaterial);

        // Position birds in more varied ways - some in groups, some alone
        const isInFlock = Math.random() > 0.3;
        let birdX, birdY, birdZ;

        if (isInFlock) {
          // Create a flock center
          const flockCenterX = (Math.random() - 0.5) * 80;
          const flockCenterY = 20 + Math.random() * 15;
          const flockCenterZ = (Math.random() - 0.5) * 80;

          // Position bird near the flock center
          birdX = flockCenterX + (Math.random() - 0.5) * 15;
          birdY = flockCenterY + (Math.random() - 0.5) * 3;
          birdZ = flockCenterZ + (Math.random() - 0.5) * 15;
        } else {
          // Solo bird
          birdX = (Math.random() - 0.5) * 120;
          birdY = 15 + Math.random() * 20;
          birdZ = (Math.random() - 0.5) * 120;
        }

        bird.position.set(birdX, birdY, birdZ);

        // Random scale for size variation
        const birdScale = 0.3 + Math.random() * 0.3;
        bird.scale.set(birdScale, birdScale, birdScale);

        // Save animation parameters
        bird.userData = {
          // Random animation parameters
          speed: 0.05 + Math.random() * 0.15,
          amplitude: 10 + Math.random() * 20,
          frequency: 0.02 + Math.random() * 0.03,
          phase: Math.random() * Math.PI * 2,
          initialY: bird.position.y,
          initialZ: bird.position.z,
          inFlock: isInFlock,
          flapSpeed: 5 + Math.random() * 10,
        };

        birdsGroup.add(bird);
      }

      scene.add(birdsGroup);
      return birdsGroup;
    };

    const birds = createBirds();

    // Add some distant clouds
    const createClouds = () => {
      if (isMobile) return []; // Skip on mobile

      const clouds = [];
      const cloudCount = 8;

      for (let i = 0; i < cloudCount; i++) {
        // Create cloud group (multiple spheres clustered)
        const cloudGroup = new THREE.Group();

        // Random cloud position in the sky
        const cloudX = (Math.random() - 0.5) * 130;
        const cloudY = 25 + Math.random() * 20;
        const cloudZ = -60 - Math.random() * 30; // Behind mountains

        cloudGroup.position.set(cloudX, cloudY, cloudZ);

        // Cloud characteristics
        const sphereCount = 3 + Math.floor(Math.random() * 5);
        const cloudSize = 3 + Math.random() * 5;

        // Cloud material - soft white with transparency
        const cloudMaterial = new THREE.MeshStandardMaterial({
          color: 0xffffff,
          transparent: true,
          opacity: 0.7,
          roughness: 1,
          metalness: 0,
        });

        // Create multiple spheres for a puffy look
        for (let j = 0; j < sphereCount; j++) {
          const sphereSize = (0.6 + Math.random() * 0.6) * cloudSize;
          const sphereGeometry = new THREE.SphereGeometry(sphereSize, 8, 8);
          const cloudPiece = new THREE.Mesh(sphereGeometry, cloudMaterial);

          // Position sphere relative to cloud center
          const offsetX = (Math.random() - 0.5) * cloudSize;
          const offsetY = (Math.random() - 0.5) * cloudSize * 0.3;
          const offsetZ = (Math.random() - 0.5) * cloudSize;

          cloudPiece.position.set(offsetX, offsetY, offsetZ);
          cloudGroup.add(cloudPiece);
        }

        // Store cloud data for animation
        cloudGroup.userData = {
          speed: 0.02 + Math.random() * 0.03,
          direction: Math.random() > 0.5 ? 1 : -1,
        };

        scene.add(cloudGroup);
        clouds.push(cloudGroup);
      }

      return clouds;
    };

    const clouds = createClouds();

    // Add flat ground plane beyond the terrain edge for a clean background
    const createBackgroundPlane = () => {
      const planeSize = 500;
      const planeGeometry = new THREE.PlaneGeometry(planeSize, planeSize);
      const planeMaterial = new THREE.MeshStandardMaterial({
        color: 0x5a9a4a, // Match terrain edge color
        roughness: 1.0,
        metalness: 0.0,
      });

      const plane = new THREE.Mesh(planeGeometry, planeMaterial);
      plane.rotation.x = -Math.PI / 2;
      plane.position.y = -2.1; // Slightly below terrain
      scene.add(plane);

      return plane;
    };

    const backgroundPlane = createBackgroundPlane();

    // Animation loop with optimized performance
    let frameId: number;
    const clock = new THREE.Clock();

    // Use a more efficient animation loop
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      // Ensure all refs are valid
      if (!rendererRef.current || !sceneRef.current || !cameraRef.current)
        return;

      // Animate sun glow
      if (sky2.glowLayers) {
        sky2.glowLayers.forEach((glow, i) => {
          const pulseSpeed = 0.5 + i * 0.2;
          const pulseAmount = 0.03 - i * 0.005;
          const scale = 1 + pulseAmount * Math.sin(time * pulseSpeed);
          glow.scale.set(scale, scale, scale);
        });
      }

      // Animate birds
      birds.children.forEach((bird: THREE.Object3D) => {
        const birdData = bird.userData;

        // Different behaviors based on if in flock
        if (birdData.inFlock) {
          // Birds in a flock move together in circular paths
          const radius = birdData.amplitude;
          const circleX =
            Math.sin(time * birdData.frequency + birdData.phase) * radius;
          const circleZ =
            Math.cos(time * birdData.frequency + birdData.phase) * radius;

          bird.position.x += circleX * 0.01;
          bird.position.z += circleZ * 0.01;

          // Face direction of movement
          bird.rotation.y = Math.atan2(circleX, circleZ);
        } else {
          // Solo birds fly straight and reset when they leave the scene
          bird.position.x += birdData.speed * birdData.direction;

          // Reset position if bird flies too far
          if (Math.abs(bird.position.x) > 80) {
            bird.position.x = -80 * Math.sign(bird.position.x);
            bird.position.z = (Math.random() - 0.5) * 100;
          }
        }

        // Small vertical movement for all birds
        bird.position.y =
          birdData.initialY + Math.sin(time * 0.7 + birdData.phase) * 0.3;

        // Wing flapping animation
        bird.rotation.z = Math.sin(time * birdData.flapSpeed) * 0.2;
      });

      // Animate vegetation
      vegetation.forEach((plant) => {
        // Only apply to taller objects for efficiency
        if (plant.scale.y > 0.8) {
          // Subtle swaying motion
          plant.rotation.x =
            Math.sin(time * 0.3 + plant.position.x * 0.05) * 0.01;
          plant.rotation.z =
            Math.sin(time * 0.2 + plant.position.z * 0.05) * 0.01;
        }
      });

      // Animate clouds
      clouds.forEach((cloud) => {
        // Move clouds slowly across the sky
        cloud.position.x += cloud.userData.speed * cloud.userData.direction;

        // Wrap clouds around when they go off-screen
        if (cloud.position.x > 100) {
          cloud.position.x = -100;
          cloud.position.z = -60 - Math.random() * 30;
        } else if (cloud.position.x < -100) {
          cloud.position.x = 100;
          cloud.position.z = -60 - Math.random() * 30;
        }
      });

      // Render scene
      rendererRef.current.render(sceneRef.current, cameraRef.current);
    };

    animate();

    // Handle window resize - simple, straightforward approach
    const handleResize = () => {
      if (!cameraRef.current || !rendererRef.current) return;

      const camera = cameraRef.current;
      const renderer = rendererRef.current;

      // Update camera aspect ratio
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();

      // Resize renderer
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    // Add event listener for resize
    window.addEventListener("resize", handleResize);

    // Clean up resources on unmount
    return () => {
      if (frameId) {
        cancelAnimationFrame(frameId);
      }

      window.removeEventListener("resize", handleResize);

      if (mountRef.current && rendererRef.current) {
        mountRef.current.removeChild(rendererRef.current.domElement);
      }

      // Dispose of all materials, geometries, and textures
      if (sceneRef.current) {
        sceneRef.current.traverse((object) => {
          if (object instanceof THREE.Mesh) {
            if (object.geometry) {
              object.geometry.dispose();
            }

            if (object.material) {
              if (Array.isArray(object.material)) {
                object.material.forEach((material) => material.dispose());
              } else {
                if (object.material.map) object.material.map.dispose();
                object.material.dispose();
              }
            }
          }
        });

        sceneRef.current.clear();
      }

      // Clear renderer
      if (rendererRef.current) {
        rendererRef.current.dispose();
        rendererRef.current = null;
      }
    };
  }, [isMobile, opacity]);

  return <div ref={mountRef} className="absolute inset-0 z-0" />;
};

export default TeraiLandscape;
