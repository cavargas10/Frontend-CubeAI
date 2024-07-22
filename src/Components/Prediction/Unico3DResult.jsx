import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls} from "@react-three/drei";
import { Model } from "./Model";
import { Suspense } from "react";
import { HDREnvironment } from "./HDREnvironment";

export const Unico3DResult = ({ prediction_unico3d_result }) => {
  return (
    <div className="sm:h-[345px] h-96">
      <Canvas camera={{ position: [0, 0, -1.2] }}>
        <Suspense fallback={null}>
          {prediction_unico3d_result && prediction_unico3d_result.obj_glb && (
            <Model url={prediction_unico3d_result.obj_glb} />
          )}
          <OrbitControls minDistance={0.2} maxDistance={0.9} />
          <ambientLight intensity={1} />
          <HDREnvironment />
        </Suspense>
      </Canvas>
    </div>
  );
};