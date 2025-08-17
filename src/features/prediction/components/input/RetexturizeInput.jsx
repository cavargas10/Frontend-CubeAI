import { useState, useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Sparkle,
  ImageIcon,
  TextAa,
  XCircle,
  UploadSimple,
  ArrowCounterClockwise,
  FilePlus,
} from "@phosphor-icons/react";
import { useImageUpload } from "../../hooks/useImageUpload";
import { useModelUpload } from "../../hooks/useModelUpload";
import { OriginalModelViewer } from "../shared/OriginalModelViewer";
import { RetexturizeResult } from "../results/RetexturizeResult";
import { usePredictionHandler } from "../../hooks/usePredictionHandler";
import { useAuth } from "../../../auth/hooks/useAuth";
import {
  usePredictions,
  usePredictionResult,
} from "../../context/PredictionContext";
import { ProgressModal } from "../../../../components/modals/ProgressModal";
import { ErrorModal } from "../../../../components/modals/ErrorModal";
import { uploadPredictionPreview } from "../../services/predictionApi";
import { InlineSpinner } from "../../../../components/ui/InlineSpinner";
import { RegenerateConfirmationModal } from "../../../../components/modals/RegenerateConfirmationModal";

function dataURLtoBlob(dataurl) {
  const arr = dataurl.split(","),
    mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}

