import { useState, useEffect, useCallback } from "react";
import {
  Sparkle,
  TextAa,
  TextT,
  PaintBrush,
  ChatText,
  ArrowCounterClockwise,
  Cube,
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

export const TextImg3DInput = ({ isCollapsed }) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { dispatch, clearResult } = usePredictions();
  const predictionResult = usePredictionResult("TextImg3D");
  const [generationName, setGenerationName] = useState("");
  const [subject, setSubject] = useState("");
  const [selectedStyle, setSelectedStyle] = useState(null);
  const [additionalDetails, setAdditionalDetails] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const [generatedImageUrl, setGeneratedImageUrl] = useState(null);
  const [lastPreviewUploadUrl, setLastPreviewUploadUrl] = useState(null);

  const {
    submitPrediction,
    isLoading,
    jobStatus,
    result,
    error,
    reset: resetPredictionHandler,
  } = usePredictionHandler(user);

  const styles = [
    { name: t("generation_pages.styles.disney"), value: "disney" },
    { name: t("generation_pages.styles.pixar"), value: "pixar" },
    { name: t("generation_pages.styles.realistic"), value: "realistic" },
    { name: t("generation_pages.styles.anime"), value: "anime" },
    { name: t("generation_pages.styles.chibi"), value: "chibi" },
  ];

  const resetComponentState = useCallback(() => {
    setGenerationName("");
    setSubject("");
    setSelectedStyle(null);
    setAdditionalDetails("");
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
      resetPredictionHandler();
    } else if (result.modelUrl) {
      dispatch({
        type: "SET_PREDICTION",
        payload: { type: "TextImg3D", result },
      });
      resetPredictionHandler();
    }
  }, [result, dispatch, resetPredictionHandler]);

  useEffect(() => {
    return () => {
      resetComponentState();
    };
  }, [resetComponentState]);

  const handleImageGeneration = async () => {
    if (!generationName.trim() || !subject.trim() || !selectedStyle) return;
    setCurrentStep(1);
    setGeneratedImageUrl(null);
    clearResult("TextImg3D");
    
    const payload = {
      generationName,
      subject,
      style: selectedStyle,
      additionalDetails,
    };
    await submitPrediction("TextoImagen2D", payload);
  };

  const handleModelGeneration = async () => {
    if (!generatedImageUrl) return;
    await submitPrediction("TextImg3D", {
      generationName,
      imageUrl: generatedImageUrl,
    });
  };

  const handleMainButtonClick = () => {
    if (currentStep === 1) {
      handleImageGeneration();
    } else {
      handleModelGeneration();
    }
  };

  const handlePreviewUpload = useCallback(
    async (dataURL) => {
      if (!user || !predictionResult?.generation_name || lastPreviewUploadUrl === dataURL)
        return;
      try {
        const token = await user.getIdToken();
        const blob = await (await fetch(dataURL)).blob();
        const formData = new FormData();
        formData.append("preview", blob, "preview.png");
        formData.append("generation_name", predictionResult.generation_name);
        formData.append("prediction_type_api", "TextImg3D");
        await uploadPredictionPreview(token, formData);
        setLastPreviewUploadUrl(dataURL);
      } catch (error) {
        console.error("Error al subir la previsualización del modelo:", error);
      }
    },
    [user, predictionResult, lastPreviewUploadUrl]
  );
  
  const isAnyProcessRunning = isLoading || !!jobStatus;
  const isFormLocked = currentStep === 2 || isAnyProcessRunning;
  const isMainButtonDisabled = isAnyProcessRunning || (currentStep === 1 && (!generationName.trim() || !subject.trim() || !selectedStyle)) || (currentStep === 2 && !generatedImageUrl);
  const showProgressModal = isAnyProcessRunning && jobStatus?.status !== 'completed';

  return (
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

        <div className="flex-grow flex flex-col xl:grid xl:grid-cols-5 gap-4 min-h-0">
          <div className="xl:col-span-2 flex flex-col mb-6 xl:mb-0">
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
                  disabled={isFormLocked}
                  className={`w-full p-2 rounded-lg bg-white dark:bg-principal/50 border-2 text-gray-800 dark:text-white text-sm placeholder-gray-400 focus:ring-2 focus:ring-azul-gradient/50 focus:border-azul-gradient transition-all duration-300 disabled:opacity-70 ${
                    generationName.trim()
                      ? "border-azul-gradient"
                      : "border-gray-300 dark:border-linea/30"
                  }`}
                />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <TextT size={18} className="text-azul-gradient" />
                  <h3 className="text-sm font-semibold text-gray-800 dark:text-white">
                    {t("generation_pages.common.prompt_label")}
                  </h3>
                </div>
                <input
                  type="text"
                  placeholder={t("generation_pages.common.prompt_placeholder_generic")}
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  disabled={isFormLocked}
                  className={`w-full p-2 rounded-lg bg-white dark:bg-principal/50 border-2 text-gray-800 dark:text-white text-sm placeholder-gray-400 focus:ring-2 focus:ring-azul-gradient/50 focus:border-azul-gradient transition-all duration-300 disabled:opacity-70 ${
                    subject.trim()
                      ? "border-azul-gradient"
                      : "border-gray-300 dark:border-linea/30"
                  }`}
                />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <ChatText size={18} className="text-azul-gradient" />
                  <h3 className="text-sm font-semibold text-gray-800 dark:text-white">
                    {t("generation_pages.common.details_label")}
                  </h3>
                </div>
                <input
                  type="text"
                  placeholder={t("generation_pages.common.details_placeholder_generic")}
                  value={additionalDetails}
                  onChange={(e) => setAdditionalDetails(e.target.value)}
                  disabled={isFormLocked}
                  className={`w-full p-2 rounded-lg bg-white dark:bg-principal/50 border-2 text-gray-800 dark:text-white text-sm placeholder-gray-400 focus:ring-2 focus:ring-azul-gradient/50 focus:border-azul-gradient transition-all duration-300 disabled:opacity-70 ${
                    additionalDetails.trim()
                      ? "border-azul-gradient"
                      : "border-gray-300 dark:border-linea/30"
                  }`}
                />
              </div>
              <div className="flex-grow flex flex-col">
                <div className="flex items-center gap-3 mb-2">
                  <PaintBrush size={18} className="text-azul-gradient" />
                  <h3 className="text-sm font-semibold text-gray-800 dark:text-white">
                    {t("generation_pages.common.style_label")}
                  </h3>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {styles.slice(0, 3).map((style) => (
                    <button key={style.value} onClick={() => setSelectedStyle(style.value)} disabled={isFormLocked}
                      className={`border-2 rounded-lg py-2 px-2 flex items-center justify-center transition-all text-xs h-10 disabled:opacity-70 disabled:cursor-not-allowed ${
                        selectedStyle === style.value
                          ? "border-azul-gradient bg-azul-gradient/10 dark:bg-azul-gradient/20 shadow-md scale-105 font-semibold ring-2 ring-azul-gradient/50 text-gray-800 dark:text-white"
                          : "border-gray-300 dark:border-linea/30 hover:border-azul-gradient/50 bg-white dark:bg-principal/50 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                      }`}
                    ><span>{style.name}</span></button>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {styles.slice(3).map((style) => (
                    <button key={style.value} onClick={() => setSelectedStyle(style.value)} disabled={isFormLocked}
                      className={`border-2 rounded-lg py-2 px-2 flex items-center justify-center transition-all text-xs h-10 disabled:opacity-70 disabled:cursor-not-allowed ${
                        selectedStyle === style.value
                          ? "border-azul-gradient bg-azul-gradient/10 dark:bg-azul-gradient/20 shadow-md scale-105 font-semibold ring-2 ring-azul-gradient/50 text-gray-800 dark:text-white"
                          : "border-gray-300 dark:border-linea/30 hover:border-azul-gradient/50 bg-white dark:bg-principal/50 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                      }`}
                    ><span>{style.name}</span></button>
                  ))}
                </div>
              </div>

              <div className="mt-auto pt-2">
                  <button onClick={handleMainButtonClick} disabled={isMainButtonDisabled}
                    className="w-full text-base font-semibold bg-gradient-to-r from-azul-gradient to-morado-gradient py-2.5 rounded-lg border-none flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-lg hover:shadow-morado-gradient/20 hover:scale-105 disabled:opacity-60 disabled:hover:scale-100 disabled:cursor-not-allowed text-white"
                  >
                    {currentStep === 1 ? <Sparkle size={22} weight="fill" /> : <Cube size={22} weight="fill" />}
                    {currentStep === 1 
                      ? t("generation_pages.text_image_to_3d_steps.generate_2d_button") 
                      : t("generation_pages.text_image_to_3d_steps.generate_3d_button")
                    }
                  </button>
              </div>
            </div>
          </div>

          <div className="xl:col-span-3 flex-grow min-h-[400px] sm:min-h-[500px] md:min-h-[600px] xl:min-h-0">
            <div className="h-full border-2 border-gray-200 dark:border-linea/20 rounded-3xl overflow-hidden flex flex-col relative">
              {predictionResult ? (
                 <TextImg3DResult onFirstLoad={handlePreviewUpload} />
              ) : generatedImageUrl ? (
                <div className="flex-1 flex flex-col items-center justify-center p-4 bg-gray-100 dark:bg-principal/50 overflow-hidden relative">
                  <img src={generatedImageUrl} alt={t("generation_pages.results.generated_2d_image")}
                    className="w-full h-full object-contain rounded-lg shadow-2xl"
                  />
                  {!isAnyProcessRunning && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10">
                      <button onClick={handleImageGeneration} disabled={isAnyProcessRunning}
                        className="bg-white/80 dark:bg-principal/80 backdrop-blur-md py-2 px-4 rounded-lg flex items-center gap-2 transition-all hover:scale-105 shadow-lg text-gray-800 dark:text-white border border-gray-300 dark:border-linea/20"
                      >
                        <ArrowCounterClockwise size={20} />
                        {t("generation_pages.text_image_to_3d_steps.regenerate_2d_button")}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <TextImg3DResult />
              )}
            </div>
          </div>
        </div>
      </div>

      <ProgressModal show={showProgressModal} jobStatus={jobStatus} />
      <ErrorModal
        showModal={error}
        closeModal={resetComponentState}
        errorMessage={error}
      />
    </section>
  );
};