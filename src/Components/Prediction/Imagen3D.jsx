import React, { useState, useEffect } from "react";
import axios from "axios";
import { Imagen3DResult } from "./Imagen3DResult";
import { Sparkle } from "@phosphor-icons/react";
import { FileInput, Button } from "flowbite-react";
import { ErrorModal } from "../Modals/ErrorModal";
import { LoadingModal } from "../Modals/LoadingModal";

export const Imagen3D = ({
  user,
  setPrediction_img3d_result,
  setLoading,
  loading,
  BASE_URL,
  prediction_img3d_result,
  activeTab,
}) => {
  const [imageFile, setImageFile] = useState(null);
  const [generationName, setGenerationName] = useState("");
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loadingModalVisible, setLoadingModalVisible] = useState(false);

  useEffect(() => {
    return () => {
      resetState();
    };
  }, [activeTab]);

  const resetState = () => {
    setImageFile(null);
    setGenerationName("");
    setErrorModalVisible(false);
    setErrorMessage("");
    setLoadingModalVisible(false);
    setPrediction_img3d_result(null);
    setLoading(false);
  };

  const handleFileChange = (event) => {
    setImageFile(event.target.files[0]);
  };

  const handlePrediction = async () => {
    if (!imageFile) {
      setErrorMessage("No se ha seleccionado ninguna imagen");
      setErrorModalVisible(true);
      return;
    }

    if (!generationName) {
      setErrorMessage("Por favor, ingrese un nombre para la generación");
      setErrorModalVisible(true);
      return;
    }

    setLoadingModalVisible(true);
    setLoading(true);

    try {
      const token = await user.getIdToken();
      const formData = new FormData();
      formData.append("image", imageFile);
      formData.append("generationName", generationName);

      const response = await axios.post(`${BASE_URL}/imagen3D`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Respuesta del servidor:", response.data);

      if (typeof setPrediction_img3d_result === "function") {
        setPrediction_img3d_result(response.data);
      } else {
        console.error("setPrediction_img3d_result no es una función");
        setErrorMessage(
          "Error interno de la aplicación. Por favor, intente de nuevo más tarde."
        );
        setErrorModalVisible(true);
      }
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
    <div className="ml-[250px] w-full border-l-2 border-linea bg-fondologin h-72">
      <div className="border-solid pt-6 border-b-2 bg-principal border-linea pb-4">
        <p className="text-center text-2xl">Imagen a 3D</p>
      </div>
      <div className="flex flex-wrap gap-4 px-4 mt-2">
        <div className="flex items-center justify-center gap-4 grow">
          <p className="mt-3">Nombre</p>
          <input
            type="text"
            placeholder="Nombre de la generación"
            value={generationName}
            onChange={(e) => setGenerationName(e.target.value)}
            disabled={loading}
            className="mt-3 bg-transparent border p-2 rounded-md w-[200px] grow"
          />
        </div>
        <div className="flex items-center justify-center grow mt-2">
          <FileInput
            accept="image/*"
            onChange={handleFileChange}
            disabled={loading}
            label="Seleccionar archivo"
            className="grow"
          />
        </div>
        <div className="mt-2">
          <Sparkle size={32} color="#fff" className="absolute mt-1 z-20" />
          <Button
            onClick={handlePrediction}
            disabled={loading}
            className="text-lg bg-gradient-to-r hover:bg-gradient-to-tr flex justify-end from-azul-gradient to-morado-gradient py-1 px-6 rounded-lg border-none"
          >
            Generar
          </Button>
        </div>
      </div>

      <Imagen3DResult prediction_img3d_result={prediction_img3d_result} />

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
