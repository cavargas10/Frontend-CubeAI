import React, { useState, useEffect, useCallback } from "react";
import { Sparkle, UploadSimple } from "@phosphor-icons/react";
import { Button } from "flowbite-react";
import { ErrorModal } from "../../../../components/modals/ErrorModal";
import { LoadingModal } from "../../../../components/modals/LoadingModal";
import { Imagen3DResult } from "../results/Imagen3DResult";
import { usePredictionHandler } from "../../hooks/usePredictionHandler"; 
import { useImageUpload } from "../../hooks/useImageUpload"; 

export const Imagen3DInput = ({
  user,
  setPrediction_img3d_result, 
  BASE_URL,
  prediction_img3d_result, 
  activeTab,
  isCollapsed,
}) => {
  const [generationName, setGenerationName] = useState("");

  // Usa los hooks personalizados
  const {
    imageFile,
    imagePreview,
    isDragging,
    handleFileChange,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    resetImageState,
  } = useImageUpload();

  const {
    isLoading: predictionLoading, 
    error: predictionError,
    submitPrediction,
    clearError: clearPredictionError,
    clearResult: clearPredictionResult,
    setError: setPredictionError,
    setIsLoading: setPredictionLoading, 
  } = usePredictionHandler(user, BASE_URL);

  const resetComponentState = useCallback(() => {
    setGenerationName("");
    resetImageState(); 
    clearPredictionError(); 
    clearPredictionResult(); 
    setPrediction_img3d_result(null); 
    setPredictionLoading(false); 
  }, [resetImageState, clearPredictionError, clearPredictionResult, setPrediction_img3d_result, setPredictionLoading]);

  // Limpia al cambiar de tab
  useEffect(() => {
    return () => {
      resetComponentState();
    };
  }, [activeTab, resetComponentState]);

  // Sincroniza el resultado del hook con el estado del padre (si es necesario)
  // Esto podría eliminarse si movemos el estado globalmente
  // useEffect(() => {
  //   if (predictionResult) {
  //     setPrediction_img3d_result(predictionResult);
  //   }
  // }, [predictionResult, setPrediction_img3d_result]);

  const handleLocalPrediction = async () => {
    if (!imageFile) {
      setPredictionError("No se ha seleccionado ninguna imagen");
      return;
    }
    if (!generationName) {
      setPredictionError("Por favor, ingrese un nombre para la generación");
      return;
    }

    const formData = new FormData();
    formData.append("image", imageFile);
    formData.append("generationName", generationName);

    // Llama al submitter del hook
    const result = await submitPrediction("imagen3D", formData, {
        headers: { "Content-Type": "multipart/form-data" }
    });

    // Si el submitter tuvo éxito, actualiza el estado específico
    if (result && typeof setPrediction_img3d_result === "function") {
        setPrediction_img3d_result(result);
    }
  };

  return (
    // El JSX externo y de layout permanece igual
    <div className={`w-full bg-fondologin transition-all duration-300 ease-in-out ${
        isCollapsed
          ? "sm:ml-[80px] xl:ml-[80px] 2xl:ml-[80px]"
          : "sm:ml-[264px] xl:ml-[265px] 2xl:ml-[300px]" // Ajusta las clases según tus necesidades
      }`}>
      <div className="pt-6 bg-principal pb-4 border-b-2 border-linea ">
        <p className="text-center text-2xl">Imagen a 3D</p>
      </div>

      <div className="flex flex-col xl:flex-row w-full min-h-[calc(100vh-200px)] bg-fondologin">
        {/* Formulario (Lado izquierdo) - Usa estados y handlers de los hooks */}
        <div className="w-full xl:w-1/3 p-6 border-r border-linea">
          <div className="flex flex-col gap-6">
            {/* Campo de nombre */}
            <div className="flex flex-col gap-2">
              <label className="text-lg">Nombre de la generación</label>
              <input
                type="text"
                placeholder="Ingrese un nombre"
                value={generationName}
                onChange={(e) => setGenerationName(e.target.value)}
                disabled={predictionLoading} // Usa el loading del hook
                className="bg-transparent border p-3 rounded-lg w-full"
              />
            </div>

            {/* Área de subida - Usa handlers y estado del hook useImageUpload */}
            <div
              className={`relative border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors min-h-[16.5rem] flex flex-col items-center justify-center ${
                isDragging ? 'border-azul-gradient bg-opacity-10' : 'border-linea'
              } ${predictionLoading ? 'opacity-50 cursor-not-allowed' : 'hover:border-azul-gradient'}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => !predictionLoading && document.getElementById('fileInput-imagen3d').click()} // ID único para el input
            >
              <input
                id="fileInput-imagen3d" 
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={predictionLoading}
                className="hidden"
              />

              {imagePreview ? (
                <div className="w-full h-full flex flex-col items-center gap-4">
                  <img
                    src={imagePreview}
                    alt="Vista previa"
                    className="max-w-full max-h-48 object-contain rounded-lg"
                  />
                </div>
              ) : (
                <>
                  <UploadSimple className="w-12 h-12 text-gray-400" weight="thin" />
                  <p className="mt-4 text-sm">
                    Arrastra una imagen o haz clic para seleccionar
                  </p>
                  <p className="mt-2 text-xs text-gray-400">
                    PNG, JPG, JPEG (MAX. 10MB)
                  </p>
                </>
              )}
            </div>

            {/* Botón de generar */}
            <Button
              onClick={handleLocalPrediction} 
              disabled={predictionLoading} 
              className="w-full text-base bg-gradient-to-r hover:bg-gradient-to-tr from-azul-gradient to-morado-gradient py-2 rounded-md border-none flex items-center justify-center gap-2"
            >
              <Sparkle size={24} weight="fill" />
              Generar
            </Button>
          </div>
        </div>

        {/* Resultado (Lado derecho) - Igual que antes */}
        <div className="w-full xl:w-2/3">
          <Imagen3DResult prediction_img3d_result={prediction_img3d_result} />
        </div>
      </div>

      {/* Modales - Usan el estado y cleaner del hook */}
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