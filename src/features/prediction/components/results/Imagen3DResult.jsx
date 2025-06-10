import { ModelResultViewer } from "../shared/ModelResultViewer";
import { usePredictions } from "../../context/PredictionContext";
import { viewerConfig } from "../../config/viewer.config";

export const Imagen3DResult = ({ onFirstLoad }) => {
  const { prediction_img3d_result } = usePredictions();
  const modelUrl = prediction_img3d_result?.modelUrl;

  return (
    <ModelResultViewer
      modelUrl={modelUrl}
      onFirstLoad={onFirstLoad}
      {...viewerConfig.Imagen3D} 
    />
  );
};