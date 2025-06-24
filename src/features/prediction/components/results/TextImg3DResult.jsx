import { ModelResultViewer } from "../shared/ModelResultViewer";
import { usePredictionResult } from "../../context/PredictionContext";
import { viewerConfig } from "../../config/viewer.config";
import { DownloadSimple } from "@phosphor-icons/react";

export const TextImg3DResult = ({ onFirstLoad }) => {
  const predictionResult = usePredictionResult("TextImg3D");
  const modelUrl = predictionResult?.modelUrl;
  const imageUrl = predictionResult?.raw_data?.generated_2d_image_url;

  return (
    <ModelResultViewer
      modelUrl={modelUrl}
      onFirstLoad={onFirstLoad}
      {...viewerConfig.TextImg3D}
    >
      <>
        <h3 className="text-xl border-b border-linea pb-3 xl:border-b xl:border-linea xl:pb-3 text-center w-full mb-4 md:border-b-0 md:pb-0">
          Resultado de la Generación
        </h3>
        {imageUrl && (
          <div className="mb-4 flex flex-col items-center">
            <p className="text-sm text-gray-400 mb-2">Imagen 2D Generada:</p>
            <img
              src={imageUrl}
              alt="Imagen Generada a partir de texto"
              className="w-[200px] h-[200px] object-cover rounded-lg shadow-md"
            />
          </div>
        )}
        {modelUrl && (
          <div className="mt-auto w-full flex flex-col items-center gap-3 pt-4">
            <a
              href={modelUrl}
              download={viewerConfig.TextImg3D.downloadFilename} 
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-azul-gradient to-morado-gradient text-white rounded-lg shadow-md hover:from-morado-gradient hover:to-azul-gradient transition"
            >
              <DownloadSimple size={24} />
              <span>Descargar GLB</span>
            </a>
          </div>
        )}
      </>
    </ModelResultViewer>
  );
};