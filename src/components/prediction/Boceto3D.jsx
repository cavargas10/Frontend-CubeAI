import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import {
  Sparkle,
  PencilSimple,
  Eraser,
  TrashSimple,
} from "@phosphor-icons/react";
import { Button } from "flowbite-react";
import { ErrorModal } from "../modals/ErrorModal";
import { LoadingModal } from "../modals/LoadingModal";
import { Boceto3DResult } from "./Boceto3DResult";

export const Boceto3D = ({
  user,
  setPrediction_boceto3d_result,
  setLoading,
  loading,
  BASE_URL,
  prediction_boceto3d_result,
  activeTab,
  isCollapsed,
}) => {
  // Refs
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  
  // Estado combinado para dibujo
  const [drawingState, setDrawingState] = useState({
    tool: "pencil",
    isDrawing: false,
    generationName: "",
    description: "",
  });

  // Estado para modales
  const [modalState, setModalState] = useState({
    errorVisible: false,
    errorMessage: "",
    loadingVisible: false,
  });

  // Configuración del canvas memoizada
  const canvasConfig = useMemo(() => ({
    width: 600,
    height: 300,
    pencilConfig: {
      strokeStyle: "#000000",
      lineWidth: 2,
      lineCap: "round",
    },
    eraserSize: 20,
  }), []);

  // Callback para inicializar el canvas
  const initializeCanvas = useCallback((node) => {
    if (node !== null) {
      canvasRef.current = node;
      ctxRef.current = node.getContext("2d", { alpha: false });
      
      // Configuración inicial del contexto
      const ctx = ctxRef.current;
      ctx.strokeStyle = canvasConfig.pencilConfig.strokeStyle;
      ctx.lineWidth = canvasConfig.pencilConfig.lineWidth;
      ctx.lineCap = canvasConfig.pencilConfig.lineCap;
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, canvasConfig.width, canvasConfig.height);
    }
  }, [canvasConfig]);

  // Reset del estado
  const resetState = useCallback(() => {
    setDrawingState({
      tool: "pencil",
      isDrawing: false,
      generationName: "",
      description: "",
    });
    setModalState({
      errorVisible: false,
      errorMessage: "",
      loadingVisible: false,
    });
    setPrediction_boceto3d_result(null);
    setLoading(false);
    
    if (ctxRef.current) {
      ctxRef.current.fillStyle = "#FFFFFF";
      ctxRef.current.fillRect(0, 0, canvasConfig.width, canvasConfig.height);
    }
  }, [canvasConfig, setPrediction_boceto3d_result, setLoading]);

  // Cleanup en cambio de tab
  useEffect(() => {
    return () => resetState();
  }, [activeTab, resetState]);

  // Coordenadas del canvas memoizadas
  const getCanvasCoordinates = useCallback((e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvasConfig.width / rect.width;
    const scaleY = canvasConfig.height / rect.height;
    
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  }, [canvasConfig]);

  // Handlers de dibujo optimizados
  const startDrawing = useCallback((e) => {
    const coords = getCanvasCoordinates(e);
    setDrawingState(prev => ({ ...prev, isDrawing: true }));
    
    if (ctxRef.current) {
      ctxRef.current.beginPath();
      ctxRef.current.moveTo(coords.x, coords.y);
    }
  }, [getCanvasCoordinates]);

  const stopDrawing = useCallback(() => {
    setDrawingState(prev => ({ ...prev, isDrawing: false }));
    if (ctxRef.current) {
      ctxRef.current.beginPath();
    }
  }, []);

  const handleDraw = useCallback((e) => {
    if (!drawingState.isDrawing || !ctxRef.current) return;
    
    const coords = getCanvasCoordinates(e);
    const ctx = ctxRef.current;
    
    if (drawingState.tool === "pencil") {
      ctx.lineTo(coords.x, coords.y);
      ctx.stroke();
    } else if (drawingState.tool === "eraser") {
      const size = canvasConfig.eraserSize;
      ctx.clearRect(coords.x - size/2, coords.y - size/2, size, size);
    }
  }, [drawingState.isDrawing, drawingState.tool, getCanvasCoordinates, canvasConfig.eraserSize]);

  // Convertir Data URL a File
  const dataURLtoFile = useCallback((dataURL, filename) => {
    const arr = dataURL.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    const u8arr = new Uint8Array(bstr.length);
    
    for (let i = 0; i < bstr.length; i++) {
      u8arr[i] = bstr.charCodeAt(i);
    }
    
    return new File([u8arr], filename, { type: mime });
  }, []);

  // Manejo de predicción optimizado
  const handlePrediction = useCallback(async () => {
    if (!drawingState.generationName) {
      setModalState(prev => ({
        ...prev,
        errorVisible: true,
        errorMessage: "Por favor, ingrese un nombre para la generación."
      }));
      return;
    }

    setModalState(prev => ({ ...prev, loadingVisible: true }));
    setLoading(true);

    try {
      const token = await user.getIdToken();
      const canvas = canvasRef.current;
      const image = canvas.toDataURL("image/png");
      
      const formData = new FormData();
      formData.append("image", dataURLtoFile(image, "boceto.png"));
      formData.append("generationName", drawingState.generationName);
      formData.append("description", drawingState.description);

      const response = await axios.post(`${BASE_URL}/boceto3D`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      if (typeof setPrediction_boceto3d_result === "function") {
        setPrediction_boceto3d_result(response.data);
      }
    } catch (error) {
      const errorMsg = error.response?.data?.error || 
        "Error al realizar la predicción. Por favor, intente nuevamente.";
      
      setModalState(prev => ({
        ...prev,
        errorVisible: true,
        errorMessage: errorMsg
      }));
    } finally {
      setLoading(false);
      setModalState(prev => ({ ...prev, loadingVisible: false }));
    }
  }, [
    drawingState.generationName,
    drawingState.description,
    user,
    BASE_URL,
    dataURLtoFile,
    setPrediction_boceto3d_result,
    setLoading
  ]);

  // Handlers para modales
  const closeErrorModal = useCallback(() => {
    setModalState(prev => ({
      ...prev,
      errorVisible: false,
      errorMessage: ""
    }));
  }, []);

  // Tool buttons memoizados
  const ToolButton = useCallback(({ tool: buttonTool, icon: Icon, title }) => (
    <button
      onClick={() => setDrawingState(prev => ({ ...prev, tool: buttonTool }))}
      className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 ${
        drawingState.tool === buttonTool
          ? "bg-blue-500 text-white shadow-inner"
          : "bg-[#0A0B20] text-gray-300 hover:bg-[#1a1b35] hover:text-white"
      }`}
      title={title}
    >
      <Icon size={20} weight="bold" />
    </button>
  ), [drawingState.tool]);

  return (
    <div
      className={`w-full transition-all duration-300 ease-in-out ${
        isCollapsed
          ? "sm:ml-[80px] xl:ml-[80px] 2xl:ml-[80px]"
          : "sm:ml-[264px] xl:ml-[265px] 2xl:ml-[300px]"
      }`}
    >
      <div className="pt-6 bg-principal pb-4 border-b-2 border-linea">
        <p className="text-center text-2xl">Boceto 3D</p>
      </div>
      
      <div className="flex flex-col xl:flex-row w-full min-h-[calc(100vh-200px)] bg-fondologin">
        <div className="w-full xl:w-1/2 p-6 border-r border-linea">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-base font-medium">
                Nombre de la generación
              </label>
              <input
                type="text"
                placeholder="Ingrese un nombre"
                value={drawingState.generationName}
                onChange={(e) => 
                  setDrawingState(prev => ({
                    ...prev,
                    generationName: e.target.value
                  }))
                }
                disabled={loading}
                className="bg-transparent border p-2 rounded-md w-full text-sm"
              />
            </div>

            <div className="relative">
              <div className="absolute left-2 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-10 bg-[#0A0B20] p-2 rounded-lg shadow-lg">
                <ToolButton tool="pencil" icon={PencilSimple} title="Lápiz" />
                <ToolButton tool="eraser" icon={Eraser} title="Borrador" />
                <div className="h-px w-8 bg-gray-700" />
                <button
                  onClick={resetState}
                  className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#0A0B20] text-gray-300 hover:bg-red-500 hover:text-white transition-all duration-200"
                  title="Limpiar canvas"
                >
                  <TrashSimple size={20} weight="bold" />
                </button>
              </div>

              <div className="border border-gray-300 rounded-lg overflow-hidden relative h-[370px]">
                <div
                  className="relative w-full h-full"
                  onMouseDown={startDrawing}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onMouseMove={handleDraw}
                >
                  <canvas
                    ref={initializeCanvas}
                    width={canvasConfig.width}
                    height={canvasConfig.height}
                    className="w-full h-full"
                  />

                  <div className="absolute bottom-0 left-0 right-0 bg-gray-100 bg-opacity-90 p-2 flex gap-2">
                    <input
                      type="text"
                      placeholder="Describa su boceto..."
                      value={drawingState.description}
                      onChange={(e) =>
                        setDrawingState(prev => ({
                          ...prev,
                          description: e.target.value
                        }))
                      }
                      disabled={loading}
                      className="flex-1 p-2 text-sm bg-[#0A0B20] text-gray-300 hover:bg-[#1a1b35] hover:text-white rounded-md border border-gray-300"
                    />
                    <Button
                      onClick={handlePrediction}
                      disabled={loading}
                      className="text-sm bg-gradient-to-r hover:bg-gradient-to-tr from-azul-gradient to-morado-gradient px-4 rounded-md border-none flex items-center justify-center gap-2"
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
          <Boceto3DResult prediction_boceto3d_result={prediction_boceto3d_result} />
        </div>
      </div>

      <ErrorModal
        showModal={modalState.errorVisible}
        closeModal={closeErrorModal}
        errorMessage={modalState.errorMessage}
      />
      <LoadingModal
        showLoadingModal={modalState.loadingVisible}
        message="Generando el modelo 3D..."
      />
    </div>
  );
};