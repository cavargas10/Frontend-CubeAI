import React, { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import { Model } from "./Model";
import { Suspense } from "react";

export const Texto3DResult = ({ predictionResult, error }) => {
  return (
    <div className=" w-[700px]">
      <Canvas camera={{ position: [0, 0, 1.7] }}>
        <Suspense fallback={null}>
          {predictionResult && predictionResult.obj_model && (
            <Model url={predictionResult.obj_model} />
          )}
          <OrbitControls minDistance={0.2} maxDistance={0.9} />
          <ambientLight intensity={1} />
          <Environment preset="sunset" />
        </Suspense>
      </Canvas>
    </div>
  );
};
