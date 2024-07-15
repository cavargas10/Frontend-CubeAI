import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import { Model } from "./Model";
import { Suspense } from "react";
import { HDREnvironment } from "./HDREnvironment";

export const Texto3DResult = ({ prediction_text3d_result }) => {
  return (
    <div className="h-96  ">
      <Canvas camera={{ position: [0, 0, 1.7] }}>
        <Suspense fallback={null}>
          {prediction_text3d_result && prediction_text3d_result.obj_model && (
            <Model url={prediction_text3d_result.obj_model} />
          )}
          <OrbitControls minDistance={0.2} maxDistance={0.9} />
          <ambientLight intensity={1} />
          <HDREnvironment />
        </Suspense>
      </Canvas>
    </div>
  );
};