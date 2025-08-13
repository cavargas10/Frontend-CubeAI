import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Grid, Html } from "@react-three/drei";
import { useTranslation } from "react-i18next";
import { ModelViewer } from "./ModelViewer";
import { HDREnvironment } from "./HDREnvironment";
import { BrandedSpinner } from "../../../../components/ui/BrandedSpinner";
import { Cube } from "@phosphor-icons/react";

const ModelLoadingFallback = () => (
  <Html center>
    <div className="text-center text-white">
      <BrandedSpinner size="sm" />
      <p className="mt-2 text-sm">Cargando...</p>
    </div>
  </Html>
);

const Placeholder = () => {
  const { t } = useTranslation();
  return (
    <div className="w-full h-full flex flex-col items-center justify-center text-center text-gray-500 p-4 bg-gray-100 dark:bg-black/10">
      <Cube size={48} className="mx-auto mb-4 opacity-50" />
      <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
        {t("generation_pages.retexturize_3d.upload_model_title")}
      </h3>
      <p className="text-sm">
        {t("generation_pages.retexturize_3d.upload_model_prompt")}
      </p>
    </div>
  );
};

export const OriginalModelViewer = ({ modelUrl, modelKey }) => {
  if (!modelUrl) {
    return <Placeholder />;
  }

  return (
    <Canvas
      gl={{ preserveDrawingBuffer: true }}
      camera={{ position: [0, 0, 2.5], fov: 50 }}
    >
      <Suspense fallback={<ModelLoadingFallback />}>
        <Grid position={[0, -0.5, 0]} args={[10, 10]} />
        <HDREnvironment />
        <OrbitControls minDistance={1} maxDistance={10} />
        <ModelViewer key={modelKey} url={modelUrl} />
      </Suspense>
    </Canvas>
  );
};