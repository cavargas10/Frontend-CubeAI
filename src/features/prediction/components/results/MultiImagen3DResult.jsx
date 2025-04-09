import React from "react";
import { ModelResultViewer } from "../shared/ModelResultViewer"; 
import { usePredictions } from '../../context/PredictionContext'; 

export const MultiImagen3DResult = () => {
  const { prediction_multiimg3d_result } = usePredictions();
  const modelUrl = prediction_multiimg3d_result?.glb_model_multi3d; 

  const controls = {
    wireframe: true,
    rotate: true,
    texture: true, 
    download: true,
  };
  const cameraPosition = [0, 0, 1.2];
  const orbitConfig = { minDistance: 0.5, maxDistance: 1.5, autoRotateSpeed: 2 };
  const gridPosition = [0, -0.35, 0];

  return (
    <ModelResultViewer
      modelUrl={modelUrl} 
      downloadFilename="multi_imagen_a_3d.glb"
      controls={controls}
      initialCameraPosition={cameraPosition}
      orbitControlsConfig={orbitConfig}
      gridPosition={gridPosition}
    />
  );
};