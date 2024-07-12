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

      if (typeof setPrediction_img3d_result === "function") {
        setPrediction_img3d_result(response.data);
      } else {
        setErrorMessage(
          "Error interno de la aplicación. Por favor, intente de nuevo más tarde."
        );
        setErrorModalVisible(true);
      }
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
    <div className="w-full sm:ml-[250px] sm:w-full xl:ml-[250px] 2xl:ml-[300px] xl:w-full  bg-fondologin">
      <div className=" pt-6  bg-principal  pb-4  border-b-2 border-linea xl:border-none">
        <p className="text-center text-2xl">Imagen a 3D</p>
      </div>

      <div className="flex flex-col gap-4 py-4 px-4 sm:w-5/4 sm:px-4 sm:mt-4  sm:flex sm:flex-col sm:gap-4  xl:mt-0 xl:ml-0 xl:flex-row xl:w-full xl:flex  xl:gap-4 xl:py-4 xl:px-4 xl:justify-between xl:items-center xl:border-y-2 xl:border-linea">
        <div className="flex justify-between items-center gap-4 xl:flex xl:justify-center xl:items-center xl:gap-4 xl:grow">
          <p className="">Nombre</p>
          <input
            type="text"
            placeholder="Nombre de la generación"
            value={generationName}
            onChange={(e) => setGenerationName(e.target.value)}
            disabled={loading}
            className=" bg-transparent border p-2 rounded-md w-full  xl:grow"
          />
        </div>
        <div className="flex-grow">
          <FileInput
            accept="image/*"
            onChange={handleFileChange}
            disabled={loading}
            label="Seleccionar archivo"
            className="w-full"
          />
        </div>

        <div className="">
          <Sparkle
            size={24}
            color="#fff"
            className="absolute xl:ml-4 mt-2  z-20 sm:ml-52"
          />
          <Button
            onClick={handlePrediction}
            disabled={loading}
            className="w-full sm:justify-center text-lg bg-gradient-to-r hover:bg-gradient-to-tr flex justify-end from-azul-gradient to-morado-gradient py-1 px-6 rounded-lg border-none"
          >
            Generar
          </Button>
        </div>
      </div>

      <div
        className="sm:mt-4 border-t-2 border-linea xl:border-none
      "
      ></div>

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