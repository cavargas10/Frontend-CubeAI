import { ModelResultViewer } from "../shared/ModelResultViewer"; 
import { usePredictions } from '../../context/PredictionContext'; 

export const Imagen3DResult = () => {
  const { prediction_img3d_result } = usePredictions();
  const modelUrl = prediction_img3d_result?.glb_model_i23d; 

  const controls = {
    wireframe: true,
    rotate: true,
    texture: true,
    download: true,
  };
  const cameraPosition = [0, 0, 1.5];
  const orbitConfig = { minDistance: 0.5, maxDistance: 2, autoRotateSpeed: 2 };
  const gridPosition = [0, -0.5, 0]; 

  return (
    <ModelResultViewer
      modelUrl={modelUrl} 
      downloadFilename="imagen_a_3d.glb"
      controls={controls}
      initialCameraPosition={cameraPosition}
      orbitControlsConfig={orbitConfig}
      gridPosition={gridPosition}
    />
  );
};