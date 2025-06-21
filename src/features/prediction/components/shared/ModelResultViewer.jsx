import { Suspense, useState, useEffect, useRef } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, Grid, Html, useGLTF } from "@react-three/drei";
import { DownloadSimple, ArrowsClockwise, Aperture, Image as ImageIcon } from "@phosphor-icons/react";
import { HDREnvironment } from "./HDREnvironment";
import { ModelViewer } from "./ModelViewer";
import { TextureViewer } from "./TextureViewer"; 
import { viewerConfig } from "../../config/viewer.config";
import { useTranslation } from "react-i18next";
import { BrandedSpinner } from "../../../../components/ui/BrandedSpinner";

const ControlButton = ({ onClick, title, children, active }) => (
  <button
    onClick={onClick}
    className={`p-2 rounded-xl transition-all flex items-center gap-2
      ${active
        ? "bg-gradient-to-r from-azul-gradient to-morado-gradient text-white shadow-md"
        : "bg-gray-200 dark:bg-white/5 hover:bg-gray-300 dark:hover:bg-gradient-to-r dark:hover:from-azul-gradient/50 dark:hover:to-morado-gradient/50 text-gray-700 dark:text-gray-300"
      }`}
    title={title}
  >
    {children}
  </button>
);

const CanvasInitializingFallback = () => <Html center></Html>;

