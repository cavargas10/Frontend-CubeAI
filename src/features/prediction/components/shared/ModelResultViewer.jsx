import { Suspense, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Grid, Html } from "@react-three/drei";
import {
  DownloadSimple,
  ArrowsClockwise,
  Aperture,
  Image as ImageIcon,
  X,
} from "@phosphor-icons/react";
import { HDREnvironment } from "./HDREnvironment";
import { ModelViewer } from "./ModelViewer";
import { ModalBase } from "../../../../components/modals/ModalBase";

const ControlButton = ({ onClick, title, children, active }) => (
  <button
    onClick={onClick}
    className={`p-2 rounded-xl transition-all flex items-center gap-2 ${
      active
        ? "bg-gradient-to-r from-azul-gradient to-morado-gradient text-white shadow-md"
        : "bg-white/5 hover:bg-gradient-to-r hover:from-azul-gradient/50 hover:to-morado-gradient/50 text-gray-300"
    }`}
    title={title}
  >
    {children}
  </button>
);

const ModelLoadingFallback = () => {
  return (
    <Html center zIndexRange={[100, 0]}>
      <div className="text-center p-4 bg-principal/90 rounded-2xl backdrop-blur-sm shadow-xl">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-morado-gradient mx-auto mb-3"></div>
        <p className="text-sm text-white font-medium">Cargando modelo 3D...</p>
      </div>
    </Html>
  );
};

const CanvasInitializingFallback = () => {
  return <Html center></Html>;
};

