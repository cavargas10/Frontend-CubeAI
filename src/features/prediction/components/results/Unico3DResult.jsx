import React from "react";
import { ModelResultViewer } from "../shared/ModelResultViewer"; 

export const Unico3DResult = ({ prediction_unico3d_result }) => {
  const modelUrl = prediction_unico3d_result?.obj_glb;
  const controls = {
    wireframe: true,
    rotate: true,
    texture: true, 
    download: true,
  };
  const cameraPosition = [0, 0, -1.5]; 
  const orbitConfig = { minDistance: 0.5, maxDistance: 2, autoRotateSpeed: 2 };
  const gridPosition = [0, -0.65, 0]

  return (
    <ModelResultViewer
      modelUrl={modelUrl}
      downloadFilename="unico_a_3d.glb"
      controls={controls}
      initialCameraPosition={cameraPosition}
      orbitControlsConfig={orbitConfig}
      gridPosition={gridPosition}
    />
  );
};