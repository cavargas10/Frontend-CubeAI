import React, { useState } from "react";
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
}) => {
  const [generationName, setGenerationName] = useState("");
  const [subject, setSubject] = useState("");
  const [style, setStyle] = useState("");
  const [additionalDetails, setAdditionalDetails] = useState("");
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loadingModalVisible, setLoadingModalVisible] = useState(false);

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
      console.error("Error completo:", error);
      if (error.response) {
        console.log("Respuesta de error del servidor:", error.response.data);
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
    <div className="col-span-8 ml-[250px] w-full border-l-2 bg-fondologin border-linea">
      <div className="border-solid border-b-2 pt-6 bg-principal border-linea pb-4">
        <p className="text-center text-2xl">Texto e Imagen a 3D</p>
      </div>
      <div className="flex flex-wrap gap-4 px-4 mt-2">
        <div className="flex items-center gap-2 grow">
          <p className="mt-3">Nombre</p>
          <input
            type="text"
            placeholder="Ingrese un nombre"
            value={generationName}
            onChange={(e) => setGenerationName(e.target.value)}
            disabled={loading}
            className="bg-transparent border p-2 rounded-md w-full mt-3"
          />
        </div>
        <div className="flex items-center gap-2 grow">
          <p className="mt-3">Prompt</p>
          <input
            type="text"
            placeholder="Ingrese Prompt"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            disabled={loading}
            className="bg-transparent border p-2 rounded-md w-full mt-3"
          />
        </div>
        <div className="flex items-center gap-2 grow">
          <p className="mt-3">Detalles</p>
          <input
            type="text"
            placeholder="Detalles adicionales"
            value={additionalDetails}
            onChange={(e) => setAdditionalDetails(e.target.value)}
            disabled={loading}
            className="bg-transparent border p-2 rounded-md w-full mt-3"
          />
        </div>
        <div className="flex items-center gap-2 grow">
          <p className="mt-3">Estilo</p>
          <select
            value={style}
            onChange={handleStyleChange}
            disabled={loading}
            className="bg-transparent border p-2 rounded-md w-full text-white custom-select mt-3"
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
        <div className="flex items-center justify-end grow mt-2">
          <Sparkle size={32} color="#fff" className="absolute mt-1 z-20" />
          <Button
            onClick={handlePrediction}
            disabled={loading}
            className="text-lg bg-gradient-to-r flex justify-end from-azul-gradient to-morado-gradient py-1 px-6 rounded-lg border-none"
          >
            Generar
          </Button>
        </div>
      </div>

      <TextImg3DResult
        prediction_textimg3d_result={prediction_textimg3d_result}
      />

      <ErrorModal
        showModal={errorModalVisible}
        closeModal={closeErrorModal}
        errorMessage={errorMessage}
      />

      <LoadingModal showLoadingModal={loadingModalVisible} />
    </div>
  );
};