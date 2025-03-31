import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { PointMaterial } from "@react-three/drei";
import * as THREE from "three";

// Particle component that handles the actual particles
function Particles({ count = 1000 }) {
  // Create a reference to the points
  const points = useRef();

  // Generate random positions for particles
  const particlesPosition = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 15;
      positions[i3 + 1] = (Math.random() - 0.5) * 15;
      positions[i3 + 2] = (Math.random() - 0.5) * 15;
    }
    return positions;
  }, [count]);

  // Generate colors for particles
  const particlesColors = useMemo(() => {
    const colors = new Float32Array(count * 3);
    const colorPalette = [
      "#4CC9F0", // bright cyan
      "#4895EF", // bright blue
      "#4361EE", // indigo blue
      "#3F37C9", // deep blue
      "#F72585", // hot pink
      "#7209B7", // purple
      "#B5179E", // magenta
      "#560BAD", // violet
      "#480CA8", // deep purple
      "#3A0CA3", // royal blue
      "#3F37C9", // indigo
      "#4361EE", // bright indigo
      "#4CC9F0", // cyan
    ];

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const color = new THREE.Color(
        colorPalette[Math.floor(Math.random() * colorPalette.length)]
      );
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;
    }
    return colors;
  }, [count]);

  // Animation loop
  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    if (points.current) {
      // Rotate the entire point cloud
      points.current.rotation.x = time * 0.03;
      points.current.rotation.y = time * 0.02;

      // Update individual particle positions for a flowing effect
      const positions = points.current.geometry.attributes.position.array;
      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        const x = positions[i3];
        const y = positions[i3 + 1];
        const z = positions[i3 + 2];

        // Apply a sine wave movement
        positions[i3] = x + Math.sin(time * 0.2 + i * 0.01) * 0.01;
        positions[i3 + 1] = y + Math.cos(time * 0.2 + i * 0.01) * 0.01;
        positions[i3 + 2] = z + Math.sin(time * 0.2 + i * 0.02) * 0.01;
      }
      points.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particlesPosition.length / 3}
          array={particlesPosition}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particlesColors.length / 3}
          array={particlesColors}
          itemSize={3}
        />
      </bufferGeometry>
      <PointMaterial
        transparent
        vertexColors
        size={0.2}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.8}
      />
    </points>
  );
}

export function ParticleBackground() {
    return (
      <div className="fixed inset-0 -z-10">
        <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
          <Particles />
        </Canvas>
      </div>
    );
  }