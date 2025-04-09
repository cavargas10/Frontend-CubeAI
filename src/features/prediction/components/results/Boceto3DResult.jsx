import React from "react";
import { ModelResultViewer } from "../shared/ModelResultViewer";
import { usePredictions } from "../../context/PredictionContext";

export const Boceto3DResult = () => {
  const { prediction_boceto3d_result } = usePredictions();
  const modelUrl = prediction_boceto3d_result?.glb_model_b3d;
  const controls = {
    wireframe: true,
    rotate: true,
    texture: true,
    download: true,
  };
  const cameraPosition = [0, 0, 1.7];
  const orbitConfig = { minDistance: 0.5, maxDistance: 2, autoRotateSpeed: 2 };
  const gridPosition = [0, -0.35, 0];

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