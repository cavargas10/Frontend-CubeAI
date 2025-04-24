import React, { useState, useEffect, useCallback } from "react";
import { Sparkle } from "@phosphor-icons/react";
import { Button } from "flowbite-react";
import { ErrorModal } from "../../../../components/modals/ErrorModal";
import { LoadingModal } from "../../../../components/modals/LoadingModal";
import { Texto3DResult } from "../results/Texto3DResult";
import { usePredictionHandler } from "../../hooks/usePredictionHandler";

const styles = [
  { name: "Disney", value: "disney" },
  { name: "Pixar", value: "pixar" },
  { name: "Realista", value: "realista" },
  { name: "Anime", value: "anime" },
  { name: "Chibi", value: "chibi" },
];

export const Texto3DInput = ({
  user,
  setPrediction_text3d_result,
  BASE_URL,
  prediction_text3d_result,
  isCollapsed,
}) => {
  const [generationName, setGenerationName] = useState("");
  const [userPrompt, setUserPrompt] = useState("");
  const [selectedStyle, setSelectedStyle] = useState(null);

  const {
    isLoading: predictionLoading,
    error: predictionError,
    submitPrediction,
    clearError: clearPredictionError,
    setError: setPredictionError,
  } = usePredictionHandler(user, BASE_URL);

  const resetComponentState = useCallback(() => {
    setGenerationName("");
    setUserPrompt("");
    setSelectedStyle(null);
    clearPredictionError();
    if (typeof setPrediction_text3d_result === "function") {
      setPrediction_text3d_result(null);
    }
  }, [clearPredictionError, setPrediction_text3d_result]);

  useEffect(() => {
    return () => {
      resetComponentState();
    };
  }, [resetComponentState]);

  const handleLocalPrediction = async () => {
    if (!generationName.trim() || !userPrompt.trim() || !selectedStyle) {
      setPredictionError(
        "Todos los campos (Nombre, Prompt, Estilo) son obligatorios"
      );
      return;
    }

    const result = await submitPrediction("texto3D", {
      generationName,
      prompt: userPrompt,
      selectedStyle,
    });

    if (result && typeof setPrediction_text3d_result === "function") {
      setPrediction_text3d_result(result);
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
      <div className="pt-6 bg-principal pb-4 border-b-2 border-linea">
        <p className="text-center text-2xl">Texto a 3D</p>
      </div>
      <div className="flex flex-col xl:flex-row w-full min-h-[calc(100vh-200px)] bg-fondologin">
        <div className="w-full xl:w-1/3 p-6 border-r-2 border-linea">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-lg">Nombre de la generación</label>
              <input
                type="text"
                placeholder="Ingrese un nombre"
                value={generationName}
                onChange={(e) => setGenerationName(e.target.value)}
                disabled={predictionLoading}
                className="bg-transparent border p-3 rounded-lg w-full"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-lg">Prompt</label>
              <input
                type="text"
                placeholder="Describa el modelo 3D"
                value={userPrompt}
                onChange={(e) => setUserPrompt(e.target.value)}
                disabled={predictionLoading}
                className="bg-transparent border p-3 rounded-lg w-full"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-lg">Estilo</label>
              <div className="grid grid-cols-3 gap-4">
                {styles.map((style) => (
                  <button
                    key={style.value}
                    onClick={() => setSelectedStyle(style.value)}
                    disabled={predictionLoading}
                    className={`relative border-2 rounded-lg p-2 flex flex-col items-center justify-center transition-all text-sm ${
                      // Ajusta padding/text size si es necesario
                      selectedStyle === style.value
                        ? "border-azul-gradient shadow-lg scale-105"
                        : "border-linea hover:border-azul-gradient"
                    }`}
                  >
                    <span>{style.name}</span>
                  </button>
                ))}
              </div>
            </div>
            <Button
              onClick={handleLocalPrediction}
              disabled={predictionLoading}
              className="w-full text-lg bg-gradient-to-r hover:bg-gradient-to-tr from-azul-gradient to-morado-gradient py-3 rounded-lg border-none flex items-center justify-center gap-2"
            >
              <Sparkle size={24} weight="fill" />
              Generar
            </Button>
          </div>
        </div>
        <div className="w-full xl:w-2/3">
          <Texto3DResult prediction_text3d_result={prediction_text3d_result} />
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
