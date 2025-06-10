import { ModelResultViewer } from "../shared/ModelResultViewer"; 
import { usePredictions } from '../../context/PredictionContext'; 
import { DownloadSimple } from "@phosphor-icons/react"; 

export const TextImg3DResult = () => {
  const { prediction_textimg3d_result } = usePredictions();

  const modelUrl = prediction_textimg3d_result?.modelUrl;
  const imageUrl = prediction_textimg3d_result?.raw_data?.generated_2d_image_url;

  const controls = {
    wireframe: true,
    rotate: true,
    texture: true,
    download: false,
  };

  const cameraPosition = [0, 0, 1.5];
  const orbitConfig = { minDistance: 0.5, maxDistance: 1.5, autoRotateSpeed: 2 };
  const gridPosition = [0, -0.35, 0];

  return (
    <ModelResultViewer
      modelUrl={modelUrl} 
      downloadFilename="texto_img_a_3d.glb"
      controls={controls} 
      initialCameraPosition={cameraPosition}
      orbitControlsConfig={orbitConfig}
      gridPosition={gridPosition}
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
              download="texto_img_a_3d.glb" 
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