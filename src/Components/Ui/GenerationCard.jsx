import React, { Suspense } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { DownloadSimple, Trash } from "@phosphor-icons/react";
import { Model } from "../Prediction/Model";

const CameraSetup = ({ position }) => {
  const { camera } = useThree();
  camera.position.set(...position);
  return null;
};

export const GenerationCard = ({ generation, formatDate, openModal }) => {
  const getCameraPosition = () => {
    if (generation.make3d && generation.make3d[0]) {
      return [0, 0, 1.7];
    } else if (generation.obj_model) {
      return [0, 0, 0.8];
    } else if (generation.obj_glb) {
      return [0, 0, -1.2];
    } else {
      return [0, 0, 0]; 
    }
  };

  return (
    <div className="relative w-[230px] h-[230px] overflow-hidden rounded-xl shadow-lg group cursor-pointer">
      <Canvas>
        <CameraSetup position={getCameraPosition()} />
        <ambientLight intensity={1} />
        <Suspense fallback={null}>
          <Environment preset="sunset" />
          {generation.make3d && generation.make3d[0] && (
            <Model url={generation.make3d[1]} />
          )}
          {generation.obj_model && <Model url={generation.obj_model} />}
          {generation.obj_glb && <Model url={generation.obj_glb} />}
        </Suspense>
      </Canvas>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black group-hover:from-black/80 group-hover:via-black/60 group-hover:to-black/70"></div>
      <div className="absolute inset-0 flex translate-y-[100%] flex-col items-center justify-center px-9 text-center transition-all duration-500 group-hover:translate-y-0">
        <div className="text-white py-2">
          <h3 className="text-center text-2xl">{generation.generation_name}</h3>
          <p>Generado el: {formatDate(generation.timestamp)}</p>
          <p>{generation.prediction_type}</p>
        </div>
        {generation.make3d && generation.make3d[0] ? (
          <div className="flex gap-4 justify-around">
            <div className="absolute top-0 right-0 mr-2 mt-2">
              <div
                className="bg-red-500 px-2 py-2 rounded-xl relative"
                onClick={() => openModal(generation)}
              >
                <Trash size={24} color="white" />
              </div>
            </div>

            <div className="flex bg-[#6666ff] items-center gap-2 px-3 py-1 rounded-xl">
              <DownloadSimple size={24} color="white" />
              <a href={generation.make3d[0]} download="make3d.obj">
                obj
              </a>
            </div>
            <div className="flex bg-[#6666ff] items-center gap-2 px-2 py-1 rounded-xl">
              <DownloadSimple size={24} color="white" />
              <a href={generation.make3d[1]} download="make3d.glb">
                glb
              </a>
            </div>
          </div>
        ) : generation.obj_model ? (
          <div className="flex gap-4 justify-around">
            <div className="absolute top-0 right-0 mr-2 mt-2">
              <div
                className="bg-red-500 px-2 py-2 rounded-xl"
                onClick={() => openModal(generation)}
              >
                <Trash size={24} color="white" />
              </div>
            </div>
            <div className="flex bg-[#6666ff] items-center gap-2 px-3 py-1 rounded-xl">
              <DownloadSimple size={24} color="white" />
              <a href={generation.obj_model} download="make3d.obj">
                obj
              </a>
            </div>
          </div>
        ) : generation.obj_glb ? (
          <div className="flex gap-4 justify-around">
            <div
              className="bg-red-500 px-2 py-2 rounded-xl"
              onClick={() => openModal(generation)}
            >
              <Trash size={24} color="white" />
            </div>
            <div className="flex bg-[#6666ff] items-center gap-2 px-3 py-1 rounded-xl">
              <DownloadSimple size={24} color="white" />
              <a href={generation.obj_glb} download="obj_glb.glb">
                glb
              </a>
            </div>
          </div>
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            No image or 3D model available
          </div>
        )}
      </div>
    </div>
  );
};
