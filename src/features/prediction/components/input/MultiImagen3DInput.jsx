import { useState, useEffect, useCallback } from "react";
import {
  Sparkle,
  UploadSimple,
  TextAa,
  CheckCircle,
  ImageSquare,
  ArrowCounterClockwise,
  FilePlus,
} from "@phosphor-icons/react";
import { ErrorModal } from "../../../../components/modals/ErrorModal";
import { ProgressModal } from "../../../../components/modals/ProgressModal";
import { MultiImagen3DResult } from "../results/MultiImagen3DResult";
import { usePredictionHandler } from "../../hooks/usePredictionHandler";
import { useMultiImageUpload } from "../../hooks/useMultiImageUpload";
import { useAuth } from "../../../auth/hooks/useAuth";
import {
  usePredictions,
  usePredictionResult,
} from "../../context/PredictionContext";
import { uploadPredictionPreview } from "../../services/predictionApi";
import { useTranslation } from "react-i18next";
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

export const MultiImagen3DInput = ({ isCollapsed }) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { dispatch, clearResult } = usePredictions();
  const prediction_multiimg3d_result = usePredictionResult("MultiImagen3D");
  const PREDICTION_TYPE = "MultiImagen3D";
  const [generationName, setGenerationName] = useState("");
  const [isResultReady, setIsResultReady] = useState(false);
  const [showRegenerateModal, setShowRegenerateModal] = useState(false);

  const {
    imageFiles,
    imagePreviews,
    currentImageType,
    isDragging,
    handleFileChange,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    selectImageType,
    resetMultiImageState,
  } = useMultiImageUpload();

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
    resetMultiImageState();
    setIsResultReady(false);
    reset();
    clearResult(PREDICTION_TYPE);
  }, [clearResult, reset, resetMultiImageState]);

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
    if (
      !imageFiles.frontal || !imageFiles.lateral || !imageFiles.trasera || !generationName.trim()
    ) return;
    setIsResultReady(false);

    const formData = new FormData();
    formData.append("frontal", imageFiles.frontal);
    formData.append("lateral", imageFiles.lateral);
    formData.append("trasera", imageFiles.trasera);
    formData.append("generationName", generationName);
    await submitPrediction(PREDICTION_TYPE, formData);
  };

  const handleRegenerateClick = () => {
    if (isResultReady && prediction_multiimg3d_result) {
      setShowRegenerateModal(true);
    }
  };

  const handleConfirmRegenerate = async () => {
    setShowRegenerateModal(false);
    if (!user || !prediction_multiimg3d_result || !imageFiles.frontal || !imageFiles.lateral || !imageFiles.trasera) return;

    clearResult(PREDICTION_TYPE);
    setIsResultReady(false);

    const formData = new FormData();
    formData.append("frontal", imageFiles.frontal);
    formData.append("lateral", imageFiles.lateral);
    formData.append("trasera", imageFiles.trasera);

    await submitPrediction(
      PREDICTION_TYPE,
      formData,
      prediction_multiimg3d_result.generation_name
    );
  };
  
  const handlePreviewUpload = useCallback(
    async (dataURL) => {
      if (
        !user || !prediction_multiimg3d_result?.generation_name || prediction_multiimg3d_result?.previewImageUrl
      ) return;
      try {
        const token = await user.getIdToken();
        const previewBlob = dataURLtoBlob(dataURL);
        const formData = new FormData();
        formData.append("preview", previewBlob, "preview.png");
        formData.append("generation_name", prediction_multiimg3d_result.generation_name);
        formData.append("prediction_type_api", PREDICTION_TYPE);
        await uploadPredictionPreview(token, formData);
      } catch (error) {
        console.error("Error al subir la previsualización:", error);
      }
    },
    [user, prediction_multiimg3d_result]
  );

  const isFormDisabled = isJobActive;
  const isButtonDisabled = isJobActive || !generationName.trim() || !imageFiles.frontal || !imageFiles.lateral || !imageFiles.trasera;
  const showErrorModal = !!finalError;
  const hasAnyImage = imagePreviews.frontal || imagePreviews.lateral || imagePreviews.trasera;

  return (
    <>
      <section
        className={`w-full bg-white dark:bg-fondologin text-gray-800 dark:text-white transition-all duration-300 ease-in-out relative flex flex-col h-[calc(100vh-4rem)] ${
          isCollapsed ? "sm:pl-[80px]" : "md:pl-[267px] 2xl:pl-[300px]"
        }`}
      >
        <div className="relative z-10 px-4 sm:px-6 md:px-8 pt-6 pb-8 flex flex-col flex-grow min-h-0">
          <div className="mb-6 flex-shrink-0">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-azul-gradient to-morado-gradient">
                  {t("generation_pages.multi_image_to_3d.title")}
                </h1>
                <div className="h-1 w-24 bg-gradient-to-r from-azul-gradient to-morado-gradient rounded-full mt-1.5"></div>
              </div>
            </div>
          </div>
          <hr className="border-t-2 border-gray-200 dark:border-linea/20 mb-6 flex-shrink-0" />
          <div className="flex-grow flex flex-col xl:grid xl:grid-cols-5 xl:gap-4 min-h-0">
            <div className="xl:col-span-2 mb-6 xl:mb-0 xl:h-full xl:flex xl:flex-col">
              <div className="bg-gray-50 dark:bg-principal/30 backdrop-blur-sm border border-gray-200 dark:border-linea/20 rounded-2xl p-4 h-full flex flex-col space-y-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <TextAa size={18} className="text-azul-gradient" />
                    <h3 className="text-sm font-semibold text-gray-800 dark:text-white">
                      {t("generation_pages.common.generation_name_label")}
                    </h3>
                  </div>
                  <input
                    type="text"
                    placeholder={t("generation_pages.common.name_placeholder_generic")}
                    value={generationName}
                    onChange={(e) => setGenerationName(e.target.value)}
                    disabled={isFormDisabled || isResultReady}
                    className={`w-full p-2.5 rounded-lg bg-white dark:bg-principal/50 border-2 text-gray-800 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-azul-gradient/50 focus:border-azul-gradient transition-all duration-300 disabled:opacity-70 ${
                      generationName.trim() ? "border-azul-gradient" : "border-gray-300 dark:border-linea/30"
                    }`}
                  />
                </div>

                <div className="flex-grow flex flex-col min-h-0">
                  <div className="flex items-center gap-3 mb-2 flex-shrink-0">
                    <UploadSimple size={18} className="text-azul-gradient" />
                    <h3 className="text-sm font-semibold text-gray-800 dark:text-white">
                      {t("generation_pages.common.upload_views_label")}
                    </h3>
                  </div>
                  <div className="flex gap-2 mb-2 flex-shrink-0">
                    {["frontal", "lateral", "trasera"].map((type, index) => (
                      <button
                        key={type}
                        onClick={() => !isFormDisabled && selectImageType(type)}
                        disabled={isFormDisabled}
                        className={`flex-1 border-2 rounded-lg py-1.5 px-2 flex items-center justify-center transition-all text-xs h-10 gap-1.5 disabled:opacity-70 disabled:cursor-not-allowed
                        ${
                          currentImageType === type
                            ? "border-azul-gradient bg-azul-gradient/10 dark:bg-azul-gradient/20 shadow-md font-semibold text-gray-800 dark:text-white"
                            : "border-gray-300 dark:border-linea/30 hover:border-azul-gradient/50 bg-white dark:bg-principal/50 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                        }`}
                      >
                        <span className="capitalize">{t(`methods.multi_image_to_3d.views.${index}`)}</span>
                        {imageFiles[type] && <CheckCircle size={14} weight="fill" className="text-green-400" />}
                      </button>
                    ))}
                  </div>
                  <div
                    className={`relative border-2 border-dashed rounded-lg p-2 text-center cursor-pointer transition-colors flex flex-col justify-center items-center flex-grow 
                    ${isDragging ? "border-azul-gradient bg-azul-gradient/5" : ""} 
                    ${isFormDisabled ? "opacity-50 cursor-not-allowed" : "hover:border-azul-gradient/50"}`}
                    onDragOver={!isFormDisabled ? handleDragOver : undefined} onDragLeave={!isFormDisabled ? handleDragLeave : undefined} onDrop={!isFormDisabled ? handleDrop : undefined}
                    onClick={() => !isFormDisabled && document.getElementById("fileInput-multiimagen3d").click()}
                  >
                    <input id="fileInput-multiimagen3d" type="file" accept="image/*" onChange={handleFileChange} disabled={isFormDisabled} className="hidden" />
                    
                    {hasAnyImage ? (
                      <div className="grid grid-cols-3 gap-2 w-full max-w-xs mx-auto">
                        {["frontal", "lateral", "trasera"].map((type, index) => (
                          <div
                            key={type}
                            className="relative w-full pt-[100%] bg-gray-100 dark:bg-principal/30 rounded-md overflow-hidden border-2 border-transparent"
                          >
                            {imagePreviews[type] ? (
                              <img src={imagePreviews[type]} alt={`Vista ${type}`} className="absolute top-0 left-0 w-full h-full object-contain p-1" />
                            ) : (
                              <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center text-gray-400 dark:text-gray-500 p-1">
                                <ImageSquare size={24} />
                                <span className="text-xs mt-1 text-center">{t(`methods.multi_image_to_3d.views.${index}`)}</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center p-4 min-h-[200px] sm:min-h-[220px] xl:min-h-0">
                        <UploadSimple className="w-10 h-10 text-gray-400 mb-3" weight="light" />
                        <p className="text-sm text-gray-500 dark:text-gray-300 capitalize">
                          {t("generation_pages.common.drag_and_drop_views")}{" "}
                          <strong className="text-gray-700 dark:text-white">
                            {t(`methods.multi_image_to_3d.views.${["frontal","lateral","trasera"].indexOf(currentImageType)}`)}
                          </strong>
                        </p>
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
                      <button
                        onClick={handleRegenerateClick}
                        disabled={isButtonDisabled}
                        className="flex-grow text-base font-semibold bg-gradient-to-r from-azul-gradient to-morado-gradient py-3 rounded-lg flex items-center justify-center gap-2 transition-all hover:shadow-lg disabled:opacity-60 text-white"
                      >
                        <ArrowCounterClockwise size={20} weight="bold" />
                        {t("generation_pages.common.regenerate_button")}
                      </button>
                      <button
                        onClick={resetComponentState}
                        className="flex-shrink-0 w-12 text-base font-semibold bg-gray-200 dark:bg-linea/50 py-3 rounded-lg flex items-center justify-center transition-all hover:scale-105"
                        title={t("generation_pages.common.new_project_button")}
                      >
                        <FilePlus size={20} weight="bold" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={handleCreatePrediction}
                      disabled={isButtonDisabled}
                      className="w-full text-base font-semibold bg-gradient-to-r from-azul-gradient to-morado-gradient py-3 rounded-lg flex items-center justify-center gap-2 transition-all hover:shadow-lg disabled:opacity-60 text-white"
                    >
                      <Sparkle size={22} weight="fill" />
                      {t("generation_pages.common.generate_button")}
                    </button>
                  )}
                </div>
              </div>
            </div>
            <div className="xl:col-span-3 flex-grow min-h-[400px] sm:min-h-[500px] md:min-h-[600px] xl:min-h-0">
              <div className="h-full border-2 border-gray-200 dark:border-linea/20 rounded-3xl overflow-hidden">
                <MultiImagen3DResult onFirstLoad={handlePreviewUpload} />
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
        generationName={prediction_multiimg3d_result?.generation_name || ""}
      />
    </>
  );
};