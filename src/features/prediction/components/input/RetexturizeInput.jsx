import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Sparkle,
  Cube,
  ImageIcon,
  TextAa,
  XCircle,
  UploadSimple,
} from "@phosphor-icons/react";
import { useImageUpload } from "../../hooks/useImageUpload";
import { useModelUpload } from "../../hooks/useModelUpload";
import { OriginalModelViewer } from "../shared/OriginalModelViewer";
import { RetexturizeResult } from "../results/RetexturizeResult"; // <-- CAMBIO IMPORTANTE AQUÍ

export const RetexturizeInput = ({ isCollapsed }) => {
  const { t } = useTranslation();

  const [generationName, setGenerationName] = useState("");

  const {
    imageFile: textureFile,
    imagePreview: texturePreview,
    handleFileChange: handleTextureChange,
  } = useImageUpload();
  const {
    modelFile,
    modelUrl,
    modelKey,
    isDragging,
    handleModelChange,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    resetModelUpload,
  } = useModelUpload();

  const isButtonDisabled =
    !generationName.trim() || !modelFile || !textureFile;

  return (
    <section
      className={`w-full bg-white dark:bg-fondologin text-gray-800 dark:text-white transition-all duration-300 ease-in-out relative flex flex-col h-[calc(100vh-4rem)] ${
        isCollapsed ? "sm:pl-[80px]" : "md:pl-[267px] 2xl:pl-[300px]"
      }`}
    >
      <div className="relative z-10 px-4 sm:px-6 md:px-8 pt-6 pb-8 flex flex-col flex-grow min-h-0">
        <div className="mb-6 flex-shrink-0">
          <div>
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-azul-gradient to-morado-gradient">
              {t("dashboard_layout.nav.retexturize_3d")}
            </h1>
            <div className="h-1 w-24 bg-gradient-to-r from-azul-gradient to-morado-gradient rounded-full mt-1.5"></div>
          </div>
        </div>
        <hr className="border-t-2 border-gray-200 dark:border-linea/20 mb-6 flex-shrink-0" />

        <div className="flex-grow grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0">
          <div className="lg:col-span-4">
            <div className="bg-gray-50 dark:bg-principal/30 backdrop-blur-sm border border-gray-200 dark:border-linea/20 rounded-2xl p-4 h-full flex flex-col space-y-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <TextAa size={18} className="text-azul-gradient" />
                  <h3 className="text-sm font-semibold">
                    Nombre de la Generación
                  </h3>
                </div>
                <input
                  type="text"
                  placeholder="Ej: Personaje con nueva textura"
                  value={generationName}
                  onChange={(e) => setGenerationName(e.target.value)}
                  className={`w-full p-2.5 rounded-lg bg-white dark:bg-principal/50 border-2 text-gray-800 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-azul-gradient/50 focus:border-azul-gradient transition-all ${
                    generationName.trim()
                      ? "border-azul-gradient"
                      : "border-gray-300 dark:border-linea/30"
                  }`}
                />
              </div>

              <div className="flex-grow flex flex-col min-h-0">
                <div className="flex items-center gap-3 mb-2 flex-shrink-0">
                  <ImageIcon size={18} className="text-azul-gradient" />
                  <h3 className="text-sm font-semibold">Sube tu Imagen</h3>
                </div>
                <div
                  className={`relative border-2 border-dashed rounded-lg p-2 text-center cursor-pointer transition-colors flex flex-col items-center justify-center flex-grow 
                    ${
                      texturePreview
                        ? "border-azul-gradient bg-azul-gradient/5"
                        : "border-gray-300 dark:border-linea/30"
                    } 
                    hover:border-azul-gradient/50`}
                  onClick={() =>
                    document.getElementById("texture-upload").click()
                  }
                >
                  <input
                    id="texture-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleTextureChange}
                  />
                  {texturePreview ? (
                    <div className="w-full h-full relative min-h-[150px]">
                      <img
                        src={texturePreview}
                        alt="Referencia de textura"
                        className="absolute inset-0 w-full h-full object-contain rounded-lg p-1"
                      />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center p-4 min-h-[150px]">
                      <UploadSimple
                        className="w-8 h-8 text-gray-400 mb-2"
                        weight="light"
                      />
                      <p className="text-sm text-gray-500 dark:text-gray-300">
                        {t("generation_pages.common.drag_and_drop_prompt")}
                      </p>
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
                        {t("generation_pages.common.file_types")}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-auto flex-shrink-0">
                <button
                  disabled={isButtonDisabled}
                  className="w-full text-base font-semibold bg-gradient-to-r from-azul-gradient to-morado-gradient py-3 rounded-lg border-none flex items-center justify-center gap-2 transition-all hover:shadow-lg disabled:opacity-60 text-white"
                >
                  <Sparkle size={22} weight="fill" />
                  Generar Textura
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6 min-h-[400px] lg:min-h-0">
            <div className="flex flex-col">
              <h2 className="text-lg font-bold mb-2 text-center text-gray-700 dark:text-gray-300">
                Modelo Original
              </h2>
              <div
                className={`flex-grow rounded-2xl overflow-hidden transition-colors relative border-2 ${
                  modelUrl
                    ? "border-gray-200 dark:border-linea/20"
                    : "border-dashed border-gray-300 dark:border-linea/30"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <input
                  id="model-upload-hidden"
                  type="file"
                  accept=".glb,.obj"
                  className="hidden"
                  onChange={handleModelChange}
                />
                <OriginalModelViewer modelUrl={modelUrl} modelKey={modelKey} />

                <div
                  className={`absolute inset-0 z-10 transition-all duration-300 
                    ${
                      isDragging
                        ? "bg-azul-gradient/10 border-2 border-dashed border-azul-gradient rounded-2xl"
                        : "pointer-events-none"
                    }`}
                >
                  {!modelUrl ? (
                    <button
                      onClick={() =>
                        document.getElementById("model-upload-hidden").click()
                      }
                      className="w-full h-full pointer-events-auto"
                      aria-label="Subir modelo 3D"
                    />
                  ) : (
                    <div className="absolute top-2 right-2 pointer-events-auto">
                      <button
                        onClick={resetModelUpload}
                        className="p-1.5 bg-red-500/80 hover:bg-red-500 text-white rounded-full shadow-lg backdrop-blur-sm transition-all opacity-50 hover:opacity-100"
                        title="Cambiar modelo"
                      >
                        <XCircle size={20} weight="fill" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col">
              <h2 className="text-lg font-bold mb-2 text-center text-gray-700 dark:text-gray-300">
                Modelo Retexturizado
              </h2>
              <div className="flex-grow border-2 border-gray-200 dark:border-linea/20 rounded-2xl overflow-hidden">
                {/* --- CAMBIO IMPORTANTE AQUÍ --- */}
                <RetexturizeResult />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};