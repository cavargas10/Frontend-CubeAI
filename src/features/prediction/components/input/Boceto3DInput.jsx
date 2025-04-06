import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { Sparkle, PencilSimple, Eraser, TrashSimple } from "@phosphor-icons/react";
import { Button } from "flowbite-react"; 
import { ErrorModal } from "../../../../components/modals/ErrorModal"; 
import { LoadingModal } from "../../../../components/modals/LoadingModal"; 
import { Boceto3DResult } from "../results/Boceto3DResult"; 
import { usePredictionHandler } from "../../hooks/usePredictionHandler"; 

export const Boceto3DInput = ({
  user,
  setPrediction_boceto3d_result, 
  BASE_URL,
  prediction_boceto3d_result, 
  activeTab, 
  isCollapsed, 
}) => {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);

  const [drawingState, setDrawingState] = useState({
    tool: "pencil",
    isDrawing: false,
  });
  const [generationName, setGenerationName] = useState("");
  const [description, setDescription] = useState("");

  const {
    isLoading: predictionLoading,
    error: predictionError,
    submitPrediction,
    clearError: clearPredictionError,
    clearResult: clearPredictionResult,
    setError: setPredictionError, 
    setIsLoading: setPredictionLoading, 
  } = usePredictionHandler(user, BASE_URL);

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

  const initializeCanvas = useCallback((node) => {
    if (node !== null) {
      canvasRef.current = node;
      const ctx = node.getContext("2d", { alpha: false }); 
      ctxRef.current = ctx;

      ctx.strokeStyle = canvasConfig.pencilConfig.strokeStyle;
      ctx.lineWidth = canvasConfig.pencilConfig.lineWidth;
      ctx.lineCap = canvasConfig.pencilConfig.lineCap;

      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, canvasConfig.width, canvasConfig.height);
    }
  }, [canvasConfig]); 

  const getCanvasCoordinates = useCallback((e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 }; 
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvasConfig.width / rect.width;
    const scaleY = canvasConfig.height / rect.height;

    const clientX = e.clientX || (e.touches && e.touches[0]?.clientX);
    const clientY = e.clientY || (e.touches && e.touches[0]?.clientY);

     if (clientX === undefined || clientY === undefined) {
       return { x: 0, y: 0 }; 
     }

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  }, [canvasConfig]); 

  const startDrawing = useCallback((e) => {
    const coords = getCanvasCoordinates(e);
    setDrawingState(prev => ({ ...prev, isDrawing: true }));
    if (ctxRef.current) {
      ctxRef.current.beginPath();
      ctxRef.current.moveTo(coords.x, coords.y);

       if (drawingState.tool === 'pencil') {
           ctxRef.current.strokeStyle = canvasConfig.pencilConfig.strokeStyle;
           ctxRef.current.lineWidth = canvasConfig.pencilConfig.lineWidth;
       }
    }
  }, [getCanvasCoordinates, drawingState.tool, canvasConfig]); 

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
       ctx.fillStyle = "#FFFFFF";
       ctx.fillRect(coords.x - size / 2, coords.y - size / 2, size, size);
    }
  }, [drawingState.isDrawing, drawingState.tool, getCanvasCoordinates, canvasConfig.eraserSize]);

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
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], filename, { type: mime });
    } catch (error) {
      console.error("Error converting Data URL to File:", error);
      setPredictionError("Error al procesar el boceto. Intente de nuevo."); 
      return null; 
    }
  }, [setPredictionError]); 

  const resetComponentState = useCallback(() => {
    setDrawingState({ tool: "pencil", isDrawing: false });
    setGenerationName("");
    setDescription("");
    clearPredictionError();
    clearPredictionResult(); 
    if (typeof setPrediction_boceto3d_result === 'function') {
       setPrediction_boceto3d_result(null); 
    }
    setPredictionLoading(false); 

    if (ctxRef.current) {
      ctxRef.current.fillStyle = "#FFFFFF";
      ctxRef.current.fillRect(0, 0, canvasConfig.width, canvasConfig.height);
      ctxRef.current.strokeStyle = canvasConfig.pencilConfig.strokeStyle;
      ctxRef.current.lineWidth = canvasConfig.pencilConfig.lineWidth;
      ctxRef.current.lineCap = canvasConfig.pencilConfig.lineCap;
    }
  }, [canvasConfig, clearPredictionError, clearPredictionResult, setPrediction_boceto3d_result, setPredictionLoading]);

  useEffect(() => {
    return () => {
      resetComponentState();
    };
  }, [activeTab, resetComponentState]); 

  const handleLocalPrediction = useCallback(async () => {
    if (!generationName.trim()) { 
      setPredictionError("Por favor, ingrese un nombre para la generación.");
      return;
    }
    if (!canvasRef.current) {
        setPredictionError("Error: El área de dibujo no está lista.");
        return;
    }

    const canvas = canvasRef.current;
    const image = canvas.toDataURL("image/png");

    const ctx = ctxRef.current;
    const imageData = ctx.getImageData(0, 0, canvasConfig.width, canvasConfig.height);
    const isCanvasEmpty = ![...imageData.data].some(channel => channel < 255); 

    if (isCanvasEmpty) {
        setPredictionError("Por favor, dibuje algo en el lienzo antes de generar.");
        return;
    }

    const imageFile = dataURLtoFile(image, "boceto.png");
    if (!imageFile) {
        return;
    }

    const formData = new FormData();
    formData.append("image", imageFile);
    formData.append("generationName", generationName);
    formData.append("description", description); 

    const result = await submitPrediction("boceto3D", formData, { 
      headers: { "Content-Type": "multipart/form-data" },
    });

    if (result && typeof setPrediction_boceto3d_result === 'function') {
       setPrediction_boceto3d_result(result); 
    }
  }, [
    generationName,
    description,
    submitPrediction, 
    dataURLtoFile,
    setPredictionError, 
    setPrediction_boceto3d_result, 
    canvasConfig 
  ]);

  const ToolButton = useCallback(({ tool: buttonTool, icon: Icon, title }) => (
    <button
      onClick={() => setDrawingState(prev => ({ ...prev, tool: buttonTool }))}
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
  ), [drawingState.tool, predictionLoading]); 

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
          {/* Formulario (Izquierda) */}
         <div className="w-full xl:w-1/2 p-6 border-r border-linea">
           <div className="flex flex-col gap-4">
              {/* Nombre */}
             <div className="flex flex-col gap-1">
               <label className="text-base font-medium">Nombre de la generación</label>
               <input
                 type="text"
                 placeholder="Ingrese un nombre"
                 value={generationName}
                 onChange={(e) => setGenerationName(e.target.value)}
                 disabled={predictionLoading}
                 className="bg-transparent border p-2 rounded-md w-full text-sm"
               />
             </div>

              {/* Canvas y controles */}
             <div className="relative">
                {/* Botones de herramientas */}
               <div className="absolute left-2 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-10 bg-[#0A0B20] p-2 rounded-lg shadow-lg">
                 <ToolButton tool="pencil" icon={PencilSimple} title="Lápiz" />
                 <ToolButton tool="eraser" icon={Eraser} title="Borrador" />
                 <div className="h-px w-8 bg-gray-700" />
                 <button
                   onClick={resetComponentState}
                   className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#0A0B20] text-gray-300 hover:bg-red-500 hover:text-white transition-all duration-200"
                   title="Limpiar canvas"
                   disabled={predictionLoading}
                 >
                   <TrashSimple size={20} weight="bold" />
                 </button>
               </div>

                {/* Área del Canvas */}
               <div className="border border-linea rounded-lg overflow-hidden relative h-[370px]"> {/* Usa tu color de borde */}
                  {/* Contenedor para eventos y estilos */}
                 <div
                    className={`relative w-full h-full bg-white ${predictionLoading ? 'opacity-50 cursor-not-allowed' : ''}`} // Fondo blanco explícito
                    onMouseDown={!predictionLoading ? startDrawing : undefined}
                    onMouseUp={!predictionLoading ? stopDrawing : undefined}
                    onMouseLeave={!predictionLoading ? stopDrawing : undefined}
                    onMouseMove={!predictionLoading ? handleDraw : undefined}
                    // Añadir eventos touch si es necesario para móvil
                    onTouchStart={!predictionLoading ? startDrawing : undefined}
                    onTouchEnd={!predictionLoading ? stopDrawing : undefined}
                    onTouchMove={!predictionLoading ? handleDraw : undefined}
                 >
                   <canvas
                     ref={initializeCanvas}
                     width={canvasConfig.width}
                     height={canvasConfig.height}
                     className="w-full h-full block" 
                   />

                    {/* Barra inferior */}
                   <div className="absolute bottom-0 left-0 right-0 backdrop-blur-sm p-2 flex gap-2 items-center"> {/* Estilo mejorado */}
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
                       className="text-sm bg-gradient-to-r hover:bg-gradient-to-tr from-azul-gradient to-morado-gradient px-4 rounded-md border-none flex items-center justify-center gap-2 h-10" // Ajusta altura si es necesario
                       style={{ padding:'0.5rem 1rem' }} 
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

          {/* Resultado (Derecha) */}
         <div className="w-full xl:w-1/2">
           <Boceto3DResult prediction_boceto3d_result={prediction_boceto3d_result} />
         </div>
       </div>

        {/* Modales */}
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