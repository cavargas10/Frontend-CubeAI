import React, { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls} from "@react-three/drei";
import { Model } from "./Model";
import { Suspense } from "react";
import { DownloadSimple } from "@phosphor-icons/react";
import { HDREnvironment } from "./HDREnvironment";

export const Imagen3DResult = ({ prediction_img3d_result, error }) => {
  const [isResultReady, setIsResultReady] = useState(false);

  useEffect(() => {
    if (prediction_img3d_result) {
      setIsResultReady(true);
    }
  }, [prediction_img3d_result]);

  return (
    <div className="xl:grid xl:grid-cols-6  ">
      {isResultReady && (
        <div className="xl:col-span-2 xl:border-r-2  xl:border-linea">
          {error && <p style={{ color: "red" }}>{error}</p>}
          {prediction_img3d_result && (
            <div className="mt-4 text-center">
              <h3 className=" text-xl border-b-2 border-linea pb-5 ">
                Resultado de la Generación{" "}
              </h3>

              {prediction_img3d_result.generate_mvs && (
                <div className="flex flex-col items-center mt-2 mb-2">
                  <img
                    src={prediction_img3d_result.generate_mvs}
                    alt="Generated MVS"
                    className="mt-3 w-[275px] "
                  />
                </div>
              )}

              {prediction_img3d_result.make3d && (
                <div className="flex justify-center gap-10 py-1 sm:py-0 border-y-2 xl:border-t-2 border-linea sm:mt-5 xl:mt-[77px] px-10">
                  <div
                    className=" 
                   flex items-center justify-around
                    w-[200px]

                  sm:mb-4 my-4 px-4 py-2  text-white rounded-md shadow-md  bg-gradient-to-r hover:bg-gradient-to-tr from-azul-gradient to-morado-gradient"
                  >
                    <DownloadSimple size={32} color="white" />
                    <a
                      href={prediction_img3d_result.make3d[0]}
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

                 sm:mb-4 my-4 px-4 py-2  text-white rounded-md shadow-md  bg-gradient-to-r  from-azul-gradient to-morado-gradient
                      hover:from-morado-gradient hover:to-azul-gradient"
                  >
                    <DownloadSimple size={32} color="white" />
                    <a
                      href={prediction_img3d_result.make3d[1]}
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

      <div className={` ${isResultReady ? "col-span-4" : "col-span-6"} `}>
        <div className="h-[434px]  ">
          <Canvas camera={{ position: [0, 0, 1.7] }}>
            <Suspense fallback={null}>
              {prediction_img3d_result && prediction_img3d_result.make3d && (
                <Model url={prediction_img3d_result.make3d[1]} />
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