export const RetexturizeInput = ({ isCollapsed }) => {
  const { t } = useTranslation();
  const [generationName, setGenerationName] = useState("");
  const [isResultReady, setIsResultReady] = useState(false);
  const [showRegenerateModal, setShowRegenerateModal] = useState(false);

  const {
    imageFile: textureFile,
    imagePreview: texturePreview,
    handleFileChange: handleTextureChange,
    resetImageState,
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

  const { user } = useAuth();
  const { dispatch, clearResult } = usePredictions();
  const PREDICTION_TYPE = "Retexturize3D";
  const predictionResult = usePredictionResult(PREDICTION_TYPE);

  const {
    submitPrediction,
    jobStatus,
    result,
    error: finalError,
    reset,
    clearError,
    isJobActive,
  } = usePredictionHandler(user);

  const resetComponentState = useCallback(() => {
    setGenerationName("");
    resetImageState();
    resetModelUpload();
    setIsResultReady(false);
    reset();
    clearResult(PREDICTION_TYPE);
  }, [clearResult, reset, resetImageState, resetModelUpload]);

  useEffect(() => {
    if (result) {
      dispatch({
        type: "SET_PREDICTION",
        payload: { type: PREDICTION_TYPE, result },
      });
      setIsResultReady(true);
    }
  }, [result, dispatch]);

  useEffect(() => {
    return () => {
      resetComponentState();
    };
  }, []);

  const handleCreatePrediction = async () => {
    if (!generationName.trim() || !modelFile || !textureFile) return;
    setIsResultReady(false);
    const formData = new FormData();
    formData.append("generationName", generationName);
    formData.append("model", modelFile);
    formData.append("texture", textureFile);
    await submitPrediction(PREDICTION_TYPE, formData);
  };

  const handleRegenerateClick = () => {
    if (isResultReady && predictionResult) {
      setShowRegenerateModal(true);
    }
  };

  const handleConfirmRegenerate = async () => {
    setShowRegenerateModal(false);
    if (!user || !predictionResult || !modelFile || !textureFile) return;

    clearResult(PREDICTION_TYPE);
    setIsResultReady(false);

    const formData = new FormData();
    formData.append("model", modelFile);
    formData.append("texture", textureFile);

    await submitPrediction(
      PREDICTION_TYPE,
      formData,
      predictionResult.generation_name
    );
  };

  const handlePreviewUpload = useCallback(
    async (dataURL) => {
      if (
        !user || !predictionResult?.generation_name || predictionResult?.previewImageUrl
      ) return;
      try {
        const token = await user.getIdToken();
        const previewBlob = dataURLtoBlob(dataURL);
        const formData = new FormData();
        formData.append("preview", previewBlob, "preview.png");
        formData.append("generation_name", predictionResult.generation_name);
        formData.append("prediction_type_api", PREDICTION_TYPE);
        await uploadPredictionPreview(token, formData);
      } catch (error) {
        console.error("Error al subir la previsualización:", error);
      }
    },
    [user, predictionResult]
  );

  const isFormDisabled = isJobActive;
  const isButtonDisabled =
    isJobActive || !generationName.trim() || !modelFile || !textureFile;
  const showErrorModal = !!finalError;

  return (
    <>
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
                      {t("generation_pages.common.generation_name_label")}
                    </h3>
                  </div>
                  <input
                    type="text"
                    placeholder={t("generation_pages.common.name_placeholder_generic")}
                    value={generationName}
                    onChange={(e) => setGenerationName(e.target.value)}
                    disabled={isFormDisabled || isResultReady}
                    className={`w-full p-2.5 rounded-lg bg-white dark:bg-principal/50 border-2 text-gray-800 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-azul-gradient/50 focus:border-azul-gradient transition-all disabled:opacity-70 ${
                      generationName.trim() ? "border-azul-gradient" : "border-gray-300 dark:border-linea/30"
                    }`}
                  />
                </div>

                <div className="flex-grow flex flex-col min-h-0">
                  <div className="flex items-center gap-3 mb-2 flex-shrink-0">
                    <ImageIcon size={18} className="text-azul-gradient" />
                    <h3 className="text-sm font-semibold">
                      {t("generation_pages.common.upload_image_label")}
                    </h3>
                  </div>
                  <div
                    className={`relative border-2 border-dashed rounded-lg p-2 text-center cursor-pointer transition-colors flex flex-col items-center justify-center flex-grow 
                      ${isFormDisabled ? "opacity-50 cursor-not-allowed" : ""}
                      ${texturePreview ? "border-azul-gradient bg-azul-gradient/5" : "border-gray-300 dark:border-linea/30"} 
                      hover:border-azul-gradient/50`}
                    onClick={() => !isFormDisabled && document.getElementById("texture-upload").click()}
                  >
                    <input id="texture-upload" type="file" accept="image/*" className="hidden" onChange={handleTextureChange} disabled={isFormDisabled} />
                    {texturePreview ? (
                      <div className="w-full h-full relative min-h-[150px]">
                        <img src={texturePreview} alt="Referencia de textura" className="absolute inset-0 w-full h-full object-contain rounded-lg p-1"/>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center p-4 min-h-[150px]">
                        <UploadSimple className="w-8 h-8 text-gray-400 mb-2" weight="light" />
                        <p className="text-sm text-gray-500 dark:text-gray-300">{t("generation_pages.common.drag_and_drop_prompt")}</p>
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">{t("generation_pages.common.file_types")}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-auto flex-shrink-0">
                  {isFormDisabled ? (
                    <button disabled className="w-full text-base font-semibold bg-gray-400 dark:bg-gray-600 py-3 rounded-lg flex items-center justify-center gap-2 text-white cursor-wait">
                      <InlineSpinner className="h-5 w-5" />
                      {t("generation_pages.common.generating_button")}
                    </button>
                  ) : isResultReady ? (
                     <div className="flex items-center gap-2">
                      <button onClick={handleRegenerateClick} disabled={isButtonDisabled} className="flex-grow text-base font-semibold bg-gradient-to-r from-azul-gradient to-morado-gradient py-3 rounded-lg flex items-center justify-center gap-2 transition-all hover:shadow-lg disabled:opacity-60 text-white">
                        <ArrowCounterClockwise size={20} weight="bold" />
                        {t("generation_pages.common.regenerate_button")}
                      </button>
                      <button onClick={resetComponentState} className="flex-shrink-0 w-12 text-base font-semibold bg-gray-200 dark:bg-linea/50 py-3 rounded-lg flex items-center justify-center transition-all hover:scale-105" title={t("generation_pages.common.new_project_button")}>
                        <FilePlus size={20} weight="bold" />
                      </button>
                    </div>
                  ) : (
                    <button onClick={handleCreatePrediction} disabled={isButtonDisabled} className="w-full text-base font-semibold bg-gradient-to-r from-azul-gradient to-morado-gradient py-3 rounded-lg flex items-center justify-center gap-2 transition-all hover:shadow-lg disabled:opacity-60 text-white">
                      <Sparkle size={22} weight="fill" />
                      {t("generation_pages.retexturize_3d.texture_button")}
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6 min-h-[400px] lg:min-h-0">
              <div className="flex flex-col">
                <h2 className="text-lg font-bold mb-2 text-center text-gray-700 dark:text-gray-300">
                  {t("generation_pages.retexturize_3d.original_model_title")}
                </h2>
                <div
                  className={`flex-grow rounded-2xl overflow-hidden transition-colors relative border-2 ${isFormDisabled ? "opacity-50 cursor-not-allowed" : ""} ${
                    modelUrl ? "border-gray-200 dark:border-linea/20" : "border-dashed border-gray-300 dark:border-linea/30"
                  }`}
                  onDragOver={!isFormDisabled ? handleDragOver : undefined}
                  onDragLeave={!isFormDisabled ? handleDragLeave : undefined}
                  onDrop={!isFormDisabled ? handleDrop : undefined}
                >
                  <input id="model-upload-hidden" type="file" accept=".glb,.obj" className="hidden" onChange={handleModelChange} disabled={isFormDisabled} />
                  <OriginalModelViewer modelUrl={modelUrl} modelKey={modelKey} />
                  <div
                    className={`absolute inset-0 z-10 transition-all duration-300 ${
                      isDragging && !isFormDisabled ? "bg-azul-gradient/10 border-2 border-dashed border-azul-gradient rounded-2xl" : "pointer-events-none"
                    }`}
                  >
                    {!modelUrl ? (
                      <button onClick={() => !isFormDisabled && document.getElementById("model-upload-hidden").click()} className="w-full h-full pointer-events-auto" aria-label="Subir modelo 3D" disabled={isFormDisabled} />
                    ) : (
                      <div className="absolute top-2 right-2 pointer-events-auto">
                        <button onClick={!isFormDisabled ? resetModelUpload : undefined} className="p-1.5 bg-red-500/80 hover:bg-red-500 text-white rounded-full shadow-lg backdrop-blur-sm transition-all opacity-50 hover:opacity-100" title="Cambiar modelo" disabled={isFormDisabled}>
                          <XCircle size={20} weight="fill" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-col">
                <h2 className="text-lg font-bold mb-2 text-center text-gray-700 dark:text-gray-300">
                  {t("generation_pages.retexturize_3d.retextured_model_title")}
                </h2>
                <div className="flex-grow border-2 border-gray-200 dark:border-linea/20 rounded-2xl overflow-hidden">
                  <RetexturizeResult onFirstLoad={handlePreviewUpload} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <ProgressModal show={isJobActive && !finalError} jobStatus={jobStatus} />
        <ErrorModal
          showModal={showErrorModal}
          closeModal={clearError}
          errorMessage={finalError || t("errors.generic_error_occurred")}
        />
      </section>
      <RegenerateConfirmationModal
        showModal={showRegenerateModal}
        closeModal={() => setShowRegenerateModal(false)}
        onConfirm={handleConfirmRegenerate}
        generationName={predictionResult?.generation_name || ""}
      />
    </>
  );
};