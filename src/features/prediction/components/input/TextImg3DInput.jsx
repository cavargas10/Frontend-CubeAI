import { useState, useEffect, useCallback } from "react";
import {
  Sparkle,
  TextAa,
  TextT,
  PaintBrush,
  ArrowCounterClockwise,
  Cube,
  FilePlus,
} from "@phosphor-icons/react";
import { ErrorModal } from "../../../../components/modals/ErrorModal";
import { ProgressModal } from "../../../../components/modals/ProgressModal";
import { TextImg3DResult } from "../results/TextImg3DResult";
import { usePredictionHandler } from "../../hooks/usePredictionHandler";
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

export const TextImg3DInput = ({ isCollapsed }) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { dispatch, clearResult } = usePredictions();
  const predictionResult = usePredictionResult("TextImg3D");
  const PREDICTION_TYPE = "TextImg3D";

  const [generationName, setGenerationName] = useState("");
  const [subject, setSubject] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("none");
  const [currentStep, setCurrentStep] = useState(1);
  const [generatedImageUrl, setGeneratedImageUrl] = useState(null);
  const [showRegenerateModal, setShowRegenerateModal] = useState(false);
  const [lastPreviewUploadUrl, setLastPreviewUploadUrl] = useState(null);

  const {
    submitPrediction,
    jobStatus,
    result,
    error: finalError,
    reset: resetPredictionHandler,
    clearError,
    isJobActive,
  } = usePredictionHandler(user);

  const styles = [
    { name: t("generation_pages.styles.none"), value: "none" },
    { name: t("generation_pages.styles.disney"), value: "disney" },
    { name: t("generation_pages.styles.pixar"), value: "pixar" },
    { name: t("generation_pages.styles.realistic"), value: "realistic" },
    { name: t("generation_pages.styles.anime"), value: "anime" },
    { name: t("generation_pages.styles.chibi"), value: "chibi" },
  ];

  const resetComponentState = useCallback(() => {
    setGenerationName("");
    setSubject("");
    setSelectedStyle("none");
    setCurrentStep(1);
    setGeneratedImageUrl(null);
    setLastPreviewUploadUrl(null);
    resetPredictionHandler();
    clearResult("TextImg3D");
  }, [resetPredictionHandler, clearResult]);

  useEffect(() => {
    if (!result) return;

    if (result.generated_2d_image_url) {
      const imageUrlWithCacheBuster = `${result.generated_2d_image_url}?t=${new Date().getTime()}`;
      setGeneratedImageUrl(imageUrlWithCacheBuster);
      setCurrentStep(2);
    } else if (result.modelUrl) {
      dispatch({ type: "SET_PREDICTION", payload: { type: PREDICTION_TYPE, result } });
      setCurrentStep(3);
    }
  }, [result, dispatch]);

  useEffect(() => {
    return () => {
      resetComponentState();
    };
  }, []);

  const handleImageGeneration = async () => {
    if (!generationName.trim() || !subject.trim()) return;
    clearResult(PREDICTION_TYPE);
    setGeneratedImageUrl(null);
    setCurrentStep(1);
    const payload = { generationName, prompt: subject, selectedStyle };
    await submitPrediction("TextoImagen2D", payload);
  };

  const handleModelGeneration = async () => {
    if (!generatedImageUrl) return;
    const payload = { generationName, imageUrl: generatedImageUrl, prompt: subject, selectedStyle };
    await submitPrediction(PREDICTION_TYPE, payload);
  };

  const handleRegenerateModelClick = () => {
    if (predictionResult) {
      setShowRegenerateModal(true);
    }
  };

  const handleConfirmRegenerateModel = async () => {
    setShowRegenerateModal(false);
    if (!user || !predictionResult) return;
    clearResult(PREDICTION_TYPE);    
    const payload = { imageUrl: generatedImageUrl, prompt: subject, selectedStyle };
    await submitPrediction(PREDICTION_TYPE, payload, predictionResult.generation_name);
  };
  
  const handlePreviewUpload = useCallback(
    async (dataURL) => {
      if (!user || !predictionResult?.generation_name || lastPreviewUploadUrl === dataURL) return;
      try {
        const token = await user.getIdToken();
        const blob = await (await fetch(dataURL)).blob();
        const formData = new FormData();
        formData.append("preview", blob, "preview.png");
        formData.append("generation_name", predictionResult.generation_name);
        formData.append("prediction_type_api", PREDICTION_TYPE);
        await uploadPredictionPreview(token, formData);
        setLastPreviewUploadUrl(dataURL);
      } catch (error) {
        console.error("Error al subir la previsualización del modelo:", error);
      }
    },
    [user, predictionResult, lastPreviewUploadUrl]
  );
  
  const isButtonDisabled = isJobActive || !generationName.trim() || !subject.trim();
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
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-azul-gradient to-morado-gradient">
                  {t("generation_pages.text_image_to_3d.title")}
                </h1>
                <div className="h-1 w-24 bg-gradient-to-r from-azul-gradient to-morado-gradient rounded-full mt-1.5"></div>
              </div>
            </div>
          </div>
          <hr className="border-t-2 border-gray-200 dark:border-linea/20 mb-6 flex-shrink-0" />

          <div className="flex-grow flex flex-col xl:grid xl:grid-cols-5 gap-4">
            <div className="xl:col-span-2 flex-shrink-0">
              <div className="bg-gray-50 dark:bg-principal/30 backdrop-blur-sm border border-gray-200 dark:border-linea/20 rounded-2xl p-3 h-full flex flex-col space-y-2">
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
                    disabled={isJobActive || currentStep > 1}
                    className={`w-full p-2 rounded-lg bg-white dark:bg-principal/50 border-2 text-gray-800 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-azul-gradient/50 focus:border-azul-gradient transition-all duration-300 disabled:opacity-70 ${
                      generationName.trim() ? "border-azul-gradient" : "border-gray-300 dark:border-linea/30"
                    }`}
                  />
                </div>

                <div className="flex-grow flex flex-col">
                  <div className="flex items-center gap-3 mb-2">
                    <TextT size={18} className="text-azul-gradient" />
                    <h3 className="text-sm font-semibold text-gray-800 dark:text-white">
                      {t("generation_pages.common.prompt_label")}
                    </h3>
                  </div>
                  <textarea
                    placeholder={t("generation_pages.common.prompt_placeholder_generic")}
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    disabled={isJobActive || currentStep === 3}
                    className={`w-full p-2 rounded-lg bg-white dark:bg-principal/50 border-2 text-gray-800 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-azul-gradient/50 focus:border-azul-gradient transition-all duration-300 min-h-[80px] flex-grow resize-none disabled:opacity-70 ${
                      subject.trim() ? "border-azul-gradient" : "border-gray-300 dark:border-linea/30"
                    }`}
                  />
                </div>

                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <PaintBrush size={18} className="text-azul-gradient" />
                    <h3 className="text-sm font-semibold text-gray-800 dark:text-white">
                      {t("generation_pages.common.style_label")}
                    </h3>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {styles.map((style) => (
                      <button
                        key={style.value}
                        onClick={() => setSelectedStyle(style.value)}
                        disabled={isJobActive || currentStep === 3}
                        className={`border-2 rounded-lg py-2 px-2 flex items-center justify-center transition-all text-xs h-10 disabled:opacity-70 disabled:cursor-not-allowed ${
                          selectedStyle === style.value
                            ? "border-azul-gradient bg-azul-gradient/10 dark:bg-azul-gradient/20 shadow-md scale-105 font-semibold ring-2 ring-azul-gradient/50 text-gray-800 dark:text-white"
                            : "border-gray-300 dark:border-linea/30 hover:border-azul-gradient/50 bg-white dark:bg-principal/50 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                        }`}
                      >
                        <span>{style.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-auto flex-shrink-0">
                  {isJobActive ? (
                     <button disabled className="w-full text-base font-semibold bg-gray-400 dark:bg-gray-600 py-2.5 rounded-lg flex items-center justify-center gap-2 text-white cursor-wait">
                        <InlineSpinner className="h-5 w-5" />
                        Generando...
                    </button>
                  ) : currentStep === 1 ? (
                    <button onClick={handleImageGeneration} disabled={isButtonDisabled} className="w-full text-base font-semibold bg-gradient-to-r from-azul-gradient to-morado-gradient py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all hover:shadow-lg disabled:opacity-60 text-white">
                        <Sparkle size={22} weight="fill" />
                        {t("generation_pages.text_image_to_3d_steps.generate_2d_button")}
                    </button>
                  ) : currentStep === 2 ? (
                    <div className="flex items-center gap-2">
                      <button onClick={handleImageGeneration} disabled={isButtonDisabled} className="w-1/2 text-sm font-semibold bg-gray-200 dark:bg-linea/50 text-gray-700 dark:text-white hover:bg-gray-300 dark:hover:bg-linea/80 py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all hover:scale-105">
                          <ArrowCounterClockwise size={18} weight="bold" />
                          {t("generation_pages.text_image_to_3d_steps.regenerate_2d_button")}
                      </button>
                      <button onClick={handleModelGeneration} disabled={isButtonDisabled} className="w-1/2 text-sm font-semibold bg-gradient-to-r from-azul-gradient to-morado-gradient py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all hover:shadow-lg disabled:opacity-60 text-white">
                          <Cube size={18} weight="bold" />
                          {t("generation_pages.text_image_to_3d_steps.generate_3d_button")}
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                       <button onClick={handleRegenerateModelClick} disabled={isJobActive} className="flex-grow text-base font-semibold bg-gradient-to-r from-azul-gradient to-morado-gradient py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all hover:shadow-lg disabled:opacity-60 text-white">
                        <ArrowCounterClockwise size={20} weight="bold" />
                        Regenerar Modelo
                      </button>
                      <button onClick={resetComponentState} className="flex-shrink-0 w-12 text-base font-semibold bg-gray-200 dark:bg-linea/50 py-2.5 rounded-lg flex items-center justify-center transition-all hover:scale-105" title="Nuevo Proyecto">
                        <FilePlus size={20} weight="bold" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="xl:col-span-3 flex-grow min-h-[400px] sm:min-h-[500px] md:min-h-[600px] xl:min-h-0">
              <div className="h-full border-2 border-gray-200 dark:border-linea/20 rounded-3xl overflow-hidden flex flex-col relative">
                {currentStep === 3 ? (
                  <TextImg3DResult onFirstLoad={handlePreviewUpload} />
                ) : generatedImageUrl ? (
                  <div className="w-full h-full relative p-4 bg-gray-100 dark:bg-principal/50">
                    <img src={generatedImageUrl} alt={t("generation_pages.results.generated_2d_image")} className="absolute inset-0 w-full h-full object-contain" />
                  </div>
                ) : (
                  <TextImg3DResult />
                )}
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
        onConfirm={handleConfirmRegenerateModel}
        generationName={predictionResult?.generation_name || ""}
      />
    </>
  );
};