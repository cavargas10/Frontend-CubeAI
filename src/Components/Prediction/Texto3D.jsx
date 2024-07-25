import React, { useState, useEffect } from "react";
import axios from "axios";
import { Sparkle, DownloadSimple } from "@phosphor-icons/react";
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
  activeTab,
}) => {
  const [generationName, setGenerationName] = useState("");
  const [userPrompt, setUserPrompt] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("");
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
    setSelectedStyle("");
    setErrorModalVisible(false);
    setErrorMessage("");
    setLoadingModalVisible(false);
    setPrediction_text3d_result(null);
    setLoading(false);
  };

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
      if (error.response) {
        const backendError =
          error.response.data.error ||
          "Error desconocido al realizar la predicción";
        setErrorMessage(backendError);
      } else if (error.request) {
        const requestError =
          "No se pudo contactar al servidor. Por favor, inténtelo más tarde.";
        setErrorMessage(requestError);
      } else {
        const configError =
          "Error al configurar la solicitud. Por favor, inténtelo más tarde.";
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

  const handleDownload = () => {
    if (prediction_text3d_result && prediction_text3d_result.obj_model) {
      window.open(prediction_text3d_result.obj_model, "_blank");
    }
  };

  return (
    <div className=" w-full sm:ml-[264px] sm:w-full xl:ml-[250px] 2xl:ml-[300px] xl:w-full  bg-fondologin ">
      <div className="pt-6 bg-principal pb-4 border-b-2 border-linea xl:border-none  ">
        <p className="text-center text-2xl">Texto a 3D</p>
      </div>

      <div className="flex flex-col gap-4 px-4 py-2 sm:w-5/4  sm:mt-4 sm:px-4 sm:flex sm:flex-col sm:gap-4  xl:mt-0 xl:ml-0 xl:flex-row xl:w-full xl:flex  xl:gap-4 xl:py-4 xl:px-4 xl:justify-between xl:items-center xl:border-y-2 xl:border-linea">
        <div className=" flex items-center justify-center gap-4 grow ">
          <p>Nombre</p>
          <input
            type="text"
            placeholder="Nombre de la generación"
            value={generationName}
            onChange={(e) => setGenerationName(e.target.value)}
            disabled={loading}
            className="mt- bg-transparent border p-2 rounded-md w-full xl:grow"
          />
        </div>

        <div className="flex items-center justify-center grow ">
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

        <div className="flex justify-center items-center">
          <Sparkle
            size={24}
            color="#fff"
            className="absolute z-20 mr-20"
          />

          <Button
            onClick={handlePrediction}
            disabled={loading}
            className="w-full bg-gradient-to-r hover:bg-gradient-to-tr from-azul-gradient to-morado-gradient px-6  py-1 rounded-lg border-none flex items-center justify-center"
          >
            Generar
          </Button>
        </div>
      </div>
      <div
        className="sm:mt-0 border-t-2 border-linea xl:border-none
      "
      ></div>
      <Texto3DResult prediction_text3d_result={prediction_text3d_result} />

      <div className="flex justify-center items-center sm:w-96 sm:mx-auto ">
        <DownloadSimple
          size={32}
          color="#fff"
          className="absolute mr-32 mt-3 z-20"
        />

        <Button
          onClick={handleDownload}
          disabled={!prediction_text3d_result}
          className={`text-lg py-1 mt-3 px-6 rounded-lg border-none  w-full ${
            prediction_text3d_result
              ? "bg-gradient-to-r hover:bg-gradient-to-tr from-azul-gradient to-morado-gradient cursor-pointer"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          Descargar GLB
        </Button>
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