import { ModelResultViewer } from "../shared/ModelResultViewer";
import { usePredictions } from "../../context/PredictionContext";
import { viewerConfig } from "../../config/viewer.config"; 

export const Texto3DResult = ({ onFirstLoad }) => {
  const { prediction_text3d_result } = usePredictions();
  const modelUrl = prediction_text3d_result?.modelUrl;

  return (
    <ModelResultViewer
      modelUrl={modelUrl}
      onFirstLoad={onFirstLoad}
      {...viewerConfig.Texto3D} 
    />
  );
};