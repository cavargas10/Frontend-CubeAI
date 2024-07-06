import React, { useState } from "react";
import axios from "axios";
import { Unico3DResult } from "./Unico3DResult";
import { Sparkle } from "@phosphor-icons/react";
import { FileInput, Button, Alert } from "flowbite-react";

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
        setLocalError(
          error.response.data.error ||
            "Error desconocido al realizar la predicción"
        );
      } else if (error.request) {
        setLocalError(
          "No se pudo contactar al servidor. Por favor, inténtelo más tarde."
        );
      } else {
        setLocalError(
          "Error al configurar la solicitud. Por favor, inténtelo más tarde."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="col-span-8 ml-[250px] w-full border-l-2 mt-6 border-linea">
      <div>
        <div className="border-solid border-b-2 border-linea pb-4">
          <p className="text-center text-2xl">Unico3D</p>
        </div>
        {localError && (
          <Alert color="failure" className="mt-2">
            {localError}
          </Alert>
        )}
        <div className="flex gap-10 px-4 mt-2">
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
          <div className="flex items-center justify-center grow mt-3">
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
              className="text-lg bg-gradient-to-r flex justify-end from-azul-gradient to-morado-gradient py-1 px-6 rounded-lg border-none"
            >
              {loading ? "Realizando Predicción..." : "Generar"}
            </Button>
          </div>
        </div>
        <Unico3DResult predictionResult={predictionResult} />
      </div>
    </div>
  );
};
