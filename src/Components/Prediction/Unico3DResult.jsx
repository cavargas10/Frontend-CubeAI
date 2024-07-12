import React, { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import { Model } from "./Model";
import { Suspense } from "react";

export const Unico3DResult = ({ prediction_unico3d_result }) => {
  return (
    <div className="h-96">
      <Canvas camera={{ position: [0, 0, -1.2] }}>
        <Suspense fallback={null}>
          {prediction_unico3d_result && prediction_unico3d_result.obj_model && (
            <Model url={prediction_unico3d_result.obj_model} />
          )}
          <OrbitControls minDistance={0.2} maxDistance={0.9} />
          <ambientLight intensity={1} />
          <Environment preset="sunset" />
        </Suspense>
      </Canvas>
    </div>
  );
};