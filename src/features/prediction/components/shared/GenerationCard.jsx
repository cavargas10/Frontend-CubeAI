import React, { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { HDREnvironment } from "./HDREnvironment";
import { DownloadSimple, Trash } from "@phosphor-icons/react";
import { ModelViewer } from "./ModelViewer";

const CameraSetup = ({ position }) => {
  const { camera } = useThree();
  useEffect(() => {
    camera.position.set(...position);
    camera.lookAt(0, 0, 0);
  }, [position, camera]);
  return null;
};

export const GenerationCard = ({ generation, formatDate, openModal }) => {
  const canvasRef = useRef();
  const [isLoading, setIsLoading] = useState(true);

  const getCameraPosition = () => {
    if (generation.glb_model_i23d) return [0, 0, -0.9];
    if (generation.glb_model_t23d) return [0, 0, -0.9];
    if (generation.glb_model_multi3d) return [0, 0, -0.8];
    if (generation.glb_model_b3d) return [0, 0, -0.9];
    if (generation.glb_model_t3d) return [0, 0, -0.9];
    if (generation.obj_glb) return [0, 0.15, -1.2];
    return [0, 0, 5];
  };

  const getModelUrl = () => {
    if (generation.glb_model_i23d) return generation.glb_model_i23d;
    if (generation.glb_model_t23d) return generation.glb_model_t23d;
    if (generation.glb_model_multi3d) return generation.glb_model_multi3d;
    if (generation.glb_model_b3d) return generation.glb_model_b3d;
    if (generation.glb_model_t3d) return generation.glb_model_t3d;
    if (generation.obj_glb) return generation.obj_glb;
    return null;
  };

  const modelUrl = getModelUrl();

  useEffect(() => {
    if (canvasRef.current) {
      canvasRef.current.style.width = "100%";
      canvasRef.current.style.height = "100%";
    }
  }, []);

  const handleDownload = (url, filename) => {
    console.log("Intentando descargar:", url, "como", filename); // Depuración
    if (!url) {
      console.error("URL no válida para descargar.");
      return;
    }

    const link = document.createElement("a");
    link.href = url;
    link.download = filename || "archivo";
    document.body.appendChild(link); 
    link.click();
    document.body.removeChild(link); 
  };

  const renderDownloadButtons = () => {
    const buttons = [];

    if (generation.glb_model_i23d) {
      buttons.push(
        <button
          key="glb"
          onClick={() => handleDownload(generation.glb_model_i23d, "glb_model_i23d.glb")}
          className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-azul-gradient to-morado-gradient text-white rounded-full shadow-lg hover:shadow-xl transition-all text-xs"
          aria-label="Descargar modelo GLB"
        >
          <DownloadSimple size={16} weight="bold" />
          GLB
        </button>
      );
    } else if (generation.glb_model_t23d) {
      buttons.push(
        <button
          key="obj"
          onClick={() => handleDownload(generation.glb_model_t23d, "glb_model_t23d.glb")}
          className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-azul-gradient to-morado-gradient text-white rounded-full shadow-lg hover:shadow-xl transition-all text-xs"
          aria-label="Descargar modelo GLB"
        >
          <DownloadSimple size={16} weight="bold" />
          GLB
        </button>
      );
    } else if (generation.glb_model_multi3d) {
      buttons.push(
        <button
          key="obj"
          onClick={() => handleDownload(generation.glb_model_multi3d, "glb_model.obj")}
          className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-azul-gradient to-morado-gradient text-white rounded-full shadow-lg hover:shadow-xl transition-all text-xs"
          aria-label="Descargar modelo GLB"
        >
          <DownloadSimple size={16} weight="bold" />
          GLB
        </button>
      );
    } else if (generation.glb_model_b3d) {
      buttons.push(
        <button
          key="obj"
          onClick={() => handleDownload(generation.glb_model_b3d, "glb_model_b3d.glb")}
          className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-azul-gradient to-morado-gradient text-white rounded-full shadow-lg hover:shadow-xl transition-all text-xs"
          aria-label="Descargar modelo GLB"
        >
          <DownloadSimple size={16} weight="bold" />
          GLB
        </button>
      );
    } else if (generation.glb_model_t3d) {
      buttons.push(
        <button
          key="obj"
          onClick={() => handleDownload(generation.glb_model_t3d, "glb_model_t3d.glb")}
          className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-azul-gradient to-morado-gradient text-white rounded-full shadow-lg hover:shadow-xl transition-all text-xs"
          aria-label="Descargar modelo GLB"
        >
          <DownloadSimple size={16} weight="bold" />
          GLB
        </button>
      );
    } else if (generation.obj_glb) {
      buttons.push(
        <button
          key="glb"
          onClick={() => handleDownload(generation.obj_glb, "obj_glb.glb")}
          className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-azul-gradient to-morado-gradient text-white rounded-full shadow-lg hover:shadow-xl transition-all text-xs"
          aria-label="Descargar modelo GLB"
        >
          <DownloadSimple size={16} weight="bold" />
          GLB
        </button>
      );
    }

    return buttons;
  };

  return (
    <div className="relative w-full mt-1 h-[200px] sm:w-[220px] sm:h-[220px] rounded-2xl overflow-hidden shadow-lg bg-principal group cursor-pointer">
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-purple-600 rounded-2xl animate-pulse transition-all duration-500 z-10 pointer-events-none"></div>

      {/* Canvas or Fallback */}
      {modelUrl ? (
        <Canvas ref={canvasRef}>
          <CameraSetup position={getCameraPosition()} />
          <ambientLight intensity={1} />
          <Suspense fallback={null}>
            <HDREnvironment />
            <ModelViewer url={modelUrl} onLoad={() => setIsLoading(false)} />
          </Suspense>
        </Canvas>
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gray-900 text-gray-400 text-sm font-medium">
          Modelo 3D no disponible
        </div>
      )}

      {isLoading && (
        <div className="absolute inset-0 bg-black bg-opacity-90 flex items-center justify-center text-white text-sm font-semibold z-20">
          <div className="animate-pulse">Cargando...</div>
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20"></div>

      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-b from-black/80 via-black/60 to-transparent backdrop-blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-30">
        <h3 className="text-white text-base font-bold mb-1">{generation.generation_name}</h3>
        <p className="text-gray-300 text-xs">Generado el: {formatDate(generation.timestamp)}</p>

        <div className="mt-3 flex justify-between items-center">
          <div className="flex gap-2">
            {renderDownloadButtons()}
          </div>
          <button
            className="p-2 bg-red-600 rounded-full hover:bg-red-700 transition-colors shadow-lg hover:shadow-xl"
            onClick={() => {
              console.log("Eliminar generación:", generation); 
              openModal(generation);
            }}
            aria-label="Eliminar generación"
          >
            <Trash size={16} color="white" weight="bold" />
          </button>
        </div>
      </div>
    </div>
  );
};