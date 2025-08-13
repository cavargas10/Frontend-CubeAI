import { ModelResultViewer } from "../shared/ModelResultViewer";
import { usePredictionResult } from "../../context/PredictionContext";
import { viewerConfig } from "../../config/viewer.config";

export const RetexturizeResult = ({ onFirstLoad }) => {
  // Escucha específicamente los resultados del tipo 'Retexturize3D'
  const predictionResult = usePredictionResult("Retexturize3D");
  const modelUrl = predictionResult?.modelUrl;

  return (
    <ModelResultViewer
      modelUrl={modelUrl}
      onFirstLoad={onFirstLoad}
      // Usa una configuración específica para este visor (la crearemos a continuación)
      {...viewerConfig.Retexturize3D} 
    />
  );
};