import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import { Model } from "./Model";
import { Suspense } from "react";

export const Texto3DResult = ({ prediction_text3d_result }) => {
  return (
    <div className="w-[700px]  mx-auto min-h-[345px] mt-2">
      <Canvas camera={{ position: [0, 0, 1.7] }}>
        <Suspense fallback={null}>
          {prediction_text3d_result && prediction_text3d_result.obj_model && (
            <Model url={prediction_text3d_result.obj_model} />
          )}
          <OrbitControls minDistance={0.2} maxDistance={0.9} />
          <ambientLight intensity={1} />
          <Environment preset="sunset" />
        </Suspense>
      </Canvas>
    </div>
  );
};
