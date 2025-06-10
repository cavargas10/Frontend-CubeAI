import { Suspense, useRef, useState, useEffect } from "react";
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

const DownloadButton = ({ download }) => {
  const handleDownload = (e) => {
    e.stopPropagation(); 
    const link = document.createElement("a");
    link.href = download.url;
    link.download = `${download.format.toLowerCase()}_model.${download.format.toLowerCase()}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button
      onClick={handleDownload}
      className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-azul-gradient to-morado-gradient text-white rounded-full shadow-lg hover:shadow-xl transition-all text-xs"
      aria-label={`Descargar modelo ${download.format}`}
    >
      <DownloadSimple size={16} weight="bold" />
      {download.format}
    </button>
  );
};

export const GenerationCard = ({ generation, formatDate, openModal }) => {
  const canvasRef = useRef();
  const [isLoading, setIsLoading] = useState(true);
  const { modelUrl, downloads } = generation;

  const getCameraPosition = () => {
    switch (generation.prediction_type) {
      case "Unico a 3D":
        return [0, 0.15, -1.2];
      default:
        return [0, 0, -0.9];
    }
  };
  
  const cameraPosition = getCameraPosition();
  
  useEffect(() => {
    const canvas = canvasRef.current;
    return () => {
      if (canvas && canvas.__r3f && canvas.__r3f.gl) {
        canvas.__r3f.gl.dispose();
      }
    };
  }, []);

  return (
    <div className="relative w-full mt-1 h-[200px] sm:w-[220px] sm:h-[220px] rounded-2xl overflow-hidden shadow-lg bg-principal group cursor-pointer">
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-purple-600 rounded-2xl transition-all duration-500 z-10 pointer-events-none"></div>
      
      {modelUrl ? (
        <Canvas ref={canvasRef} gl={{ antialias: true, powerPreference: "high-performance" }} dpr={[1, 1.5]}>
          <CameraSetup position={cameraPosition} />
          <ambientLight intensity={1.5} />
          <Suspense fallback={null}>
            <HDREnvironment />
            <ModelViewer url={modelUrl} onLoad={() => setIsLoading(false)} />
          </Suspense>
        </Canvas>
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gray-900 text-gray-400 text-sm font-medium">
          Modelo no disponible
        </div>
      )}

      {isLoading && modelUrl && (
        <div className="absolute inset-0 bg-black bg-opacity-90 flex flex-col items-center justify-center text-white text-sm font-semibold z-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-morado-gradient mb-4"></div>
          Cargando...
        </div>
      )}
      
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20 flex flex-col justify-end p-3">
        <h3 className="text-white text-base font-bold truncate">{generation.generation_name}</h3>
        <p className="text-gray-300 text-xs mb-2">
          {formatDate(generation.timestamp)}
        </p>

        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            {downloads && downloads.map(d => (
              <DownloadButton key={d.format} download={d} />
            ))}
          </div>
          <button
            className="p-2 bg-red-600 rounded-full hover:bg-red-700 transition-colors shadow-lg hover:shadow-xl"
            onClick={(e) => {
              e.stopPropagation();
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