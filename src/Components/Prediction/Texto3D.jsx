import React, { useState, useEffect } from "react";
import axios from "axios";
import { Sparkle, DownloadSimple } from "@phosphor-icons/react";
import { Texto3DResult } from "./Texto3DResult";
import { ErrorModal } from "../modals/ErrorModal";
import { LoadingModal } from "../modals/LoadingModal";
import { Button } from "flowbite-react";

const styles = [
  { name: "Disney", value: "disney"},
  { name: "Pixar", value: "pixar"},
  { name: "Realista", value: "realista"},
  { name: "Anime", value: "anime"},
  { name: "Chibi", value: "chibi"},
];

export const Texto3D = ({
  user,
  setPrediction_text3d_result,
  setLoading,
  loading,
  BASE_URL,
  prediction_text3d_result,
  activeTab,
  isCollapsed,
}) => {
  const [generationName, setGenerationName] = useState("");
  const [userPrompt, setUserPrompt] = useState("");
  const [selectedStyle, setSelectedStyle] = useState(null);
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loadingModalVisible, setLoadingModalVisible] = useState(false);

  useEffect(() => {
    return () => {
      resetState();
    };
  }, [activeTab]);

  const resetState = () => {
    setGenerationName("");
    setUserPrompt("");
    setSelectedStyle(null);
    setErrorModalVisible(false);
    setErrorMessage("");
    setLoadingModalVisible(false);
    setPrediction_text3d_result(null);
    setLoading(false);
  };

  const handlePrediction = async () => {
    if (!generationName || !userPrompt || !selectedStyle) {
      setErrorMessage("Todos los campos son obligatorios");
      setErrorModalVisible(true);
      return;
    }

    setLoadingModalVisible(true);
    setLoading(true);

    try {
      const token = await user.getIdToken();
      const response = await axios.post(
        `${BASE_URL}/texto3D`,
        { generationName, prompt: userPrompt, selectedStyle },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setPrediction_text3d_result(response.data);
    } catch (error) {
      setErrorMessage(
        error.response?.data?.error ||
          "Error al generar el modelo. Intente nuevamente."
      );
      setErrorModalVisible(true);
    } finally {
      setLoading(false);
      setLoadingModalVisible(false);
    }
  };

  return (
    <div
      className={`w-full sm:ml-[264px] xl:ml-[265px] 2xl:ml-[300px] bg-fondologin 
        transition-all duration-300 ease-in-out${
        isCollapsed ? "sm:ml-[80px] xl:ml-[80px] 2xl:ml-[80px]" : ""
      }`}
    >
      <div className="pt-6 bg-principal pb-4 border-b-2 border-linea">
        <p className="text-center text-2xl">Texto a 3D</p>
      </div>

      <div className="flex flex-col xl:flex-row w-full min-h-[calc(100vh-200px)] bg-fondologin">
        {/* Formulario (Izquierda) */}
        <div className="w-full xl:w-1/3 p-6 border-r border-linea">
          <div className="flex flex-col gap-6">
            {/* Nombre */}
            <div className="flex flex-col gap-2">
              <label className="text-lg">Nombre de la generación</label>
              <input
                type="text"
                placeholder="Ingrese un nombre"
                value={generationName}
                onChange={(e) => setGenerationName(e.target.value)}
                disabled={loading}
                className="bg-transparent border p-3 rounded-lg w-full"
              />
            </div>

            {/* Prompt */}
            <div className="flex flex-col gap-2">
              <label className="text-lg">Prompt</label>
              <input
                type="text"
                placeholder="Describa el modelo 3D"
                value={userPrompt}
                onChange={(e) => setUserPrompt(e.target.value)}
                disabled={loading}
                className="bg-transparent border p-3 rounded-lg w-full"
              />
            </div>

            {/* Estilos (Nuevos botones visuales) */}
            <div className="flex flex-col gap-2">
              <label className="text-lg">Estilo</label>
              <div className="grid grid-cols-3 gap-4">
                {styles.map((style) => (
                  <button
                    key={style.value}
                    onClick={() => setSelectedStyle(style.value)}
                    disabled={loading}
                    className={`relative border-2 rounded-lg p-2 flex flex-col items-center justify-center transition-all 
                      ${
                        selectedStyle === style.value
                          ? "border-azul-gradient shadow-lg scale-105"
                          : "border-gray-500 hover:border-azul-gradient"
                      }`}
                  >
                    <span className="text-sm">{style.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Botón de generación */}
            <Button
              onClick={handlePrediction}
              disabled={loading}
              className="w-full text-lg bg-gradient-to-r hover:bg-gradient-to-tr from-azul-gradient to-morado-gradient py-3 rounded-lg border-none flex items-center justify-center gap-2"
            >
              <Sparkle size={24} weight="fill" />
              Generar
            </Button>
          </div>
        </div>

        {/* Resultado (Derecha) */}
        <div className="w-full xl:w-2/3">
          <Texto3DResult prediction_text3d_result={prediction_text3d_result} />
        </div>
      </div>

      <ErrorModal
        showModal={errorModalVisible}
        closeModal={() => setErrorModalVisible(false)}
        errorMessage={errorMessage}
      />
      <LoadingModal
        showLoadingModal={loadingModalVisible}
        message="Generando el modelo 3D..."
      />
    </div>
  );
};