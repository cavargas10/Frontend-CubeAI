import React, { Suspense, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Grid } from "@react-three/drei";
import { DownloadSimple, ArrowsClockwise, Aperture, Image, X } from "@phosphor-icons/react";
import { HDREnvironment } from "./HDREnvironment";
import { Model } from "./Model";  // Ahora usamos el componente Model
import Modal from "../Modals/Modal"; // Mueve el Modal a su propio archivo para reusabilidad

export const Imagen3DResult = ({ prediction_img3d_result }) => {
  const [showWireframe, setShowWireframe] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);
  const [showTexture, setShowTexture] = useState(true);
  const [texturePreview, setTexturePreview] = useState(null);
  const [isTextureZoomed, setIsTextureZoomed] = useState(false);

  const isResultReady = Boolean(prediction_img3d_result?.glb_model_i23d);

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
    <div className="w-full h-full bg-principal rounded-r-lg relative" style={{ minHeight: '500px' }}>
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

            <ControlButton onClick={() => setShowTexture(!showTexture)} title="Activar/Desactivar Textura" active={showTexture}>
              <Image size={20} />
              <span className="text-sm">Textura</span>
            </ControlButton>

            {prediction_img3d_result?.glb_model_i23d && (
              <div className="flex gap-2 items-center">
                <div className="h-6 w-px bg-white/20" />
                <a href={prediction_img3d_result.glb_model_i23d} download="modelo.glb" className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors flex items-center gap-2">
                  <DownloadSimple size={20} />
                  <span className="text-sm">GLB</span>
                </a>
              </div>
            )}
          </div>
        )}

        {isResultReady && texturePreview && (
          <div className="absolute bottom-4 left-4 z-10 cursor-pointer" onClick={() => setIsTextureZoomed(true)}>
            <div className="bg-fondologin/90 p-2 rounded-lg backdrop-blur group hover:bg-principal transition-colors">
              <img src={texturePreview} alt="Vista previa de textura" className="w-16 h-16 object-cover rounded-lg group-hover:opacity-90 transition-opacity" />
              <span className="text-xs text-gray-400 mt-1 block text-center">Ver textura</span>
            </div>
          </div>
        )}

        <Canvas camera={{ position: [0, 0, 1.7] }} className="h-full">
          <Suspense fallback={null}>
            <Grid position={[0, -0.9, 0]} args={[15, 15]} cellSize={0.5} cellThickness={1} cellColor="#6f6f6f" sectionSize={2.5} sectionThickness={1.5} sectionColor="#9d4bff" fadeDistance={25} fadeStrength={1} />
            {isResultReady && (
              <Model
                url={prediction_img3d_result.glb_model_i23d}
                showWireframe={showWireframe}
                showTexture={showTexture}
                onTextureLoad={setTexturePreview}
              />
            )}
            <OrbitControls minDistance={1} maxDistance={3} autoRotate={autoRotate} autoRotateSpeed={2} enabled={isResultReady} />
            <ambientLight intensity={1} />
            <HDREnvironment />
          </Suspense>
        </Canvas>

        <Modal isOpen={isTextureZoomed} onClose={() => setIsTextureZoomed(false)}>
          <div className="relative">
            <img src={texturePreview} alt="Vista completa de textura" className="max-w-full max-h-[80vh] object-contain rounded-lg" />
            <button onClick={() => setIsTextureZoomed(false)} className="absolute top-2 right-2 p-2 bg-black/20 hover:bg-black/40 rounded-full transition-colors">
              <X size={20} />
            </button>
          </div>
        </Modal>
      </div>
    </div>
  );
};
