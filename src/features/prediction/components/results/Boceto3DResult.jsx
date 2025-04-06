import React from "react";
import { ModelResultViewer } from "../shared/ModelResultViewer"; 

export const Boceto3DResult = ({ prediction_boceto3d_result }) => {
  const modelUrl = prediction_boceto3d_result?.glb_model_b3d; 
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
      downloadFilename="boceto_a_3d.glb" 
      controls={controls}
      initialCameraPosition={cameraPosition}
      orbitControlsConfig={orbitConfig}
      gridPosition={gridPosition}
    />
  );
};