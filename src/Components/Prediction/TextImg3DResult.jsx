import React, { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import { Model } from "./Model";
import { Suspense } from "react";
import { DownloadSimple } from "@phosphor-icons/react";
import { HDREnvironment } from "./HDREnvironment";

export const TextImg3DResult = ({ prediction_textimg3d_result, error }) => {
  const [isResultReady, setIsResultReady] = useState(false);

  useEffect(() => {
    if (prediction_textimg3d_result) {
      setIsResultReady(true);
    }
  }, [prediction_textimg3d_result]);

  return (
    <div className="xl:grid xl:grid-cols-6">
      {isResultReady && (
        <div className="col-span-2 border-r-2  border-linea">
          {error && <p style={{ color: "red" }}>{error}</p>}
          {prediction_textimg3d_result && (
            <div className="mt-4 text-center">
              <h3 className=" text-xl  border-b-2 border-linea pb-5">
                Resultado de la Generación{" "}
              </h3>
              {prediction_textimg3d_result.generate_image && (
                <div className="flex flex-col items-center sm:py-6 ">
                  <img
                    src={prediction_textimg3d_result.generate_image}
                    alt="Imagen"
                    className="w-[274px]"
                  />
                </div>
              )}
              {prediction_textimg3d_result.make3d && (
                <div className="flex justify-center gap-10 sm:border-y-2 xl:border-t-2 border-linea  px-10">
                  <div
                    className=" 
                   flex items-center justify-around
                    w-[200px]

                  mt-4 sm:mb-4 px-4 py-2  text-white rounded-md shadow-md  bg-gradient-to-r  from-azul-gradient to-morado-gradient
                      hover:from-morado-gradient hover:to-azul-gradient"
                  >
                    <DownloadSimple size={32} color="white" />
                    <a
                      href={prediction_textimg3d_result.make3d[0]}
                      download="make3d.obj"
                      className="text-xl"
                    >
                      OBJ
                    </a>
                  </div>
                  <div
                    className=" 
                   flex items-center justify-around
                    w-[200px]

                  mt-4 sm:mb-4 px-4 py-2  text-white rounded-md shadow-md  bg-gradient-to-r hover:bg-gradient-to-tr from-azul-gradient to-morado-gradient"
                  >
                    <DownloadSimple size={32} color="white" />
                    <a
                      href={prediction_textimg3d_result.make3d[1]}
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

      <div className={` ${isResultReady ? "col-span-4" : "col-span-6"} mt`}>
        <div className="h-[434px] ">
          <Canvas camera={{ position: [0, 0, 1.7] }}>
            <Suspense fallback={null}>
              {prediction_textimg3d_result &&
                prediction_textimg3d_result.make3d && (
                  <Model url={prediction_textimg3d_result.make3d[1]} />
                )}
              <OrbitControls minDistance={1} maxDistance={3} />
              <ambientLight intensity={1} />
              <HDREnvironment />
            </Suspense>
          </Canvas>
        </div>
      </div>
    </div>
  );
};