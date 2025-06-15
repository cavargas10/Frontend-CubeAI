import { useState, useEffect, useCallback } from "react";
import { Sparkle, TextAa, TextT, PaintBrush } from "@phosphor-icons/react";
import { ErrorModal } from "../../../../components/modals/ErrorModal";
import { LoadingModal } from "../../../../components/modals/LoadingModal";
import { Texto3DResult } from "../results/Texto3DResult";
import { usePredictionHandler } from "../../hooks/usePredictionHandler";
import { useAuth } from "../../../auth/hooks/useAuth";
import { usePredictions } from "../../context/PredictionContext";
import { uploadPredictionPreview } from "../../services/predictionApi";
import { useTranslation } from "react-i18next";

function dataURLtoBlob(dataurl) {
    const arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {type:mime});
}

export const Texto3DInput = ({ isCollapsed }) => {
  const { t } = useTranslation();

  const { user } = useAuth();
  const { dispatch, clearResult, prediction_text3d_result } = usePredictions();
  const [generationName, setGenerationName] = useState("");
  const [userPrompt, setUserPrompt] = useState("");
  const [selectedStyle, setSelectedStyle] = useState(null);
  const styles = [
    { name: t("generation_pages.styles.disney"), value: "disney" },
    { name: t("generation_pages.styles.pixar"), value: "pixar" },
    { name: t("generation_pages.styles.realistic"), value: "realistic" },
    { name: t("generation_pages.styles.anime"), value: "anime" },
    { name: t("generation_pages.styles.chibi"), value: "chibi" },
  ];

  const {
    isLoading: predictionLoading,
    error: predictionError,
    loadingSteps,
    submitPrediction,
    clearError: clearPredictionError,
    setError: setPredictionError,
  } = usePredictionHandler(user);

  const resetComponentState = useCallback(() => {
    setGenerationName("");
    setUserPrompt("");
    setSelectedStyle(null);
    clearPredictionError();
    clearResult('text3d');
  }, [clearPredictionError, clearResult]);

  useEffect(() => {
    return () => {
      resetComponentState();
    };
  }, [resetComponentState]);

  const handleLocalPrediction = async () => {
    if (!generationName.trim() || !userPrompt.trim() || !selectedStyle) {
      setPredictionError("Todos los campos (Nombre, Prompt, Estilo) son obligatorios");
      return;
    }
    
    dispatch({ type: 'SET_PREDICTION', payload: { type: 'text3d', result: null } });

    const result = await submitPrediction("texto3D", {
      generationName,
      prompt: userPrompt,
      selectedStyle,
    });
    
    if (result) {
      dispatch({ type: 'SET_PREDICTION', payload: { type: 'text3d', result } });
    }
  };

  const handlePreviewUpload = useCallback(async (dataURL) => {
    if (!user || !prediction_text3d_result || !prediction_text3d_result.generation_name) return;
    if (prediction_text3d_result.previewImageUrl) return;

    try {
        const token = await user.getIdToken();
        const previewBlob = dataURLtoBlob(dataURL);
        const formData = new FormData();
        formData.append('preview', previewBlob, 'preview.png');
        formData.append('generation_name', prediction_text3d_result.generation_name);
        formData.append('prediction_type_api', 'Texto3D');

        await uploadPredictionPreview(token, formData);
        console.log("Previsualización subida con éxito para 'Texto a 3D'.");
        
    } catch (error) {
        console.error("Error al subir la previsualización:", error);
    }
  }, [user, prediction_text3d_result]);

  const isButtonDisabled =
    predictionLoading ||
    !generationName.trim() ||
    !userPrompt.trim() ||
    !selectedStyle;

  return (
    <section
      className={`w-full bg-white dark:bg-fondologin text-gray-800 dark:text-white transition-all duration-300 ease-in-out relative flex flex-col h-[calc(100vh-4rem)] ${
        isCollapsed ? "sm:pl-[80px]" : "md:pl-[267px] 2xl:pl-[300px]"
      }`}
    >
      <div className="relative z-10 px-4 sm:px-6 md:px-8 pt-6 pb-8 flex flex-col flex-grow">
        <div className="mb-6 flex-shrink-0">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-azul-gradient to-morado-gradient">
                {t("generation_pages.text_to_3d.title")}
              </h1>
              <div className="h-1 w-24 bg-gradient-to-r from-azul-gradient to-morado-gradient rounded-full mt-1.5"></div>
            </div>
          </div>
        </div>

        <hr className="border-t-2 border-gray-200 dark:border-linea/20 mb-6 flex-shrink-0" />

        <div className="flex-grow flex flex-col xl:grid xl:grid-cols-5 gap-4">
          {/* --- Columna de Inputs --- */}
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
                  disabled={predictionLoading}
                  className={`w-full p-2 rounded-lg bg-white dark:bg-principal/50 border-2 text-gray-800 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-azul-gradient/50 focus:border-azul-gradient transition-all duration-300 ${
                    generationName.trim()
                      ? "border-azul-gradient"
                      : "border-gray-300 dark:border-linea/30"
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
                  value={userPrompt}
                  onChange={(e) => setUserPrompt(e.target.value)}
                  disabled={predictionLoading}
                  className={`w-full p-2 rounded-lg bg-white dark:bg-principal/50 border-2 text-gray-800 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-azul-gradient/50 focus:border-azul-gradient transition-all duration-300 min-h-[80px] flex-grow resize-none ${
                    userPrompt.trim()
                      ? "border-azul-gradient"
                      : "border-gray-300 dark:border-linea/30"
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
                {/* --- Botones de Estilo --- */}
                <div className="grid grid-cols-3 gap-2">
                  {styles.slice(0, 3).map((style) => (
                    <button
                      key={style.value}
                      onClick={() => setSelectedStyle(style.value)}
                      disabled={predictionLoading}
                      className={`border-2 rounded-lg py-2 px-2 flex items-center justify-center transition-all text-xs h-10 ${
                        selectedStyle === style.value
                          ? "border-azul-gradient bg-azul-gradient/10 dark:bg-azul-gradient/20 shadow-md scale-105 font-semibold ring-2 ring-azul-gradient/50 text-gray-800 dark:text-white"
                          : "border-gray-300 dark:border-linea/30 hover:border-azul-gradient/50 bg-white dark:bg-principal/50 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                      }`}
                    >
                      <span>{style.name}</span>
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {styles.slice(3).map((style) => (
                    <button
                      key={style.value}
                      onClick={() => setSelectedStyle(style.value)}
                      disabled={predictionLoading}
                      className={`border-2 rounded-lg py-2 px-2 flex items-center justify-center transition-all text-xs h-10 ${
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
                <button
                  onClick={handleLocalPrediction}
                  disabled={isButtonDisabled}
                  className="w-full text-base font-semibold bg-gradient-to-r from-azul-gradient to-morado-gradient py-2.5 rounded-lg border-none flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-lg hover:shadow-morado-gradient/20 hover:scale-105 disabled:opacity-60 disabled:hover:scale-100 disabled:cursor-not-allowed text-white"
                >
                  <Sparkle size={22} weight="fill" />
                  {t("generation_pages.common.generate_button")}
                </button>
              </div>
            </div>
          </div>
          {/* --- Columna del Resultado --- */}
          <div className="xl:col-span-3 flex-grow min-h-0">
            <div className="h-full min-h-[400px] sm:min-h-[500px] md:min-h-[600px] xl:min-h-0 border-2 border-gray-200 dark:border-linea/20 rounded-3xl overflow-hidden">
              <Texto3DResult onFirstLoad={handlePreviewUpload} />
            </div>
          </div>
        </div>
      </div>

      <ErrorModal
        showModal={!!predictionError}
        closeModal={clearPredictionError}
        errorMessage={predictionError || ""}
      />
      <LoadingModal
        showLoadingModal={predictionLoading}
        steps={loadingSteps}
      />
    </section>
  );
};