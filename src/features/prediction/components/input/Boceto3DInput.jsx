import React, { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { Sparkle, PencilSimple, Eraser, TrashSimple } from "@phosphor-icons/react";
import { Button } from "flowbite-react";
import { ErrorModal } from "../../../../components/modals/ErrorModal";
import { LoadingModal } from "../../../../components/modals/LoadingModal";
import { Boceto3DResult } from "../results/Boceto3DResult";
import { usePredictionHandler } from "../../hooks/usePredictionHandler";
import { useCanvasDrawing } from "../../hooks/useCanvasDrawing";

export const Boceto3DInput = ({
  user,
  setPrediction_boceto3d_result,
  isCollapsed,
}) => {
  const [generationName, setGenerationName] = useState("");
  const [description, setDescription] = useState("");

  const {
    isLoading: predictionLoading,
    error: predictionError,
    submitPrediction,
    clearError: clearPredictionError,
    setError: setPredictionError,
  } = usePredictionHandler(user);

  const canvasConfig = useMemo(() => ({
    width: 600,
    height: 300,
    pencilConfig: { strokeStyle: "#000000", lineWidth: 2, lineCap: "round" },
    eraserSize: 20,
    backgroundColor: "#FFFFFF",
  }), []);

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

  const initializeLocalCanvas = useCallback((node) => {
      initializeCanvas(node);
      canvasForDataRef.current = node;
  }, [initializeCanvas]);

  const getCanvasDataURL = useCallback((type = "image/png", quality) => {
    if (!canvasForDataRef.current) return null;
    return canvasForDataRef.current.toDataURL(type, quality);
  }, []);

  const setTool = useCallback((newTool) => {
      setDrawingState(prev => ({ ...prev, tool: newTool }));
  }, [setDrawingState]);

  const drawingHandlers = useMemo(() => ({
      onMouseDown: startDrawing,
      onMouseUp: stopDrawing,
      onMouseLeave: stopDrawing,
      onMouseMove: handleDraw,
      onTouchStart: startDrawing,
      onTouchEnd: stopDrawing,
      onTouchMove: handleDraw,
      style: { touchAction: 'none', cursor: 'crosshair' }
  }), [startDrawing, stopDrawing, handleDraw]);

  const dataURLtoFile = useCallback((dataURL, filename) => {
    try {
      const arr = dataURL.split(",");
      if (arr.length < 2) throw new Error("Invalid Data URL format");
      const mimeMatch = arr[0].match(/:(.*?);/);
      if (!mimeMatch || mimeMatch.length < 2) throw new Error("Could not extract MIME type");
      const mime = mimeMatch[1];
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) { u8arr[n] = bstr.charCodeAt(n); }
      return new File([u8arr], filename, { type: mime });
    } catch (error) {
      console.error("Error converting Data URL to File:", error);
      setPredictionError("Error al procesar el boceto. Intente de nuevo.");
      return null;
    }
  }, [setPredictionError]);

  const resetComponentState = useCallback(() => {
    setGenerationName("");
    setDescription("");
    setTool('pencil');
    clearPredictionError();
    if (typeof setPrediction_boceto3d_result === 'function') {
      setPrediction_boceto3d_result(null);
    }
    clearCanvas();
  }, [clearCanvas, clearPredictionError, setPrediction_boceto3d_result, setTool]);

  useEffect(() => {
      return () => { resetComponentState(); };
  }, [resetComponentState]);

  const handleLocalPrediction = useCallback(async () => {
    if (!generationName.trim()) {
      setPredictionError("Por favor, ingrese un nombre para la generación.");
      return;
    }
    if (isCanvasEmpty()) {
      setPredictionError("Por favor, dibuje algo en el lienzo antes de generar.");
      return;
    }
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
    if (result && typeof setPrediction_boceto3d_result === "function") {
      setPrediction_boceto3d_result(result);
    }
  }, [
    generationName, description, submitPrediction, getCanvasDataURL, isCanvasEmpty,
    dataURLtoFile, setPredictionError, setPrediction_boceto3d_result
  ]);

  const ToolButton = useCallback(
    ({ tool: buttonTool, icon: Icon, title }) => (
      <button
        onClick={() => setTool(buttonTool)}
        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 ${
          drawingState.tool === buttonTool
            ? "bg-blue-500 text-white shadow-inner"
            : "bg-[#0A0B20] text-gray-300 hover:bg-[#1a1b35] hover:text-white"
        }`}
        title={title}
        disabled={predictionLoading}
      >
        <Icon size={20} weight="bold" />
      </button>
    ),
    [drawingState.tool, setTool, predictionLoading]
  );

  return (
    <div className={`w-full bg-fondologin transition-all duration-300 ease-in-out ${
      isCollapsed
        ? "sm:ml-[80px] xl:ml-[80px] 2xl:ml-[80px]"
        : "sm:ml-[264px] xl:ml-[265px] 2xl:ml-[300px]"
    }`}>
      <div className="pt-6 bg-principal pb-4 border-b-2 border-linea">
        <p className="text-center text-2xl">Boceto 3D</p>
      </div>
      <div className="flex flex-col xl:flex-row w-full min-h-[calc(100vh-200px)] bg-fondologin">
        <div className="w-full xl:w-1/2 p-6 border-r-2 border-linea">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-base font-medium text-gray-300">Nombre de la generación</label>
              <input
                type="text"
                placeholder="Ej: Mi dibujo rápido"
                value={generationName}
                onChange={(e) => setGenerationName(e.target.value)}
                disabled={predictionLoading}
                className="bg-transparent border border-linea p-2 rounded-md w-full text-sm text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div className="relative">
              <div className="absolute left-2 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-10 bg-gray-800/80 backdrop-blur-sm p-2 rounded-lg shadow-lg">
                <ToolButton tool="pencil" icon={PencilSimple} title="Lápiz" />
                <ToolButton tool="eraser" icon={Eraser} title="Borrador" />
                <div className="h-px w-full bg-gray-600 my-1" />
                <button
                  onClick={clearCanvas}
                  className="w-8 h-8 rounded-lg flex items-center justify-center bg-gray-800/80 text-gray-300 hover:bg-red-600 hover:text-white transition-all duration-200"
                  title="Limpiar canvas"
                  disabled={predictionLoading}
                >
                  <TrashSimple size={20} weight="bold" />
                </button>
              </div>
              <div className="border border-linea rounded-lg overflow-hidden relative h-[370px]">
                <div
                  className={`relative w-full h-full bg-white ${
                    predictionLoading
                      ? "opacity-60 cursor-not-allowed"
                      : "cursor-crosshair"
                  }`}
                  {...drawingHandlers}
                >
                  <canvas
                    ref={initializeLocalCanvas}
                    width={canvasConfig.width}
                    height={canvasConfig.height}
                    className="w-full h-full block"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-black/80 backdrop-blur-sm p-2 flex gap-2 items-center">
                    <input
                      type="text"
                      placeholder="Describe tu boceto (opcional)..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      disabled={predictionLoading}
                      className="flex-1 p-2 text-sm bg-[#0A0B20] text-gray-300 border border-linea rounded-md focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                    <Button
                      onClick={handleLocalPrediction}
                      disabled={predictionLoading}
                      className="text-sm bg-gradient-to-r hover:bg-gradient-to-tr from-azul-gradient to-morado-gradient px-4 rounded-md border-none flex items-center justify-center gap-2 h-full"
                      style={{ padding: "0.5rem 1rem" }}
                    >
                      <Sparkle size={16} weight="fill" />
                      Generar
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full xl:w-1/2">
          <Boceto3DResult />
        </div>
      </div>
      <ErrorModal
        showModal={!!predictionError}
        closeModal={clearPredictionError}
        errorMessage={predictionError || ""}
      />
      <LoadingModal
        showLoadingModal={predictionLoading}
        message="Generando el modelo 3D..."
      />
    </div>
  );
};