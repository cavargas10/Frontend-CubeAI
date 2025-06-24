import { ModelResultViewer } from "../shared/ModelResultViewer";
import { usePredictionResult } from "../../context/PredictionContext";
import { viewerConfig } from "../../config/viewer.config";

export const Imagen3DResult = ({ onFirstLoad }) => {
  const predictionResult = usePredictionResult("Imagen3D");
  const modelUrl = predictionResult?.modelUrl;

  return (
    <ModelResultViewer
      modelUrl={modelUrl}
      onFirstLoad={onFirstLoad}
      {...viewerConfig.Imagen3D} 
    />
  );
};