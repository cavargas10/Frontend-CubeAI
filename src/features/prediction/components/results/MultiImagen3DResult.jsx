import { ModelResultViewer } from "../shared/ModelResultViewer";
import { usePredictionResult } from "../../context/PredictionContext";
import { viewerConfig } from "../../config/viewer.config";

export const MultiImagen3DResult = ({ onFirstLoad }) => {
  const predictionResult = usePredictionResult("MultiImagen3D");
    const modelUrl = predictionResult?.modelUrl;

  return (
    <ModelResultViewer
      modelUrl={modelUrl}
      onFirstLoad={onFirstLoad}
      {...viewerConfig.MultiImagen3D} 
    />
  );
};