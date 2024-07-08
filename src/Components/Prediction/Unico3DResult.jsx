import React, { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import { Model } from "./Model";
import { Suspense } from "react";

export const Unico3DResult = ({ prediction_unico3d_result }) => {
  const [isResultReady, setIsResultReady] = useState(false);

  useEffect(() => {
    if (prediction_unico3d_result) {
      setIsResultReady(true);
    }
  }, [prediction_unico3d_result]);

  return (
    <div className="grid grid-cols-1">
      {isResultReady && (
        <div className="col-span-1 mt">
          <div className="h-[355px]">
            <Canvas camera={{ position: [0, 0, -1.2] }}>
              <Suspense fallback={null}>
                {prediction_unico3d_result && prediction_unico3d_result.obj_glb && (
                  <Model url={prediction_unico3d_result.obj_glb} />
                )}
                <OrbitControls minDistance={0.8} maxDistance={2} />
                <ambientLight intensity={1} />
                <Environment preset="sunset" />
              </Suspense>
            </Canvas>
          </div>
        </div>
      )}
    </div>
  );
};
