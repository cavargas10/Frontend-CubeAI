import { ModelResultViewer } from "../shared/ModelResultViewer";
import { usePredictions } from "../../context/PredictionContext";
import { viewerConfig } from "../../config/viewer.config";

export const Unico3DResult = ({ onFirstLoad }) => {
  const { prediction_unico3d_result } = usePredictions();
  const modelUrl = prediction_unico3d_result?.modelUrl;

  return (
    <ModelResultViewer
      modelUrl={modelUrl}
      onFirstLoad={onFirstLoad}
      {...viewerConfig.Unico3D}
    />
  );
};