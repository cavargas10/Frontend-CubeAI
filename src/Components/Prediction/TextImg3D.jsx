import React, { useState, useEffect } from "react";
import axios from "axios";
import { Sparkle } from "@phosphor-icons/react";
import { TextImg3DResult } from "./TextImg3DResult";
import { ErrorModal } from "../Modals/ErrorModal";
import { LoadingModal } from "../Modals/LoadingModal";
import { Button } from "flowbite-react";

export const TextImg3D = ({
  user,
  setPrediction_textimg3d_result,
  setLoading,
  loading,
  BASE_URL,
  prediction_textimg3d_result,
  activeTab,
}) => {
  const [generationName, setGenerationName] = useState("");
  const [subject, setSubject] = useState("");
  const [style, setStyle] = useState("");
  const [additionalDetails, setAdditionalDetails] = useState("");
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
    setSubject("");
    setStyle("");
    setAdditionalDetails("");
    setErrorModalVisible(false);
    setErrorMessage("");
    setLoadingModalVisible(false);
    setPrediction_textimg3d_result(null);
    setLoading(false);
  };

  const handleStyleChange = (event) => {
    setStyle(event.target.value);
  };

  const handlePrediction = async () => {
    if (!generationName || !subject || !style || !additionalDetails) {
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
        `${BASE_URL}/textimg3D`,
        {
          generationName,
          subject,
          style,
          additionalDetails,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setPrediction_textimg3d_result(response.data);
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

  return (
    <div className="w-full sm:ml-[250px] sm:w-full xl:ml-[250px] 2xl:ml-[300px] xl:w-full bg-fondologin">
      <div className="bg-principal pt-6 pb-4 border-b-2 border-linea xl:border-none">
        <p className="text-center text-2xl">Texto e Imagen a 3D</p>
      </div>

      <div className=" px-4 py-4 flex flex-col gap-4 sm:w-4/3 sm:mt-4 sm:px-4  sm:flex sm:flex-col sm:gap-4  xl:mt-0 xl:ml-0 xl:flex-row xl:w-full xl:flex  xl:gap-4 xl:py-4 xl:px-4 xl:justify-between xl:items-center xl:border-y-2 xl:border-linea">
        <div className="flex justify-between items-center gap-4 grow xl:flex xl:justify-center xl:items-center xl:gap-4 xl:grow">
          <p className="">Nombre</p>
          <input
            type="text"
            placeholder="Ingrese un nombre"
            value={generationName}
            onChange={(e) => setGenerationName(e.target.value)}
            disabled={loading}
            className="bg-transparent border p-2 rounded-md  w-full  xl:grow"
          />
        </div>
        <div className="flex flex-grow justify-center items-center gap-4 ">
          <p className="">Prompt</p>
          <input
            type="text"
            placeholder="Ingrese Prompt"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            disabled={loading}
            className="bg-transparent border p-2 rounded-md   w-full"
          />
        </div>
        <div className="flex flex-grow justify-center items-center gap-4">
          <p className="">Detalles</p>
          <input
            type="text"
            placeholder="Detalles adicionales"
            value={additionalDetails}
            onChange={(e) => setAdditionalDetails(e.target.value)}
            disabled={loading}
            className="bg-transparent border p-2 rounded-md w-full "
          />
        </div>
        <div className="flex flex-grow justify-center items-center gap-4 ">
          <p className="">Estilo</p>
          <select
            value={style}
            onChange={handleStyleChange}
            disabled={loading}
            className="bg-transparent border p-2 rounded-md w-full text-white custom-select"
          >
            <option value="" disabled>
              Selecciona un estilo
            </option>
            <option value="disney">Disney</option>
            <option value="pixar">Pixar-like</option>
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
            className="w-full sm:justify-center text-lg bg-gradient-to-r hover:bg-gradient-to-tr from-azul-gradient to-morado-gradient py-1 px-6 rounded-lg border-none flex items-center justify-center"
          >
            Generar
          </Button>
        </div>
      </div>

      <div
        className="sm:mt-4 border-t-2 border-linea xl:border-none
      "
      ></div>
      <TextImg3DResult
        prediction_textimg3d_result={prediction_textimg3d_result}
      />

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