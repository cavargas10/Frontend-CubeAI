import React, { useState, useEffect } from "react";
import axios from "axios";
import { Unico3DResult } from "./Unico3DResult";
import { Sparkle, DownloadSimple } from "@phosphor-icons/react";
import { FileInput, Button } from "flowbite-react";
import { ErrorModal } from "../Modals/ErrorModal";
import { LoadingModal } from "../Modals/LoadingModal";

export const Unico3D = ({
  user,
  setPrediction_unico3d_result,
  setLoading,
  loading,
  BASE_URL,
  prediction_unico3d_result,
  activeTab,
  isGenerationComplete
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
    setPrediction_unico3d_result(null);
    setLoading(false);
  };

  const handleFileChange = (event) => {
    setImageFile(event.target.files[0]);
  };

  const handlePrediction = async () => {
    if (!imageFile) {
      const error = "No se ha seleccionado ninguna imagen";
      setErrorMessage(error);
      setErrorModalVisible(true);
      return;
    }

    if (!generationName) {
      const error = "Por favor, ingrese un nombre para la generación";
      setErrorMessage(error);
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
      console.log([...formData.entries()]);

      const response = await axios.post(`${BASE_URL}/unico3D`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      setPrediction_unico3d_result(response.data);
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
    if (prediction_unico3d_result && prediction_unico3d_result.obj_glb) {
      window.open(prediction_unico3d_result.obj_glb, '_blank');
    }
  };

  return (
    <div className="grid grid-cols-2 gap-4 ml-[250px] w-full border-l-2 h-full bg-fondologin border-linea">
      <div className="col-span-1 border-r-2 border-linea">
        <div>
          <div className="border-solid border-b-2 bg-principal border-linea pb-4">
            <p className="text-center pt-6 text-2xl">Unico3D</p>
          </div>
          <div className="flex flex-col gap-4 px-4 mt-2">
            <div className="flex items-center justify-center gap-4">
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
            <div className="flex items-center justify-center">
              <FileInput
                accept="image/*"
                onChange={handleFileChange}
                disabled={loading}
                label="Seleccionar archivo"
                className="grow"
              />
            </div>
            <div className="mt-2">
              <Sparkle
                size={32}
                color="#fff"
                className="absolute mt-2 ml-2 z-20"
              />
              <Button
                onClick={handlePrediction}
                disabled={loading}
                className="text-lg bg-gradient-to-r hover:bg-gradient-to-tr flex justify-end from-azul-gradient to-morado-gradient py-1 mt-1 px-6 rounded-lg border-none w-full"
              >
                Generar
              </Button>
            </div>
            <div className="mt-2">
              <DownloadSimple
                size={32}
                color="#fff"
                className="absolute mt-2 ml-2 z-20"
              />
              <Button
                onClick={handleDownload}
                disabled={!prediction_unico3d_result}
                className={`text-lg flex justify-end py-1 mt-1 px-6 rounded-lg border-none w-full ${
                  prediction_unico3d_result
                    ? 'bg-gradient-to-r hover:bg-gradient-to-tr from-azul-gradient to-morado-gradient cursor-pointer'
                    : 'bg-gray-400 cursor-not-allowed'
                }`}
              >
                Descargar GLB
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="col-span-1">
        <Unico3DResult prediction_unico3d_result={prediction_unico3d_result} 
        isGenerationComplet={isGenerationComplete} />
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