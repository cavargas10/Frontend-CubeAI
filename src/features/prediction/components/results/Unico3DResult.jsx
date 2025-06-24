import { ModelResultViewer } from "../shared/ModelResultViewer";
import { usePredictionResult } from "../../context/PredictionContext";
import { viewerConfig } from "../../config/viewer.config";

export const Unico3DResult = ({ onFirstLoad }) => {
  const predictionResult = usePredictionResult("Unico3D");
  const modelUrl = predictionResult?.modelUrl;

  return (
    <ModelResultViewer
      modelUrl={modelUrl}
      onFirstLoad={onFirstLoad}
      {...viewerConfig.Unico3D}
    />
  );
};