const CanvasCaptureHandler = ({ onCaptureReady }) => {
  const { gl, scene, camera } = useThree();
  const captured = useRef(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (gl.domElement && !captured.current) {
        gl.render(scene, camera);
        try {
          const dataURL = gl.domElement.toDataURL("image/png");
          if (dataURL.length > 100) { 
            onCaptureReady(dataURL);
            captured.current = true;
          }
        } catch (e) {
            console.error("Error capturing canvas:", e);
        }
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [gl, onCaptureReady, scene, camera]);

  return null;
};

const ModelLoadingFallback = () => {
  const { t } = useTranslation();
  return (
    <Html center zIndexRange={[100, 0]}>
      <div className="text-center p-4">
        <BrandedSpinner size="sm" />
        <p className="text-sm text-gray-800 dark:text-white font-medium mt-3">{t('model_viewer.loading_model')}</p>
      </div>
    </Html>
  );
};

export const ModelResultViewer = ({
  modelUrl,
  textureUrl,
  onFirstLoad,
  downloadFilename = viewerConfig.default.downloadFilename,
  controls = viewerConfig.default.controls,
  initialCameraPosition = viewerConfig.default.initialCameraPosition,
  orbitControlsConfig = viewerConfig.default.orbitControlsConfig,
  gridPosition = viewerConfig.default.gridPosition,
}) => {
  const { t } = useTranslation();
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
    setShowWireframe(false); 
    setAutoRotate(true); 
    setIsTextureZoomed(false); 
  }, [modelUrl, controls.texture]);

  useEffect(() => {
    return () => {
      if(modelUrl) {
        useGLTF.clear(modelUrl);
      }
    }
  }, [modelUrl]);

  return (
    <div className="w-full h-full bg-gray-100 dark:bg-principal rounded-3xl relative overflow-hidden">
      {!isResultReady && (
        <div className="absolute inset-0 bg-white/50 dark:bg-black/30 backdrop-blur-sm z-20 flex items-center justify-center rounded-3xl">
          <div className="text-center p-6 rounded-2xl bg-white/80 dark:bg-principal/80">
            <h3 className="text-2xl font-semibold mb-2 text-gray-800 dark:text-white">{t('model_viewer.waiting_title')}</h3>
            <p className="text-gray-600 dark:text-gray-300">{t('model_viewer.waiting_subtitle')}</p>
          </div>
        </div>
      )}

      <div className="w-full h-full relative">
        {isResultReady && (
          <>
            <div className="absolute top-4 left-4 z-10 flex flex-wrap gap-2 bg-white/80 dark:bg-principal/90 p-3 rounded-2xl backdrop-blur">
              {controls.wireframe && (
                <ControlButton onClick={() => setShowWireframe(!showWireframe)} title={t('model_viewer.controls.wireframe')} active={showWireframe}>
                  <Aperture size={20} />
                  <span className="text-sm">{t('model_viewer.controls.wireframe')}</span>
                </ControlButton>
              )}
              {controls.rotate && (
                <ControlButton onClick={() => setAutoRotate(!autoRotate)} title={t('model_viewer.controls.rotate')} active={autoRotate}>
                  <ArrowsClockwise size={20} />
                  <span className="text-sm">{t('model_viewer.controls.rotate')}</span>
                </ControlButton>
              )}
              {controls.texture && (
                <ControlButton onClick={() => setShowTexture(!showTexture)} title={t('model_viewer.controls.texture')} active={showTexture}>
                  <ImageIcon size={20} />
                  <span className="text-sm">{t('model_viewer.controls.texture')}</span>
                </ControlButton>
              )}
              {controls.download && modelUrl && (
                <div className="flex gap-2 items-center">
                  <div className="h-6 w-px bg-gray-300 dark:bg-white/20 rounded-full" />
                  <a href={modelUrl} download={downloadFilename} className="p-2 bg-gradient-to-r from-azul-gradient to-morado-gradient text-white rounded-xl flex items-center gap-2 transition-all hover:shadow-lg hover:scale-105">
                    <DownloadSimple size={20} />
                    <span className="text-sm">GLB</span>
                  </a>
                </div>
              )}
            </div>
            {controls.texture && textureToPreview && (
              <div className="absolute bottom-4 left-4 z-10 cursor-pointer" onClick={() => setIsTextureZoomed(true)}>
                <div className="bg-white/80 dark:bg-fondologin/90 p-3 rounded-2xl group hover:bg-gray-200 dark:hover:bg-principal transition-colors">
                  <img src={textureToPreview} alt={t('model_viewer.texture_preview')} className="w-16 h-16 object-cover rounded-xl group-hover:opacity-90 transition-opacity"/>
                  <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 block text-center">{t('model_viewer.texture_preview')}</span>
                </div>
              </div>
            )}
          </>
        )}
        
        <div className={`w-full h-full ${isTextureZoomed ? 'hidden' : 'block'}`}>
            <Canvas gl={{ preserveDrawingBuffer: true }} camera={{ position: initialCameraPosition, fov: 50 }} className={`h-full rounded-3xl ${!isResultReady ? "opacity-40" : "opacity-100 transition-opacity duration-300"}`}>
                <Suspense fallback={<CanvasInitializingFallback />}>
                    <Grid position={gridPosition} args={[15, 15]} cellSize={0.5} cellThickness={1} cellColor="#6f6f6f" sectionSize={2.5} sectionThickness={1.5} sectionColor="#9d4bff" fadeDistance={25} fadeStrength={1} infiniteGrid />
                    <HDREnvironment />
                    <OrbitControls minDistance={orbitControlsConfig.minDistance} maxDistance={orbitControlsConfig.maxDistance} autoRotate={isResultReady && autoRotate && controls.rotate} autoRotateSpeed={orbitControlsConfig.autoRotateSpeed} enablePan={true} enabled={isResultReady && !isTextureZoomed} />
                    {isResultReady && (
                        <Suspense fallback={<ModelLoadingFallback />}>
                            <ModelViewer key={modelUrl} url={modelUrl} showWireframe={showWireframe} showTexture={showTexture && controls.texture} onTextureLoad={setInternalTexturePreview} />
                            {onFirstLoad && <CanvasCaptureHandler onCaptureReady={onFirstLoad} />}
                        </Suspense>
                    )}
                </Suspense>
            </Canvas>
        </div>

        {isTextureZoomed && (
            <TextureViewer
                textureUrl={textureToPreview}
                onClose={() => setIsTextureZoomed(false)}
            />
        )}
      </div>
    </div>
  );
};