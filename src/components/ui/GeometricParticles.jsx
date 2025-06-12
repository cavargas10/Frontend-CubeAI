import { useRef, useEffect, useState, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { OrbitControls } from "@react-three/drei";

const SHAPES = {
  CUBE: "cube",
  SPHERE: "sphere",
  PYRAMID: "pyramid",
  TORUS: "torus",
  WAVE: "wave",
  STAR: "star",
  SPIRAL: "spiral",
  CYLINDER: "cylinder",
  CONE: "cone",
  HEART: "heart",
};

function ShapeShiftingParticles({ count = 1500 }) {
  const points = useRef(null);
  const { viewport } = useThree();

  const [currentShape, setCurrentShape] = useState(SHAPES.CUBE);
  const [nextShape, setNextShape] = useState(SHAPES.SPHERE);
  const [transitionProgress, setTransitionProgress] = useState(0);
  const [transitionDuration, setTransitionDuration] = useState(3);

  const shapePositions = useMemo(() => {
    const positions = {
      [SHAPES.CUBE]: new Float32Array(count * 3),
      [SHAPES.SPHERE]: new Float32Array(count * 3),
      [SHAPES.PYRAMID]: new Float32Array(count * 3),
      [SHAPES.TORUS]: new Float32Array(count * 3),
      [SHAPES.WAVE]: new Float32Array(count * 3),
      [SHAPES.STAR]: new Float32Array(count * 3),
      [SHAPES.SPIRAL]: new Float32Array(count * 3),
      [SHAPES.CYLINDER]: new Float32Array(count * 3),
      [SHAPES.CONE]: new Float32Array(count * 3),
      [SHAPES.HEART]: new Float32Array(count * 3),
    };

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const side = Math.floor(Math.random() * 6);
      const size = 2.5;

      if (side === 0) {
        positions[SHAPES.CUBE][i3] = (Math.random() * 2 - 1) * size;
        positions[SHAPES.CUBE][i3 + 1] = (Math.random() * 2 - 1) * size;
        positions[SHAPES.CUBE][i3 + 2] = size;
      } else if (side === 1) {
        positions[SHAPES.CUBE][i3] = (Math.random() * 2 - 1) * size;
        positions[SHAPES.CUBE][i3 + 1] = (Math.random() * 2 - 1) * size;
        positions[SHAPES.CUBE][i3 + 2] = -size;
      } else if (side === 2) {
        positions[SHAPES.CUBE][i3] = (Math.random() * 2 - 1) * size;
        positions[SHAPES.CUBE][i3 + 1] = size;
        positions[SHAPES.CUBE][i3 + 2] = (Math.random() * 2 - 1) * size;
      } else if (side === 3) {
        positions[SHAPES.CUBE][i3] = (Math.random() * 2 - 1) * size;
        positions[SHAPES.CUBE][i3 + 1] = -size;
        positions[SHAPES.CUBE][i3 + 2] = (Math.random() * 2 - 1) * size;
      } else if (side === 4) {
        positions[SHAPES.CUBE][i3] = size;
        positions[SHAPES.CUBE][i3 + 1] = (Math.random() * 2 - 1) * size;
        positions[SHAPES.CUBE][i3 + 2] = (Math.random() * 2 - 1) * size;
      } else {
        positions[SHAPES.CUBE][i3] = -size;
        positions[SHAPES.CUBE][i3 + 1] = (Math.random() * 2 - 1) * size;
        positions[SHAPES.CUBE][i3 + 2] = (Math.random() * 2 - 1) * size;
      }
    }

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const radius = 3;
      const u = Math.random();
      const v = Math.random();
      const theta = 2 * Math.PI * u;
      const phi = Math.acos(2 * v - 1);

      positions[SHAPES.SPHERE][i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[SHAPES.SPHERE][i3 + 1] =
        radius * Math.sin(phi) * Math.sin(theta);
      positions[SHAPES.SPHERE][i3 + 2] = radius * Math.cos(phi);
    }

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const side = Math.floor(Math.random() * 5);
      const size = 3;

      if (side === 0) {
        positions[SHAPES.PYRAMID][i3] = (Math.random() * 2 - 1) * size;
        positions[SHAPES.PYRAMID][i3 + 1] = -size;
        positions[SHAPES.PYRAMID][i3 + 2] = (Math.random() * 2 - 1) * size;
      } else {
        const baseX = (Math.random() * 2 - 1) * size;
        const baseZ = (Math.random() * 2 - 1) * size;
        const t = Math.random();
        positions[SHAPES.PYRAMID][i3] = baseX * (1 - t);
        positions[SHAPES.PYRAMID][i3 + 1] = -size * (1 - t) + size * 1.5 * t;
        positions[SHAPES.PYRAMID][i3 + 2] = baseZ * (1 - t);
      }
    }

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const R = 2.5;
      const r = 0.8;
      const u = Math.random() * Math.PI * 2;
      const v = Math.random() * Math.PI * 2;
      positions[SHAPES.TORUS][i3] = (R + r * Math.cos(v)) * Math.cos(u);
      positions[SHAPES.TORUS][i3 + 1] = r * Math.sin(v);
      positions[SHAPES.TORUS][i3 + 2] = (R + r * Math.cos(v)) * Math.sin(u);
    }

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const gridSize = Math.sqrt(count);
      const gridX = (i % gridSize) / gridSize - 0.5;
      const gridZ = Math.floor(i / gridSize) / gridSize - 0.5;

      positions[SHAPES.WAVE][i3] = gridX * 6;
      positions[SHAPES.WAVE][i3 + 1] = 0;
      positions[SHAPES.WAVE][i3 + 2] = gridZ * 6;
    }

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const numPoints = 5;
      const outerRadius = 3;
      const innerRadius = 1.5;

      const angle = Math.random() * Math.PI * 2;

      const isOuter = Math.random() > 0.5;
      const radius = isOuter ? outerRadius : innerRadius;

      positions[SHAPES.STAR][i3] = radius * Math.cos(angle);
      positions[SHAPES.STAR][i3 + 1] = (Math.random() * 2 - 1) * 0.5;
      positions[SHAPES.STAR][i3 + 2] = radius * Math.sin(angle);
    }

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      const t = i / count;
      const angle = t * Math.PI * 10;
      const radius = 0.5 + t * 2.5;

      positions[SHAPES.SPIRAL][i3] = radius * Math.cos(angle);
      positions[SHAPES.SPIRAL][i3 + 1] = t * 5 - 2.5;
      positions[SHAPES.SPIRAL][i3 + 2] = radius * Math.sin(angle);
    }

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const radius = 2;
      const height = 4;

      const angle = Math.random() * Math.PI * 2;

      const y = ((Math.random() * 2 - 1) * height) / 2;

      positions[SHAPES.CYLINDER][i3] = radius * Math.cos(angle);
      positions[SHAPES.CYLINDER][i3 + 1] = y;
      positions[SHAPES.CYLINDER][i3 + 2] = radius * Math.sin(angle);
    }

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const baseRadius = 2.5;
      const height = 4;

      const t = Math.random();

      const radius = baseRadius * (1 - t);

      const angle = Math.random() * Math.PI * 2;

      positions[SHAPES.CONE][i3] = radius * Math.cos(angle);
      positions[SHAPES.CONE][i3 + 1] = t * height - height / 2;
      positions[SHAPES.CONE][i3 + 2] = radius * Math.sin(angle);
    }

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      const u = Math.random() * Math.PI * 2;
      const v = Math.random() * Math.PI;
      const scale = 2.5;

      const x = scale * Math.pow(Math.sin(u), 3);
      const y =
        scale *
        ((13 * Math.cos(v)) / 16 -
          (5 * Math.cos(2 * v)) / 16 -
          (2 * Math.cos(3 * v)) / 16 -
          Math.cos(4 * v) / 16);
      const z = scale * (Math.sin(v) * Math.pow(Math.cos(u), 3));

      positions[SHAPES.HEART][i3] = x;
      positions[SHAPES.HEART][i3 + 1] = y;
      positions[SHAPES.HEART][i3 + 2] = z;
    }

    return positions;
  }, [count]);

  const particlesColors = useMemo(() => {
    const colors = new Float32Array(count * 3);

    const colorPalette = [
      "#4CC9F0",
      "#4895EF",
      "#4361EE",
      "#3F37C9",
      "#7209B7",
      "#B5179E",
      "#F72585",
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

  const currentPositions = useRef(new Float32Array(count * 3));

  useEffect(() => {
    currentPositions.current = new Float32Array(shapePositions[currentShape]);
  }, [currentShape, shapePositions, count]);

  useEffect(() => {
    const shapes = Object.values(SHAPES);
    const interval = setInterval(() => {
      setCurrentShape(nextShape);
      let newShape;
      do {
        newShape = shapes[Math.floor(Math.random() * shapes.length)];
      } while (newShape === nextShape);
      setNextShape(newShape);
      setTransitionProgress(0);
    }, transitionDuration * 1000);

    return () => clearInterval(interval);
  }, [nextShape, transitionDuration]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    if (points.current) {
      setTransitionProgress((prev) => Math.min(prev + 0.005, 1));

      const currentPos = shapePositions[currentShape];
      const nextPos = shapePositions[nextShape];

      const positions = points.current.geometry.attributes.position.array;

      for (let i = 0; i < count; i++) {
        const i3 = i * 3;

        let targetX =
          currentPos[i3] * (1 - transitionProgress) +
          nextPos[i3] * transitionProgress;
        let targetY =
          currentPos[i3 + 1] * (1 - transitionProgress) +
          nextPos[i3 + 1] * transitionProgress;
        let targetZ =
          currentPos[i3 + 2] * (1 - transitionProgress) +
          nextPos[i3 + 2] * transitionProgress;

        if (nextShape === SHAPES.WAVE) {
          const x = nextPos[i3];
          const z = nextPos[i3 + 2];
          const waveHeight =
            Math.sin(x * 0.5 + time) * Math.cos(z * 0.5 + time) * 1.5;
          targetY =
            targetY * (1 - transitionProgress) +
            (nextPos[i3 + 1] + waveHeight) * transitionProgress;
        }

        if (nextShape === SHAPES.SPIRAL) {
          const angle = time * 0.5;
          const x = targetX;
          const z = targetZ;
          const newX = x * Math.cos(angle) - z * Math.sin(angle);
          const newZ = x * Math.sin(angle) + z * Math.cos(angle);
          targetX = newX;
          targetZ = newZ;
        }

        if (nextShape === SHAPES.HEART) {
          const pulseFactor = 1 + Math.sin(time * 2) * 0.1 * transitionProgress;
          targetX *= pulseFactor;
          targetY *= pulseFactor;
          targetZ *= pulseFactor;
        }

        positions[i3] = targetX;
        positions[i3 + 1] = targetY;
        positions[i3 + 2] = targetZ;
      }

      points.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={currentPositions.current}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={particlesColors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        sizeAttenuation={true}
        vertexColors
        transparent
        opacity={0.8}
        depthWrite={false}
      />
    </points>
  );
}

export function GeometricParticles() {
  return (
    <div className="absolute inset-0">
      <Canvas camera={{ position: [0, 0, 7], fov: 60 }}>
        <ambientLight intensity={0.7} />
        <ShapeShiftingParticles />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          rotateSpeed={0.5}
          autoRotate={true}
          autoRotateSpeed={0.5}
        />
      </Canvas>
    </div>
  );
}
