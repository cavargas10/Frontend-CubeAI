import { ModelResultViewer } from "../shared/ModelResultViewer";
import { usePredictions } from "../../context/PredictionContext";
import { viewerConfig } from "../../config/viewer.config";

export const MultiImagen3DResult = ({ onFirstLoad }) => {
  const { prediction_multiimg3d_result } = usePredictions();
  const modelUrl = prediction_multiimg3d_result?.modelUrl;

  return (
    <ModelResultViewer
      modelUrl={modelUrl}
      onFirstLoad={onFirstLoad}
      {...viewerConfig.MultiImagen3D} 
    />
  );
};