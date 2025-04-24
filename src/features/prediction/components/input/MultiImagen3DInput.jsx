import React, { useState, useEffect, useCallback } from "react";
import { Sparkle, UploadSimple } from "@phosphor-icons/react";
import { Button } from "flowbite-react"; 
import { ErrorModal } from "../../../../components/modals/ErrorModal"; 
import { LoadingModal } from "../../../../components/modals/LoadingModal"; 
import { MultiImagen3DResult } from "../results/MultiImagen3DResult"; 
import { usePredictionHandler } from "../../hooks/usePredictionHandler"; 
import { useMultiImageUpload } from "../../hooks/useMultiImageUpload"; 

export const MultiImagen3DInput = ({
  user,
  setPrediction_multiimg3d_result, 
  BASE_URL,
  prediction_multiimg3d_result, 
  isCollapsed, 
}) => {
  const [generationName, setGenerationName] = useState("");
  const { 
    imageFiles,
    imagePreviews,
    currentImageType,
    isDragging,
    handleFileChange,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    selectImageType, 
    resetMultiImageState,
  } = useMultiImageUpload();

  const { 
    isLoading: predictionLoading,
    error: predictionError,
    submitPrediction,
    clearError: clearPredictionError,
    setError: setPredictionError,
  } = usePredictionHandler(user, BASE_URL);

  const resetComponentState = useCallback(() => {
    setGenerationName("");
    resetMultiImageState(); 
    clearPredictionError();
    if (typeof setPrediction_multiimg3d_result === 'function') {
        setPrediction_multiimg3d_result(null); 
    }
  }, [resetMultiImageState, clearPredictionError, setPrediction_multiimg3d_result]);

  useEffect(() => {
    return () => {
      resetComponentState();
    };
  }, [resetComponentState]);

  const handleLocalPrediction = async () => {
    if (!imageFiles.frontal || !imageFiles.lateral || !imageFiles.trasera) {
      setPredictionError("Por favor, cargue las tres imágenes (frontal, lateral y trasera).");
      return;
    }
    if (!generationName.trim()) {
      setPredictionError("Por favor, ingrese un nombre para la generación.");
      return;
    }

    const formData = new FormData();
    formData.append("frontal", imageFiles.frontal);
    formData.append("lateral", imageFiles.lateral);
    formData.append("trasera", imageFiles.trasera);
    formData.append("generationName", generationName);

    const result = await submitPrediction("multiimagen3D", formData, { 
        headers: { "Content-Type": "multipart/form-data" }
    });
    if (result && typeof setPrediction_multiimg3d_result === "function") {
        setPrediction_multiimg3d_result(result); 
    }
  };
  return (
    <div className={`w-full bg-fondologin transition-all duration-300 ease-in-out ${
        isCollapsed
          ? "sm:ml-[80px] xl:ml-[80px] 2xl:ml-[80px]"
          : "sm:ml-[264px] xl:ml-[265px] 2xl:ml-[300px]" 
      }`}>
      <div className="bg-principal pt-6 pb-4 border-b-2 border-linea">
        <p className="text-center text-2xl">Imagen a 3D (Múltiples vistas)</p>
      </div>
      <div className="flex flex-col xl:flex-row w-full min-h-[calc(100vh-200px)] bg-fondologin">
        <div className="w-full xl:w-1/3 p-6 border-r-2 border-linea">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-base font-medium">Nombre de la generación</label>
              <input
                type="text"
                placeholder="Ingrese un nombre"
                value={generationName}
                onChange={(e) => setGenerationName(e.target.value)}
                disabled={predictionLoading}
                className="bg-transparent border p-2 rounded-md w-full text-base"
              />
            </div>
            <div className="flex justify-between text-base text-gray-400 px-1"> 
              {["frontal", "lateral", "trasera"].map(type => (
                <span
                  key={type}
                  className={`cursor-pointer capitalize p-1 rounded ${ 
                    currentImageType === type ? "text-blue-400 font-semibold bg-blue-900/30" : "hover:text-blue-300" // Resaltado mejorado
                  } ${imageFiles[type] ? 'text-green-400' : ''}`}
                  onClick={() => !predictionLoading && selectImageType(type)} 
                  title={imageFiles[type] ? `Imagen ${type} cargada` : `Cargar imagen ${type}`}
                >
                  {type} {imageFiles[type] ? '✓' : ''}
                </span>
              ))}
            </div>
            <div
              className={`relative border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors min-h-[16rem] flex flex-col items-center justify-center ${
                isDragging ? "border-blue-500 bg-blue-900/10" : "border-linea" 
              } ${predictionLoading ? "opacity-50 cursor-not-allowed" : "hover:border-blue-500"}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => !predictionLoading && document.getElementById('fileInput-multi').click()}
            >
              <input
                id="fileInput-multi"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={predictionLoading}
                className="hidden"
              />
              {imagePreviews[currentImageType] ? (
                <div className="w-full h-full flex flex-col items-center gap-2">
                  <img
                    src={imagePreviews[currentImageType]}
                    alt={`Vista previa (${currentImageType})`}
                    className="max-w-full max-h-32 object-contain rounded-md mb-2" 
                  />
                   <span className="text-xs text-gray-400">Mostrando: {currentImageType}</span>
                   <span className="text-xs text-gray-500">(Haz clic en Frontal/Lateral/Trasera arriba para cambiar o reemplazar)</span>
                </div>
              ) : (
                <>
                  <UploadSimple className="w-8 h-8 text-gray-400" weight="thin" />
                  <p className="mt-2 text-base capitalize">
                    Arrastra o haz clic para cargar <strong>{currentImageType}</strong>
                  </p>
                  <p className="mt-1 text-base text-gray-400">PNG, JPG, JPEG (MAX. 10MB)</p>
                </>
              )}
            </div>
            <Button
              onClick={handleLocalPrediction}
              disabled={predictionLoading || !imageFiles.frontal || !imageFiles.lateral || !imageFiles.trasera}
              className={`w-full text-base bg-gradient-to-r hover:bg-gradient-to-tr from-azul-gradient to-morado-gradient py-2 rounded-md border-none flex items-center justify-center gap-2 ${(!imageFiles.frontal || !imageFiles.lateral || !imageFiles.trasera) && !predictionLoading ? 'opacity-50 cursor-not-allowed' : ''}`} // Estilo deshabilitado más claro
            >
              <Sparkle size={16} weight="fill" />
              Generar
            </Button>
          </div>
        </div>
        <div className="w-full xl:w-2/3">
          <MultiImagen3DResult prediction_multiimg3d_result={prediction_multiimg3d_result} />
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