import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { Sparkle, PencilSimple, Eraser, Trash, TextAa } from "@phosphor-icons/react";
import { ErrorModal } from "../../../../components/modals/ErrorModal";
import { LoadingModal } from "../../../../components/modals/LoadingModal";
import { Boceto3DResult } from "../results/Boceto3DResult";
import { usePredictionHandler } from "../../hooks/usePredictionHandler";
import { useCanvasDrawing } from "../../hooks/useCanvasDrawing";
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

export const Boceto3DInput = ({ isCollapsed }) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { dispatch, clearResult, prediction_boceto3d_result } = usePredictions();
  const [generationName, setGenerationName] = useState("");
  const [description, setDescription] = useState("");

  const {
    isLoading: predictionLoading,
    error: predictionError,
    loadingSteps,
    submitPrediction,
    clearError: clearPredictionError,
    setError: setPredictionError,
  } = usePredictionHandler(user);

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

  const initializeLocalCanvas = useCallback(
    (node) => {
      if (node) {
        initializeCanvas(node);
        canvasForDataRef.current = node;
      }
    },
    [initializeCanvas]
  );

  const getCanvasDataURL = useCallback((type = "image/png", quality) => {
    if (!canvasForDataRef.current) return null;
    return canvasForDataRef.current.toDataURL(type, quality);
  }, []);

  const setTool = useCallback(
    (newTool) => {
      setDrawingState((prev) => ({ ...prev, tool: newTool }));
    },
    [setDrawingState]
  );

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

  const dataURLtoFile = useCallback(
    (dataURL, filename) => {
      try {
        const arr = dataURL.split(",");
        const mimeMatch = arr[0].match(/:(.*?);/);
        const mime = mimeMatch ? mimeMatch[1] : "image/png";
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, { type: mime });
      } catch (error) {
        setPredictionError("Error al procesar el boceto. Intente de nuevo.");
        return null;
      }
    },
    [setPredictionError]
  );

  const resetComponentState = useCallback(() => {
    setGenerationName("");
    setDescription("");
    clearPredictionError();
    clearResult('boceto3d');
    clearCanvas();
  }, [clearCanvas, clearPredictionError, clearResult]);

  useEffect(() => {
    return () => {
      resetComponentState();
    };
  }, [resetComponentState]);

  const handleLocalPrediction = useCallback(async () => {
    if (!generationName.trim()) {
      setPredictionError("Por favor, ingrese un nombre para la generación.");
      return;
    }
    if (isCanvasEmpty()) {
      setPredictionError(
        "Por favor, dibuje algo en el lienzo antes de generar."
      );
      return;
    }
    
    dispatch({ type: 'SET_PREDICTION', payload: { type: 'boceto3d', result: null } });

    const image = getCanvasDataURL("image/png");
    if (!image) {
      setPredictionError("No se pudo obtener la imagen del lienzo.");
      return;
    }
    const imageFile = dataURLtoFile(image, "boceto.png");
    if (!imageFile) return;

    const formData = new FormData();
    formData.append("image", imageFile);
    formData.append("generationName", generationName);
    formData.append("description", description);

    const result = await submitPrediction("boceto3D", formData);
    if (result) {
      dispatch({ type: 'SET_PREDICTION', payload: { type: 'boceto3d', result } });
    }
  }, [
    generationName,
    description,
    submitPrediction,
    getCanvasDataURL,
    isCanvasEmpty,
    dataURLtoFile,
    setPredictionError,
    dispatch,
  ]);

  const handlePreviewUpload = useCallback(async (dataURL) => {
    if (!user || !prediction_boceto3d_result || !prediction_boceto3d_result.generation_name) return;
    if (prediction_boceto3d_result.previewImageUrl) return;

    try {
        const token = await user.getIdToken();
        const previewBlob = dataURLtoBlob(dataURL);
        
        const formData = new FormData();
        formData.append('preview', previewBlob, 'preview.png');
        formData.append('generation_name', prediction_boceto3d_result.generation_name);
        formData.append('prediction_type_api', 'Boceto3D');

        await uploadPredictionPreview(token, formData);
        console.log("Previsualización subida con éxito para 'Boceto a 3D'.");
        
    } catch (error) {
        console.error("Error al subir la previsualización:", error);
    }
  }, [user, prediction_boceto3d_result]);

  const isButtonDisabled =
    predictionLoading || !generationName.trim() || isCanvasEmpty();

  return (
    <section
      className={`w-full bg-fondologin text-white transition-all duration-300 ease-in-out relative flex flex-col h-[calc(100vh-4rem)] ${
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
        <hr className="border-t-2 border-linea/20 mb-6 flex-shrink-0" />

        <div className="flex-grow flex flex-col xl:grid xl:grid-cols-5 gap-4">
          <div className="xl:col-span-2">
            <div className="bg-principal/30 backdrop-blur-sm border border-linea/20 rounded-2xl p-4 h-full flex flex-col space-y-4">
              <div className="flex-shrink-0">
                <div className="flex items-center gap-3 mb-2">
                  <TextAa size={18} className="text-azul-gradient" />
                  <h3 className="text-sm font-semibold text-white">
                    {t("generation_pages.common.generation_name_label")}
                  </h3>
                </div>
                <input
                  type="text"
                  placeholder={t("generation_pages.common.name_placeholder_generic")}
                  value={generationName}
                  onChange={(e) => setGenerationName(e.target.value)}
                  disabled={predictionLoading}
                  className={`w-full p-2.5 rounded-lg bg-principal/50 border-2 ${
                    generationName.trim()
                      ? "border-azul-gradient"
                      : "border-linea/30"
                  } text-white placeholder-gray-400 focus:ring-2 focus:ring-azul-gradient/50 focus:border-azul-gradient transition-all duration-300`}
                />
              </div>
              <div className="flex-grow flex flex-col min-h-0">
                <div
                  className={`w-full min-h-[400px] xl:min-h-0 xl:flex-grow rounded-lg overflow-hidden relative ${
                    predictionLoading ? "opacity-60 pointer-events-none" : ""
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
                  <div className="absolute left-2 top-1/2 -translate-y-1/2 z-10 flex flex-col gap-2 bg-[#1f2437]/80 backdrop-blur-sm p-1.5 rounded-xl border border-linea/20">
                    <button
                      onClick={() => setTool("pencil")}
                      disabled={predictionLoading}
                      className={`p-2 rounded-lg flex items-center justify-center transition-all ${
                        drawingState.tool === "pencil"
                          ? "bg-gradient-to-r from-azul-gradient to-morado-gradient text-white shadow-md"
                          : "text-gray-300 hover:bg-white/20"
                      }`}
                      title={t("generation_pages.common.pencil_tooltip")}
                    >
                      <PencilSimple size={20} weight="bold" />
                    </button>
                    <button
                      onClick={() => setTool("eraser")}
                      disabled={predictionLoading}
                      className={`p-2 rounded-lg flex items-center justify-center transition-all ${
                        drawingState.tool === "eraser"
                          ? "bg-gradient-to-r from-azul-gradient to-morado-gradient text-white shadow-md"
                          : "text-gray-300 hover:bg-white/20"
                      }`}
                      title={t("generation_pages.common.eraser_tooltip")}
                    >
                      <Eraser size={20} weight="bold" />
                    </button>
                    <div className="h-px w-full bg-linea/30 my-1" />
                    <button
                      onClick={clearCanvas}
                      disabled={predictionLoading}
                      className="p-2 rounded-lg flex items-center justify-center transition-all text-gray-300 hover:bg-red-500/80 hover:text-white"
                      title={t("generation_pages.common.clear_canvas_tooltip")}
                    >
                      <Trash size={20} weight="bold" />
                    </button>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-2">
                    <div className="bg-principal/80 backdrop-blur-sm border border-linea/20 rounded-lg p-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                      <input
                        type="text"
                        placeholder={t("generation_pages.common.canvas_description_placeholder")}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        disabled={predictionLoading}
                        className="flex-1 text-sm bg-transparent text-white border-none focus:ring-0 placeholder-gray-400 px-1 py-1"
                      />
                      <button
                        onClick={handleLocalPrediction}
                        disabled={isButtonDisabled}
                        className="text-sm font-semibold bg-gradient-to-r from-azul-gradient to-morado-gradient py-2 px-4 rounded-md border-none flex items-center justify-center gap-2 transition-all hover:scale-105 disabled:opacity-60 disabled:hover:scale-100 whitespace-nowrap"
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
            <Boceto3DResult onFirstLoad={handlePreviewUpload} />
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