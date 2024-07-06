import React, { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import { Model } from "./Model";
import { Suspense } from "react";
import { DownloadSimple } from "@phosphor-icons/react";

export const Unico3DResult = ({ predictionResult, error }) => {
  const [isResultReady, setIsResultReady] = useState(false);

  useEffect(() => {
    if (predictionResult) {
      setIsResultReady(true);
    }
  }, [predictionResult]);

  return (
    <div className="grid grid-cols-6 mt-4 border-t-2 border-linea">
      {isResultReady && (
        <div className="col-span-2 border-r-2 border-linea">
          {error && <p style={{ color: "red" }}>{error}</p>}
          {predictionResult && (
            <div className="mt-4 text-center">
              <h3 className=" text-xl ">Resultado de la Generación </h3>
              {predictionResult.obj_glb && (
                <div className="flex justify-center gap-10 border-t-2 mt-1">
                  <div className="flex items-center justify-around w-[200px] mt-4 px-4 py-2 text-white rounded-md shadow-md bg-gradient-to-r from-azul-gradient to-morado-gradient hover:from-morado-gradient hover:to-azul-gradient">
                    <DownloadSimple size={32} color="white" />
                    <a
                      href={predictionResult.obj_glb}
                      download="make3d.glb"
                      className="text-xl"
                    >
                      GLB
                    </a>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
      <div className={`${isResultReady ? "col-span-4" : "col-span-6"} mt`}>
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
    </div>
  );
};
