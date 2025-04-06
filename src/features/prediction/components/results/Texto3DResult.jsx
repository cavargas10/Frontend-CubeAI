import React from "react";
import { ModelResultViewer } from "../shared/ModelResultViewer"; 

export const Texto3DResult = ({ prediction_text3d_result }) => {
  const modelUrl = prediction_text3d_result?.glb_model; 
  
  const controls = {
    wireframe: true,
    rotate: true,
    texture: true, 
    download: true,
  };
  
  const cameraPosition = [0, 0, 1.7]; 
  const orbitConfig = { minDistance: 1, maxDistance: 3, autoRotateSpeed: 2 };
  const gridPosition = [0, -0.9, 0];

  return (
    <ModelResultViewer
      modelUrl={modelUrl}
      downloadFilename="texto_a_3d.glb"
      controls={controls}
      initialCameraPosition={cameraPosition}
      orbitControlsConfig={orbitConfig}
      gridPosition={gridPosition}
    />
  );
};