export const ModelResultViewer = ({
  modelUrl,
  textureUrl,
  downloadFilename = "modelo.glb",
  controls = {
    wireframe: true,
    rotate: true,
    texture: true,
    download: true,
  },
  initialCameraPosition = [0, 0, 1.7],
  orbitControlsConfig = {
    minDistance: 0.5,
    maxDistance: 2,
    autoRotateSpeed: 2,
  },
  gridPosition = [0, -0.5, 0],
  children,
  isCollapsed = false, 
}) => {
  const [showWireframe, setShowWireframe] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);
  const [showTexture, setShowTexture] = useState(true);
  const [internalTexturePreview, setInternalTexturePreview] = useState(null);
  const [isTextureZoomed, setIsTextureZoomed] = useState(false);
  const isResultReady = Boolean(modelUrl);
  const textureToPreview = textureUrl || internalTexturePreview;

  useEffect(() => {
    setInternalTexturePreview(null);
    setShowTexture(controls.texture);
  }, [modelUrl, controls.texture]);

  return (
    <div
      className="w-full h-full bg-principal rounded-3xl relative overflow-hidden"
    >
      {!isResultReady && (
        <div className="absolute inset-0 bg-black/30 backdrop-blur-sm z-20 flex items-center justify-center rounded-3xl">
          <div className="text-center p-6 rounded-2xl bg-principal/80">
            <h3 className="text-2xl font-semibold mb-2">
              Esperando generación...
            </h3>
            <p className="text-gray-300">
              Aquí podrás ver tu modelo 3D una vez generado
            </p>
          </div>
        </div>
      )}

      <div
        className={`relative h-full ${children && isResultReady ? "grid xl:grid-cols-6" : ""}`}
      >
        {isResultReady && children && (
          <div className="xl:col-span-2 xl:border-r xl:border-linea flex flex-col items-center p-4">
            {children}
          </div>
        )}

        <div
          className={`${children && isResultReady ? "xl:col-span-4" : "col-span-full"} h-full relative ${children && isResultReady ? "border-t xl:border-t-0 xl:border-linea" : ""}`}
        >
          {isResultReady && (
            <div className="absolute top-4 left-4 z-10 flex flex-wrap gap-2 bg-principal/90 p-3 rounded-2xl backdrop-blur">
              {controls.wireframe && (
                <ControlButton
                  onClick={() => setShowWireframe(!showWireframe)}
                  title="Malla"
                  active={showWireframe}
                >
                  <Aperture size={20} />
                  <span className="text-sm">Malla</span>
                </ControlButton>
              )}
              {controls.rotate && (
                <ControlButton
                  onClick={() => setAutoRotate(!autoRotate)}
                  title="Rotación"
                  active={autoRotate}
                >
                  <ArrowsClockwise size={20} />
                  <span className="text-sm">Rotar</span>
                </ControlButton>
              )}
              {controls.texture && (
                <ControlButton
                  onClick={() => setShowTexture(!showTexture)}
                  title="Textura"
                  active={showTexture}
                >
                  <ImageIcon size={20} />
                  <span className="text-sm">Textura</span>
                </ControlButton>
              )}
              {controls.download && modelUrl && (
                <div className="flex gap-2 items-center">
                  <div className="h-6 w-px bg-white/20 rounded-full" />
                  <a
                    href={modelUrl}
                    download={downloadFilename}
                    className="p-2 bg-gradient-to-r from-azul-gradient to-morado-gradient text-white rounded-xl flex items-center gap-2 transition-all hover:shadow-lg hover:scale-105"
                  >
                    <DownloadSimple size={20} />
                    <span className="text-sm">GLB</span>
                  </a>
                </div>
              )}
            </div>
          )}

          {isResultReady && controls.texture && textureToPreview && (
            <div
              className="absolute bottom-4 left-4 z-10 cursor-pointer"
              onClick={() => setIsTextureZoomed(true)}
            >
              <div className="bg-fondologin/90 p-3 rounded-2xl group hover:bg-principal transition-colors">
                <img
                  src={textureToPreview}
                  alt="Vista previa de textura"
                  className="w-16 h-16 object-cover rounded-xl group-hover:opacity-90 transition-opacity"
                />
                <span className="text-xs text-gray-400 mt-1 block text-center">
                  Ver textura
                </span>
              </div>
            </div>
          )}

          <Canvas
            camera={{ position: initialCameraPosition, fov: 50 }}
            className={`h-full rounded-3xl ${!isResultReady ? "opacity-40" : "opacity-100 transition-opacity duration-300"}`}
          >
            <Suspense fallback={<CanvasInitializingFallback />}>
              <Grid
                position={gridPosition}
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
              <HDREnvironment />
              <OrbitControls
                minDistance={orbitControlsConfig.minDistance}
                maxDistance={orbitControlsConfig.maxDistance}
                autoRotate={isResultReady && autoRotate && controls.rotate}
                autoRotateSpeed={orbitControlsConfig.autoRotateSpeed}
                enablePan={true}
                enabled={isResultReady}
              />
              {isResultReady && (
                <Suspense fallback={<ModelLoadingFallback />}>
                  <ModelViewer
                    key={modelUrl}
                    url={modelUrl}
                    showWireframe={showWireframe}
                    showTexture={showTexture && controls.texture}
                    onTextureLoad={setInternalTexturePreview}
                  />
                </Suspense>
              )}
            </Suspense>
          </Canvas>

          <ModalBase
            isOpen={isTextureZoomed}
            onClose={() => setIsTextureZoomed(false)}
            className="z-[9999]"
          >
            <div 
              className={`fixed inset-0 z-[9999] flex items-center justify-center transition-all duration-300 ease-in-out ${
                isCollapsed
                  ? "sm:pl-[80px]"
                  : "md:pl-[267px] 2xl:pl-[300px]"
              }`}
              style={{ paddingTop: '80px', paddingBottom: '20px' }} 
            >
              <div 
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                onClick={() => setIsTextureZoomed(false)}
              />

              <div className="relative bg-principal rounded-2xl p-4 shadow-2xl">
                <div className="w-[500px] h-[500px] flex items-center justify-center relative">
                  <img
                    src={textureToPreview}
                    alt="Vista completa de textura"
                    className="max-w-full max-h-full object-contain rounded-xl"
                  />

                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                    <a
                      href={textureToPreview}
                      download="textura.png"
                      className="px-4 py-2 bg-gradient-to-r from-azul-gradient to-morado-gradient text-white rounded-full flex items-center gap-2 transition-all hover:shadow-lg hover:scale-105 shadow-xl backdrop-blur-sm"
                    >
                      <DownloadSimple size={18} />
                      <span className="text-sm font-medium">Descargar</span>
                    </a>
                  </div>
                </div>

                <button
                  onClick={() => setIsTextureZoomed(false)}
                  className="absolute -top-3 -right-3 p-2 bg-red-500 hover:bg-red-600 rounded-full transition-colors text-white shadow-lg z-10"
                  aria-label="Cerrar vista de textura"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
          </ModalBase>
        </div>
      </div>
    </div>
  );
};