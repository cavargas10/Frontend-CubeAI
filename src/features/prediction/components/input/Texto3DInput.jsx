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
  } = usePredictionHandler(user);

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
          <div className="flex flex-col gap-7">
            <div className="flex flex-col gap-2">
              <label className="text-lg text-gray-300">Nombre de la generación</label>
              <input
                type="text"
                placeholder="Ej: Espada mágica brillante"
                value={generationName}
                onChange={(e) => setGenerationName(e.target.value)}
                disabled={predictionLoading}
                className="bg-transparent border border-linea p-3 rounded-lg w-full text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-lg text-gray-300">Prompt</label>
              <input
                type="text"
                placeholder="Describa el modelo 3D detalladamente"
                value={userPrompt}
                onChange={(e) => setUserPrompt(e.target.value)}
                disabled={predictionLoading}
                className="bg-transparent border border-linea p-3 rounded-lg w-full text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-lg text-gray-300">Estilo Visual</label>
              <div className="grid grid-cols-3 gap-3">
                {styles.map((style) => (
                  <button
                    key={style.value}
                    onClick={() => setSelectedStyle(style.value)}
                    disabled={predictionLoading}
                    className={`relative border-2 rounded-lg p-2.5 flex items-center justify-center transition-all text-sm h-12 ${
                      selectedStyle === style.value
                        ? "border-blue-500 bg-blue-900/30 shadow-lg scale-105 font-semibold"
                        : "border-linea hover:border-blue-400 bg-principal/50"
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
              className="w-full text-base bg-gradient-to-r hover:bg-gradient-to-tr from-azul-gradient to-morado-gradient py-2.5 rounded-lg border-none flex items-center justify-center gap-2 disabled:opacity-60"
            >
              <Sparkle size={20} weight="fill" />
              Generar
            </Button>
          </div>
        </div>
        <div className="w-full xl:w-2/3">
          <Texto3DResult />
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