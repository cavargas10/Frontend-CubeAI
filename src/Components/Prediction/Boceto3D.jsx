import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Sparkle, PencilSimple, Eraser, TrashSimple } from "@phosphor-icons/react";
import { Button } from "flowbite-react";
import { ErrorModal } from "../Modals/ErrorModal";
import { LoadingModal } from "../Modals/LoadingModal";
import { Imagen3DResult } from "./Imagen3DResult";

export const Boceto3D = ({
  user,
  setPrediction_img3d_result,
  setLoading,
  loading,
  BASE_URL,
  prediction_img3d_result,
  activeTab,
  isCollapsed,
}) => {
  const canvasRef = useRef(null);
  const [generationName, setGenerationName] = useState("");
  const [description, setDescription] = useState("");
  const [tool, setTool] = useState("pencil");
  const [isDrawing, setIsDrawing] = useState(false);
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loadingModalVisible, setLoadingModalVisible] = useState(false);

  const resetState = () => {
    setGenerationName("");
    setDescription("");
    setTool("pencil");
    setErrorModalVisible(false);
    setErrorMessage("");
    setLoadingModalVisible(false);
    setPrediction_img3d_result(null);
    setLoading(false);
    clearCanvas();
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  useEffect(() => {
    return () => {
      resetState();
    };
  }, [activeTab]);

  const getCanvasCoordinates = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  };

  const startDrawing = (e) => {
    const coords = getCanvasCoordinates(e);
    setIsDrawing(true);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.beginPath();
    ctx.moveTo(coords.x, coords.y);
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      const ctx = canvasRef.current.getContext("2d");
      ctx.beginPath();
    }
  };

  const handleCanvasDraw = (e) => {
    if (!isDrawing || !canvasRef.current) return;

    const coords = getCanvasCoordinates(e);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (tool === "pencil") {
      ctx.strokeStyle = "#000000";
      ctx.lineWidth = 2;
      ctx.lineCap = "round";
      ctx.lineTo(coords.x, coords.y);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(coords.x, coords.y);
    } else if (tool === "eraser") {
      ctx.clearRect(coords.x - 10, coords.y - 10, 20, 20);
    }
  };

  const handlePrediction = async () => {
    if (!generationName) {
      setErrorMessage("Por favor, ingrese un nombre para la generación.");
      setErrorModalVisible(true);
      return;
    }

    setLoadingModalVisible(true);
    setLoading(true);

    try {
      const token = await user.getIdToken();
      const canvas = canvasRef.current;
      const image = canvas.toDataURL("image/png");

      const formData = new FormData();
      formData.append("image", dataURLtoFile(image, "boceto.png"));
      formData.append("generationName", generationName);
      formData.append("description", description);

      const response = await axios.post(`${BASE_URL}/imagen3D`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      if (typeof setPrediction_img3d_result === "function") {
        setPrediction_img3d_result(response.data);
      }
    } catch (error) {
      const errorMsg =
        error.response?.data?.error ||
        "Error al realizar la predicción. Por favor, intente nuevamente.";
      setErrorMessage(errorMsg);
      setErrorModalVisible(true);
    } finally {
      setLoading(false);
      setLoadingModalVisible(false);
    }
  };

  const dataURLtoFile = (dataURL, filename) => {
    const arr = dataURL.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  const closeErrorModal = () => {
    setErrorModalVisible(false);
    setErrorMessage("");
  };

  return (
    <div className={`w-full sm:ml-[264px] xl:ml-[265px] 2xl:ml-[300px] bg-fondologin transition-all duration-300 ease-in-out ${
      isCollapsed
        ? "sm:ml-[80px] xl:ml-[80px] 2xl:ml-[80px]"
        : "sm:ml-[264px] md:ml-[267px] xl:ml-[250px] 2xl:ml-[300px]"
    }`}>
      <div className="pt-6 bg-principal pb-4 border-b-2 border-linea">
        <p className="text-center text-2xl">Boceto 3D</p>
      </div>
      <div className="flex flex-col xl:flex-row w-full min-h-[calc(100vh-200px)] bg-fondologin">
        <div className="w-full xl:w-1/2 p-6 border-r border-linea">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-base font-medium">Nombre de la generación</label>
              <input
                type="text"
                placeholder="Ingrese un nombre"
                value={generationName}
                onChange={(e) => setGenerationName(e.target.value)}
                disabled={loading}
                className="bg-transparent border p-2 rounded-md w-full text-sm"
              />
            </div>

            <div className="relative">
              {/* Centered horizontal tools panel */}
              <div className="absolute left-1/2 -translate-x-1/2 top-2 flex gap-2 z-10 bg-[#0A0B20] p-2 rounded-lg shadow-lg">
                <button
                  onClick={() => setTool("pencil")}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 ${
                    tool === "pencil" 
                      ? "bg-blue-500 text-white shadow-inner" 
                      : "bg-[#0A0B20] text-gray-300 hover:bg-[#1a1b35] hover:text-white"
                  }`}
                  title="Lápiz"
                >
                  <PencilSimple size={20} weight="bold" />
                </button>
                <button
                  onClick={() => setTool("eraser")}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 ${
                    tool === "eraser" 
                      ? "bg-blue-500 text-white shadow-inner" 
                      : "bg-[#0A0B20] text-gray-300 hover:bg-[#1a1b35] hover:text-white"
                  }`}
                  title="Borrador"
                >
                  <Eraser size={20} weight="bold" />
                </button>
                <div className="h-8 w-px bg-gray-700"></div>
                <button
                  onClick={clearCanvas}
                  className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#0A0B20] text-gray-300 hover:bg-red-500 hover:text-white transition-all duration-200"
                  title="Limpiar canvas"
                >
                  <TrashSimple size={20} weight="bold" />
                </button>
              </div>

              {/* Canvas container with description input */}
              <div className="border border-gray-300 rounded-lg overflow-hidden relative">
                <div
                  className="relative"
                  onMouseDown={startDrawing}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onMouseMove={handleCanvasDraw}
                >
                  <canvas
                    ref={canvasRef}
                    width={400}
                    height={245}
                    className="w-full h-full bg-white"
                  ></canvas>
                  
                  {/* Description input overlay */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gray-100 bg-opacity-90 p-2">
                    <input
                      type="text"
                      placeholder="Describa su boceto..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      disabled={loading}
                      className="w-full p-2 text-sm bg-[#0A0B20] text-gray-300 hover:bg-[#1a1b35] hover:text-white rounded-md border border-gray-300"
                    />
                  </div>
                </div>
              </div>
            </div>

            <Button
              onClick={handlePrediction}
              disabled={loading}
              className="w-full text-sm bg-gradient-to-r hover:bg-gradient-to-tr from-azul-gradient to-morado-gradient py-2 rounded-md border-none flex items-center justify-center gap-2"
            >
              <Sparkle size={16} weight="fill" />
              Generar
            </Button>
          </div>
        </div>

        <div className="w-full xl:w-1/2">
          <Imagen3DResult prediction_img3d_result={prediction_img3d_result} />
        </div>
      </div>

      <ErrorModal
        showModal={errorModalVisible}
        closeModal={closeErrorModal}
        errorMessage={errorMessage}
      />
      <LoadingModal
        showLoadingModal={loadingModalVisible}
        message="Generando el modelo 3D..."
      />
    </div>
  );
};

export default Boceto3D;