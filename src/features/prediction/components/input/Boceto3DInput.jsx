import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import {
  Sparkle,
  PencilSimple,
  Eraser,
  Trash,
  TextAa,
} from "@phosphor-icons/react";
import { ErrorModal } from "../../../../components/modals/ErrorModal";
import { ProgressModal } from "../../../../components/modals/ProgressModal";
import { Boceto3DResult } from "../results/Boceto3DResult";
import { usePredictionHandler } from "../../hooks/usePredictionHandler";
import { useAsyncGeneration } from "../../hooks/useAsyncGeneration";
import { useCanvasDrawing } from "../../hooks/useCanvasDrawing";
import { useAuth } from "../../../auth/hooks/useAuth";
import { usePredictions } from "../../context/PredictionContext";
import { uploadPredictionPreview } from "../../services/predictionApi";
import { useTranslation } from "react-i18next";

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

export const Boceto3DInput = ({ isCollapsed }) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { dispatch, clearResult, prediction_boceto3d_result } = usePredictions();
  const [generationName, setGenerationName] = useState("");
  const [description, setDescription] = useState("");
  const canvasConfig = useMemo(
    () => ({
      width: 800,
      height: 400,
      pencilConfig: { strokeStyle: "#000000", lineWidth: 2, lineCap: "round" },
      eraserSize: 20,
      backgroundColor: "#FFFFFF",
    }),
    []
  );

  const {
    drawingState,
    setDrawingState,
    initializeCanvas,
    startDrawing,
    stopDrawing,
    handleDraw,
    clearCanvas,
    isCanvasEmpty,
  } = useCanvasDrawing(canvasConfig);
  const canvasForDataRef = useRef(null);
  const [jobId, setJobId] = useState(null);
  const [jobType, setJobType] = useState(null);
  const {
    isLoading: isSubmitting,
    error: submissionError,
    submitPrediction,
  } = usePredictionHandler(user);

  const { jobStatus, result, pollingError, reset: resetPolling } = useAsyncGeneration(jobId, jobType);

  const resetComponentState = useCallback(() => {
    setGenerationName("");
    setDescription("");
    clearCanvas();
    setJobId(null);
    setJobType(null);
    resetPolling();
    clearResult("boceto3d");
  }, [clearCanvas, clearResult, resetPolling]);

  useEffect(() => {
    if (result) {
      dispatch({ type: "SET_PREDICTION", payload: { type: "boceto3d", result } });
      setTimeout(() => {
        setJobId(null);
        setJobType(null);
      }, 2000);
    }
  }, [result, dispatch]);

  useEffect(() => {
    return () => {
      resetComponentState();
    };
  }, [resetComponentState]);

  const getCanvasDataURL = useCallback((type = "image/png", quality) => {
    if (!canvasForDataRef.current) return null;
    return canvasForDataRef.current.toDataURL(type, quality);
  }, []);

  const dataURLtoFile = useCallback(
    (dataURL, filename) => {
      try {
        const blob = dataURLtoBlob(dataURL);
        return new File([blob], filename, { type: blob.type });
      } catch (error) {
        console.error("Error al convertir dataURL a File:", error);
        return null;
      }
    },
    []
  );
  
  const handleLocalPrediction = useCallback(async () => {
    if (!generationName.trim() || isCanvasEmpty()) {
      return;
    }

    clearResult("boceto3d");
    const currentJobType = "Boceto3D";
    setJobType(currentJobType);

    const image = getCanvasDataURL("image/png");
    if (!image) return;
    const imageFile = dataURLtoFile(image, "boceto.png");
    if (!imageFile) return;

    const formData = new FormData();
    formData.append("image", imageFile);
    formData.append("generationName", generationName);
    formData.append("description", description);

    const response = await submitPrediction(currentJobType, formData);
    if (response && response.job_id) {
      setJobId(response.job_id);
    }
  }, [generationName, description, submitPrediction, getCanvasDataURL, isCanvasEmpty, dataURLtoFile, clearResult]);

  const handlePreviewUpload = useCallback(
    async (dataURL) => {
      if (!user || !prediction_boceto3d_result?.generation_name || prediction_boceto3d_result?.previewImageUrl) return;
      try {
        const token = await user.getIdToken();
        const previewBlob = dataURLtoBlob(dataURL);
        const formData = new FormData();
        formData.append("preview", previewBlob, "preview.png");
        formData.append("generation_name", prediction_boceto3d_result.generation_name);
        formData.append("prediction_type_api", "Boceto3D");
        await uploadPredictionPreview(token, formData);
      } catch (error) {
        console.error("Error al subir la previsualización:", error);
      }
    },
    [user, prediction_boceto3d_result]
  );
  
  const setTool = useCallback((newTool) => {
    setDrawingState((prev) => ({ ...prev, tool: newTool }));
  }, [setDrawingState]);

  const drawingHandlers = useMemo(
    () => ({
      onMouseDown: startDrawing,
      onMouseUp: stopDrawing,
      onMouseLeave: stopDrawing,
      onMouseMove: handleDraw,
      onTouchStart: startDrawing,
      onTouchEnd: stopDrawing,
      onTouchMove: handleDraw,
    }),
    [startDrawing, stopDrawing, handleDraw]
  );

  const initializeLocalCanvas = useCallback((node) => {
    if (node) {
      initializeCanvas(node);
      canvasForDataRef.current = node;
    }
  }, [initializeCanvas]);
  
  const finalError = submissionError || pollingError;
  const isFormDisabled = isSubmitting || !!jobId;
  const isButtonDisabled = isFormDisabled || !generationName.trim() || isCanvasEmpty();  
  const showProgress = isFormDisabled && !finalError && jobStatus?.status !== 'completed';
  const showErrorModal = !!finalError;

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
                {t("generation_pages.sketch_to_3d.title")}
              </h1>
              <div className="h-1 w-24 bg-gradient-to-r from-azul-gradient to-morado-gradient rounded-full mt-1.5"></div>
            </div>
          </div>
        </div>
        <hr className="border-t-2 border-gray-200 dark:border-linea/20 mb-6 flex-shrink-0" />
        <div className="flex-grow flex flex-col xl:grid xl:grid-cols-5 gap-4">
          <div className="xl:col-span-2">
            <div className="bg-gray-50 dark:bg-principal/30 backdrop-blur-sm border border-gray-200 dark:border-linea/20 rounded-2xl p-4 h-full flex flex-col space-y-4">
              <div className="flex-shrink-0">
                <div className="flex items-center gap-3 mb-2">
                  <TextAa size={18} className="text-azul-gradient" />
                  <h3 className="text-sm font-semibold text-gray-800 dark:text-white">
                    {t("generation_pages.common.generation_name_label")}
                  </h3>
                </div>
                <input
                  type="text"
                  placeholder={t(
                    "generation_pages.common.name_placeholder_generic"
                  )}
                  value={generationName}
                  onChange={(e) => setGenerationName(e.target.value)}
                  disabled={isFormDisabled}
                  className={`w-full p-2.5 rounded-lg bg-white dark:bg-principal/50 border-2 text-gray-800 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-azul-gradient/50 focus:border-azul-gradient transition-all duration-300 ${
                    generationName.trim()
                      ? "border-azul-gradient"
                      : "border-gray-300 dark:border-linea/30"
                  }`}
                />
              </div>
              <div className="flex-grow flex flex-col min-h-0">
                <div
                  className={`w-full min-h-[400px] xl:min-h-0 xl:flex-grow rounded-lg overflow-hidden relative border-2 ${
                    isFormDisabled
                      ? "opacity-60 pointer-events-none"
                      : "border-gray-300 dark:border-linea/30"
                  }`}
                  style={{ touchAction: "none" }}
                >
                  <div
                    className="w-full h-full bg-white"
                    style={{ cursor: "crosshair" }}
                    {...drawingHandlers}
                  >
                    <canvas
                      ref={initializeLocalCanvas}
                      width={canvasConfig.width}
                      height={canvasConfig.height}
                      className="w-full h-full block"
                    />
                  </div>
                  <div className="absolute left-2 top-1/2 -translate-y-1/2 z-10 flex flex-col gap-2 bg-gray-100/80 dark:bg-[#1f2437]/80 backdrop-blur-sm p-1.5 rounded-xl border border-gray-200 dark:border-linea/20">
                    <button
                      onClick={() => setTool("pencil")}
                      disabled={isFormDisabled}
                      className={`p-2 rounded-lg flex items-center justify-center transition-all ${
                        drawingState.tool === "pencil"
                          ? "bg-gradient-to-r from-azul-gradient to-morado-gradient text-white shadow-md"
                          : "text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/20"
                      }`}
                      title={t("generation_pages.common.pencil_tooltip")}
                    >
                      <PencilSimple size={20} weight="bold" />
                    </button>
                    <button
                      onClick={() => setTool("eraser")}
                      disabled={isFormDisabled}
                      className={`p-2 rounded-lg flex items-center justify-center transition-all ${
                        drawingState.tool === "eraser"
                          ? "bg-gradient-to-r from-azul-gradient to-morado-gradient text-white shadow-md"
                          : "text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/20"
                      }`}
                      title={t("generation_pages.common.eraser_tooltip")}
                    >
                      <Eraser size={20} weight="bold" />
                    </button>
                    <div className="h-px w-full bg-gray-300 dark:bg-linea/30 my-1" />
                    <button
                      onClick={clearCanvas}
                      disabled={isFormDisabled}
                      className="p-2 rounded-lg flex items-center justify-center transition-all text-gray-600 dark:text-gray-300 hover:bg-red-500/80 hover:text-white"
                      title={t("generation_pages.common.clear_canvas_tooltip")}
                    >
                      <Trash size={20} weight="bold" />
                    </button>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-2">
                    <div className="bg-white/80 dark:bg-principal/80 backdrop-blur-sm border border-gray-200 dark:border-linea/20 rounded-lg p-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                      <input
                        type="text"
                        placeholder={t(
                          "generation_pages.common.canvas_description_placeholder"
                        )}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        disabled={isFormDisabled}
                        className="flex-1 text-sm bg-transparent text-gray-800 dark:text-white border-none focus:ring-0 placeholder-gray-500 dark:placeholder-gray-400 px-1 py-1"
                      />
                      <button
                        onClick={handleLocalPrediction}
                        disabled={isButtonDisabled}
                        className="text-sm font-semibold bg-gradient-to-r from-azul-gradient to-morado-gradient py-2 px-4 rounded-md border-none flex items-center justify-center gap-2 transition-all hover:scale-105 disabled:opacity-60 disabled:hover:scale-100 whitespace-nowrap text-white"
                      >
                        <Sparkle size={16} weight="fill" />
                        {t("generation_pages.common.canvas_generate_button")}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="xl:col-span-3 flex-grow min-h-[500px] md:min-h-[600px] xl:min-h-0">
            <div className="h-full min-h-[400px] sm:min-h-[500px] md:min-h-[600px] xl:min-h-0 border-2 border-gray-200 dark:border-linea/20 rounded-3xl overflow-hidden">
              <Boceto3DResult onFirstLoad={handlePreviewUpload} />
            </div>
          </div>
        </div>
      </div>
      <ProgressModal show={showProgress} jobStatus={jobStatus} />
      <ErrorModal
        showModal={showErrorModal}
        closeModal={resetComponentState}
        errorMessage={finalError || t('errors.generic_error_occurred')}
      />
    </section>
  );
};