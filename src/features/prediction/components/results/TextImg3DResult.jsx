import { ModelResultViewer } from "../shared/ModelResultViewer";
import { usePredictionResult } from "../../context/PredictionContext";
import { viewerConfig } from "../../config/viewer.config";

export const TextImg3DResult = ({ onFirstLoad }) => {
  const predictionResult = usePredictionResult("TextImg3D");
  const modelUrl = predictionResult?.modelUrl;
  const imageUrl = predictionResult?.raw_data?.generated_2d_image_url;

  return (
    <ModelResultViewer
      modelUrl={modelUrl}
      originalImageUrl={imageUrl}
      onFirstLoad={modelUrl ? onFirstLoad : null}
      {...viewerConfig.TextImg3D} 
    />
  );
};