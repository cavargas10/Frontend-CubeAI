import React, { useState, useEffect, useCallback } from "react";
import { Sparkle, UploadSimple } from "@phosphor-icons/react";
import { Button } from "flowbite-react";
import { ErrorModal } from "../../../../components/modals/ErrorModal";
import { LoadingModal } from "../../../../components/modals/LoadingModal";
import { Unico3DResult } from "../results/Unico3DResult";
import { usePredictionHandler } from "../../hooks/usePredictionHandler";
import { useImageUpload } from "../../hooks/useImageUpload";

export const Unico3DInput = ({
  user,
  setPrediction_unico3d_result,
  isCollapsed,
}) => {
  const [generationName, setGenerationName] = useState("");

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
    setError: setPredictionError,
  } = usePredictionHandler(user);

  const resetComponentState = useCallback(() => {
    setGenerationName("");
    resetImageState();
    clearPredictionError();
    if (typeof setPrediction_unico3d_result === "function") {
      setPrediction_unico3d_result(null);
    }
  }, [resetImageState, clearPredictionError, setPrediction_unico3d_result]);

  useEffect(() => {
    return () => {
      resetComponentState();
    };
  }, [resetComponentState]);

  const handleLocalPrediction = async () => {
    if (!imageFile) {
      setPredictionError("No se ha seleccionado ninguna imagen");
      return;
    }
    if (!generationName.trim()) {
      setPredictionError("Por favor, ingrese un nombre para la generación");
      return;
    }

    const formData = new FormData();
    formData.append("image", imageFile);
    formData.append("generationName", generationName);

    const result = await submitPrediction("unico3D", formData);

    if (result && typeof setPrediction_unico3d_result === "function") {
      setPrediction_unico3d_result(result);
    }
  };

  return (
    <div
      className={`w-full bg-fondologin transition-all duration-300 ease-in-out ${
        isCollapsed
          ? "sm:ml-[80px] xl:ml-[80px] 2xl:ml-[80px]"
          : "sm:ml-[264px] xl:ml-[265px] 2xl:ml-[300px]"
      }`}
    >
      <div className="pt-6 bg-principal pb-4 border-b-2 border-linea ">
        <p className="text-center text-2xl">Unico a 3D</p>
      </div>
      <div className="flex flex-col xl:flex-row w-full min-h-[calc(100vh-200px)] bg-fondologin">
        <div className="w-full xl:w-1/3 p-6 border-r-2 border-linea">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-lg text-gray-300">Nombre de la generación</label>
              <input
                type="text"
                placeholder="Ej: Mi objeto escaneado"
                value={generationName}
                onChange={(e) => setGenerationName(e.target.value)}
                disabled={predictionLoading}
                className="bg-transparent border border-linea p-3 rounded-lg w-full text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div
              className={`relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors min-h-[16rem] flex flex-col items-center justify-center ${
                isDragging ? "border-blue-500 bg-blue-900/20" : "border-linea"
              } ${predictionLoading ? "opacity-50 cursor-not-allowed" : "hover:border-blue-500"}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => !predictionLoading && document.getElementById("fileInput-unico3d").click()}
            >
              <input
                id="fileInput-unico3d"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={predictionLoading}
                className="hidden"
              />
              {imagePreview ? (
                <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                  <img
                    src={imagePreview}
                    alt="Vista previa"
                    className="max-w-[80%] max-h-[80%] object-contain rounded-lg"
                  />
                </div>
              ) : (
                <>
                  <UploadSimple className="w-12 h-12 text-gray-400 mb-3" weight="light" />
                  <p className="text-sm text-gray-300">Arrastra una imagen o haz clic</p>
                  <p className="mt-1 text-xs text-gray-500">PNG, JPG, JPEG (MAX. 10MB)</p>
                </>
              )}
            </div>
            <Button
              onClick={handleLocalPrediction}
              disabled={predictionLoading}
              className="w-full text-base bg-gradient-to-r hover:bg-gradient-to-tr from-azul-gradient to-morado-gradient py-2.5 rounded-lg border-none flex items-center justify-center gap-2 disabled:opacity-60"
            >
              <Sparkle size={20} weight="fill" />
              Generar
            </Button>
          </div>
        </div>
        <div className="w-full xl:w-2/3">
          <Unico3DResult />
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