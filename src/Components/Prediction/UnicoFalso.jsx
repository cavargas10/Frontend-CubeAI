import React, { useState } from "react";
import axios from "axios";
import { Unico3DResult } from "./Unico3DResult";
import { Sparkle } from "@phosphor-icons/react";
import { FileInput, Button, Alert } from "flowbite-react";
import { ErrorModal } from "./ErrorModal"; // Import the ErrorModal component

export const Unico3D = ({
  user,
  setPredictionResult,
  setLoading,
  setError,
  loading,
  BASE_URL,
  predictionResult,
}) => {
  const [imageFile, setImageFile] = useState(null);
  const [generationName, setGenerationName] = useState("");
  const [localError, setLocalError] = useState(null);
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleFileChange = (event) => {
    setImageFile(event.target.files[0]);
    setLocalError(null);
  };

  const handlePrediction = async () => {
    if (!imageFile) {
      setLocalError("No se ha seleccionado ninguna imagen");
      return;
    }

    if (!generationName) {
      setLocalError("Por favor, ingrese un nombre para la generación");
      return;
    }

    setLoading(true);
    setError(null);
    setLocalError(null);

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

      setPredictionResult(response.data);
    } catch (error) {
      if (error.response) {
        const backendError =
          error.response.data.error ||
          "Error desconocido al realizar la predicción";
        setLocalError(backendError);
        setErrorMessage(backendError);
      } else if (error.request) {
        const requestError =
          "No se pudo contactar al servidor. Por favor, inténtelo más tarde.";
        setLocalError(requestError);
        setErrorMessage(requestError);
      } else {
        const configError =
          "Error al configurar la solicitud. Por favor, inténtelo más tarde.";
        setLocalError(configError);
        setErrorMessage(configError);
      }
      setErrorModalVisible(true); // Show the error modal
    } finally {
      setLoading(false);
    }
  };

  const closeErrorModal = () => {
    setErrorModalVisible(false);
    setErrorMessage("");
  };

  return (
    <div className="grid grid-cols-2 gap-4 ml-[250px] w-full border-l-2 pt-6 bg-fondologin border-linea">
      <div className="col-span-1 pr-4 border-r-2 border-linea">
        <div>
          <div className="border-solid border-b-2 border-linea pb-4">
            <p className="text-center text-2xl">Unico3D</p>
          </div>
          {localError && (
            <Alert color="failure" className="mt-2">
              {localError}
            </Alert>
          )}
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
                className="text-lg bg-gradient-to-r flex justify-end from-azul-gradient to-morado-gradient py-1 mt-1 px-6 rounded-lg border-none"
              >
                {loading ? "Realizando Predicción..." : "Generar"}
              </Button>
            </div>
          </div>
          <div className="border-t-2 border-linea mt-4 pt-4">
            <Unico3DResult predictionResult={predictionResult} />
          </div>
        </div>
      </div>
      <div className="col-span-1">
        {predictionResult && (
          <div className="mt-4">
            <h3 className="text-xl text-center">Resultado de la Generación</h3>
            {predictionResult.obj_glb && (
              <div className="flex justify-center gap-10 mt-4">
                <div className="flex items-center justify-around w-[200px] px-4 py-2 text-white rounded-md shadow-md bg-gradient-to-r from-azul-gradient to-morado-gradient hover:from-morado-gradient hover:to-azul-gradient">
                  <DownloadSimple size={32} color="white" />
                  <a
                    href={predictionResult.obj_glb}
                    download="make3d.glb"
                    className="text-xl"
                  >
                    GLB
                  </a>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      <ErrorModal
        showModal={errorModalVisible}
        closeModal={closeErrorModal}
        errorMessage={errorMessage}
      />
    </div>
  );
};
