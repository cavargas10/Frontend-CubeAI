import { ModelResultViewer } from "../shared/ModelResultViewer";
import { usePredictions } from "../../context/PredictionContext";
import { viewerConfig } from "../../config/viewer.config";

export const Boceto3DResult = ({ onFirstLoad }) => {
  const { prediction_boceto3d_result } = usePredictions();
  const modelUrl = prediction_boceto3d_result?.modelUrl;

  return (
    <ModelResultViewer
      modelUrl={modelUrl}
      onFirstLoad={onFirstLoad}
      {...viewerConfig.Boceto3D}
    />
  );
};