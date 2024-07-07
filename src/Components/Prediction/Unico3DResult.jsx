import React, { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import { Model } from "./Model";
import { Suspense } from "react";

export const Unico3DResult = ({ predictionResult }) => {
  const [isResultReady, setIsResultReady] = useState(false);

  useEffect(() => {
    if (predictionResult) {
      setIsResultReady(true);
    }
  }, [predictionResult]);

  return (
    <div className="grid grid-cols-1">
      {isResultReady && (
        <div className="col-span-1 mt">
          <div className="h-[355px]">
            <Canvas camera={{ position: [0, 0, -1.2] }}>
              <Suspense fallback={null}>
                {predictionResult && predictionResult.obj_glb && (
                  <Model url={predictionResult.obj_glb} />
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
