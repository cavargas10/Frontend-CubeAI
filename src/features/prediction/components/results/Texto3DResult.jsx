import React, { Suspense, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Grid } from "@react-three/drei";
import { DownloadSimple, ArrowsClockwise, Aperture } from "@phosphor-icons/react";
import { HDREnvironment } from "../shared/HDREnvironment";
import { ModelViewer } from "../shared/ModelViewer"; 

export const Texto3DResult = ({ prediction_text3d_result }) => {
  const [showWireframe, setShowWireframe] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);

  const isResultReady = Boolean(prediction_text3d_result?.glb_model);

  const ControlButton = ({ onClick, title, children, active }) => (
    <button
      onClick={onClick}
      className={`p-2 rounded-lg transition-colors flex items-center gap-2 
        ${active ? "bg-morado-gradient text-white" : "bg-white/5 hover:bg-white/10"}`}
      title={title}
    >
      {children}
    </button>
  );

  return (
    <div className="w-full h-full bg-principal rounded-r-lg relative" style={{ minHeight: "500px" }}>
      {!isResultReady && (
        <div className="absolute inset-0 bg-black/30 backdrop-blur-sm z-20 flex items-center justify-center">
          <div className="text-center p-6 rounded-lg bg-principal/80">
            <h3 className="text-2xl font-semibold mb-2">Esperando generación...</h3>
            <p className="text-gray-300">Aquí podrás ver tu modelo 3D una vez generado</p>
          </div>
        </div>
      )}

      <div className="relative h-full">
        {isResultReady && (
          <div className="absolute top-4 left-4 z-10 flex flex-wrap gap-2 bg-principal/90 p-2 rounded-lg backdrop-blur">
            <ControlButton onClick={() => setShowWireframe(!showWireframe)} title="Mostrar/Ocultar Malla" active={showWireframe}>
              <Aperture size={20} />
              <span className="text-sm">Malla</span>
            </ControlButton>

            <ControlButton onClick={() => setAutoRotate(!autoRotate)} title="Activar/Desactivar Rotación" active={autoRotate}>
              <ArrowsClockwise size={20} />
              <span className="text-sm">Rotar</span>
            </ControlButton>

            <div className="flex gap-2 items-center">
              <div className="h-6 w-px bg-white/20" />
              <a href={prediction_text3d_result.glb_model} download="modelo.obj" className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors flex items-center gap-2">
                <DownloadSimple size={20} />
                <span className="text-sm">GLB</span>
              </a>
            </div>
          </div>
        )}

        <Canvas camera={{ position: [0, 0, 1.7] }} className="h-full">
          <Suspense fallback={null}>
            <Grid
              position={[0, -0.9, 0]}
              args={[15, 15]}
              cellSize={0.5}
              cellThickness={1}
              cellColor="#6f6f6f"
              sectionSize={2.5}
              sectionThickness={1.5}
              sectionColor="#9d4bff"
              fadeDistance={25}
              fadeStrength={1}
            />
            {isResultReady && (
              <ModelViewer
                url={prediction_text3d_result.glb_model}
                showWireframe={showWireframe}
              />
            )}
            <OrbitControls minDistance={1} maxDistance={3} autoRotate={autoRotate} autoRotateSpeed={2} enabled={isResultReady} />
            <ambientLight intensity={1} />
            <HDREnvironment />
          </Suspense>
        </Canvas>
      </div>
    </div>
  );
};