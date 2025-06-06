import { ModelResultViewer } from "../shared/ModelResultViewer"; 
import { usePredictions } from '../../context/PredictionContext'; 

export const Unico3DResult = () => {
  const { prediction_unico3d_result } = usePredictions();
  const modelUrl = prediction_unico3d_result?.obj_glb; 

  const controls = {
    wireframe: true,
    rotate: true,
    texture: true,  
    download: true,
  };
  const cameraPosition = [0, 0, 1.5]; 
  const orbitConfig = { minDistance: 0.2, maxDistance: 1.5, autoRotateSpeed: 2 }; 
  const gridPosition = [0, -0.5, 0];

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