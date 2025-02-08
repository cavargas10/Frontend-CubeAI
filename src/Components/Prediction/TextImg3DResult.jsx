import React, { useState, useEffect, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Grid } from "@react-three/drei";
import { DownloadSimple } from "@phosphor-icons/react";
import { HDREnvironment } from "./HDREnvironment";
import { Model } from "./Model";

export const TextImg3DResult = ({ prediction_textimg3d_result, error }) => {
  const [isResultReady, setIsResultReady] = useState(false);

  useEffect(() => {
    setIsResultReady(Boolean(prediction_textimg3d_result?.glb_model_t23d));
  }, [prediction_textimg3d_result]);

  return (
    <div className="w-full h-full bg-principal rounded-r-lg relative min-h-[500px]">
      {!isResultReady && (
        <div className="absolute inset-0 bg-black/30 backdrop-blur-sm z-20 flex items-center justify-center">
          <div className="text-center p-6 rounded-lg bg-principal/80">
            <h3 className="text-2xl font-semibold mb-2">Esperando generación...</h3>
            <p className="text-gray-300">Aquí podrás ver tu modelo 3D una vez generado</p>
          </div>
        </div>
      )}

      <div className="grid xl:grid-cols-6 h-full">
        {/* Sección de imagen generada y descarga */}
        {isResultReady && (
          <div className="col-span-2 border-r border-linea flex flex-col items-center p-4">
            {error && <p className="text-red-500">{error}</p>}

            <h3 className="text-xl border-b border-linea pb-3 text-center w-full">
              Resultado de la Generación
            </h3>

            {/* Imagen generada */}
            {prediction_textimg3d_result?.generated_image && (
              <div className="mt-4 flex flex-col items-center">
                <img
                  src={prediction_textimg3d_result.generated_image}
                  alt="Imagen Generada"
                  className="w-[250px] rounded-lg shadow-md"
                />
              </div>
            )}

            {/* Botones de descarga */}
            {prediction_textimg3d_result?.glb_model_t23d && (
              <div className="mt-4 w-full flex flex-col items-center gap-3">
                <p className="text-sm text-gray-300">Descargar modelo 3D</p>
                <div className="flex gap-3">
                  <a
                    href={prediction_textimg3d_result.glb_model_t23d}
                    download="make3d.glb"
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-azul-gradient to-morado-gradient text-white rounded-lg shadow-md hover:from-morado-gradient hover:to-azul-gradient transition"
                  >
                    <DownloadSimple size={24} />
                    <span>GLB</span>
                  </a>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Sección del visor 3D */}
        <div className={`${isResultReady ? "col-span-4" : "col-span-6"} h-full`}>
          <Canvas camera={{ position: [0, 0, 1.7] }} className="h-full">
            <Suspense fallback={null}>
              <Grid
                position={[0, -0.9, 0]}
                args={[15, 15]}
                cellSize={0.5}
                cellThickness={1}
                cellColor="#6f6f6f"
                sectionSize={2.5}
                sectionThickness={1.5}
                sectionColor="#9d4bff"
                fadeDistance={25}
                fadeStrength={1}
              />
              {isResultReady && (
                <Model url={prediction_textimg3d_result.glb_model_t23d} />
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
