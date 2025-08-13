import { ModelResultViewer } from "../shared/ModelResultViewer";
import { usePredictionResult } from "../../context/PredictionContext";
import { viewerConfig } from "../../config/viewer.config";

export const RetexturizeResult = ({ onFirstLoad }) => {
  const predictionResult = usePredictionResult("Retexturize3D");
  const modelUrl = predictionResult?.modelUrl;

  return (
    <ModelResultViewer
      modelUrl={modelUrl}
      onFirstLoad={onFirstLoad}
      {...viewerConfig.Retexturize3D} 
    />
  );
};