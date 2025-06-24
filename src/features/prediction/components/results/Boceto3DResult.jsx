import { ModelResultViewer } from "../shared/ModelResultViewer";
import { usePredictionResult } from "../../context/PredictionContext";
import { viewerConfig } from "../../config/viewer.config";

export const Boceto3DResult = ({ onFirstLoad }) => {
  const predictionResult = usePredictionResult("Boceto3D");
    const modelUrl = predictionResult?.modelUrl;

  return (
    <ModelResultViewer
      modelUrl={modelUrl}
      onFirstLoad={onFirstLoad}
      {...viewerConfig.Boceto3D}
    />
  );
};