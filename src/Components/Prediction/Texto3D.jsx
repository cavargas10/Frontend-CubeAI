import React, { useState } from "react";
import axios from "axios";
import { Sparkle } from "@phosphor-icons/react";
import { Texto3DResult } from "./Texto3DResult";
import { ErrorModal } from "../Modals/ErrorModal";
import { LoadingModal } from "../Modals/LoadingModal"; 
import { Button } from "flowbite-react";

export const Texto3D = ({
  user,
  setPrediction_text3d_result,
  setLoading,
  loading,
  BASE_URL,
  prediction_text3d_result,
}) => {
  const [generationName, setGenerationName] = useState("");
  const [userPrompt, setUserPrompt] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("");
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loadingModalVisible, setLoadingModalVisible] = useState(false);

  const handleStyleChange = (event) => {
    setSelectedStyle(event.target.value);
  };

  const handlePrediction = async () => {
    if (!generationName || !userPrompt || !selectedStyle) {
      const error = "Todos los campos son obligatorios";
      setErrorMessage(error);
      setErrorModalVisible(true); 
      return;
    }

    setLoadingModalVisible(true);
    setLoading(true);

    try {
      const token = await user.getIdToken();
      const response = await axios.post(
        `${BASE_URL}/texto3D`,
        {
          generationName,
          prompt: userPrompt,
          selectedStyle,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setPrediction_text3d_result(response.data);
    } catch (error) {
      console.error("Error completo:", error);
      if (error.response) {
        console.log("Respuesta de error del servidor:", error.response.data);
        const backendError = error.response.data.error || "Error desconocido al realizar la predicción";
        setErrorMessage(backendError);
      } else if (error.request) {
        const requestError = "No se pudo contactar al servidor. Por favor, inténtelo más tarde.";
        setErrorMessage(requestError);
      } else {
        const configError = "Error al configurar la solicitud. Por favor, inténtelo más tarde.";
        setErrorMessage(configError);
      }
      setErrorModalVisible(true); 
    } finally {
      setLoading(false);
      setLoadingModalVisible(false);
    }
  };

  const closeErrorModal = () => {
    setErrorModalVisible(false);
    setErrorMessage("");
  };

  return (
    <div className="ml-[250px] w-full bg-fondologin h-[569px]">
      <div className="pt-6 border-r-2 bg-principal pb-4 border-linea">
        <p className="text-center text-2xl">Texto a 3D</p>
      </div>

      <div className="flex mt border border-linea">
        <div className="w-96 border-r-2 border-linea flex flex-col gap-10 p-6">
          <div className="flex items-center justify-center gap-4 grow">
            <p>Nombre</p>
            <input
              type="text"
              placeholder="Nombre de la generación"
              value={generationName}
              onChange={(e) => setGenerationName(e.target.value)}
              disabled={loading}
              className="mt-3 bg-transparent border p-2 rounded-md w-full"
            />
          </div>

          <div className="flex items-center justify-center grow mt-2">
            <p className="me-2">Prompt</p>
            <input
              type="text"
              placeholder="Prompt de la generación"
              value={userPrompt}
              onChange={(e) => setUserPrompt(e.target.value)}
              disabled={loading}
              className="bg-transparent border p-2 rounded-md w-full"
            />
          </div>

          <div className="flex items-center gap-2 grow">
            <p>Estilo</p>
            <select
              value={selectedStyle}
              onChange={handleStyleChange}
              disabled={loading}
              className="bg-transparent border p-2 rounded-md w-full text-white custom-select"
            >
              <option value="" disabled>
                Selecciona un estilo
              </option>
              <option value="disney">Disney</option>
              <option value="pixar">Pixar</option>
              <option value="realista">Realista</option>
              <option value="anime">Anime</option>
              <option value="chibi">Chibi</option>
            </select>
          </div>

          <div className="flex items-center justify-end grow">
            <Sparkle size={24} color="#fff" className="absolute left-28 z-20" />
            <Button
              onClick={handlePrediction}
              disabled={loading}
              className="w-full text-lg bg-gradient-to-r from-azul-gradient to-morado-gradient py-2 rounded-lg border-none flex items-center justify-center"
            >
              Generar
            </Button>
          </div>
        </div>

        <Texto3DResult prediction_text3d_result={prediction_text3d_result} />
      </div>
      
      <ErrorModal
        showModal={errorModalVisible}
        closeModal={closeErrorModal}
        errorMessage={errorMessage}
      />

      <LoadingModal showLoadingModal={loadingModalVisible} />
    </div>
  );
};