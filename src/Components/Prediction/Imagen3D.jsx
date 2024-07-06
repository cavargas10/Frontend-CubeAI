import React, { useState } from "react";
import axios from "axios";
import { Imagen3DResult } from "../Prediction/Imagen3DResult";
import { Sparkle } from "@phosphor-icons/react";
import { FileInput, Button } from "flowbite-react";

export const Imagen3D = ({
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

  const handleFileChange = (event) => {
    setImageFile(event.target.files[0]);
  };

  const handlePrediction = async () => {
    if (!imageFile) {
      setError("No se ha seleccionado ninguna imagen");
      return;
    }

    if (!generationName) {
      setError("Por favor, ingrese un nombre para la generación");
      return;
    }

    setLoading(true);
    setError(null);

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

      setPredictionResult(response.data);
    } catch (error) {
      if (error.response) {
        setError(
          error.response.data.error ||
            "Error desconocido al realizar la predicción"
        );
      } else if (error.request) {
        setError(
          "No se pudo contactar al servidor. Por favor, inténtelo más tarde."
        );
      } else {
        setError(
          "Error al configurar la solicitud. Por favor, inténtelo más tarde."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" ml-[250px] w-full border-l-2  border-linea bg-fondologin h-[569px] ">
      <div className="mt-6">
        <div className="border-solid border-b-2 border-linea pb-4">
          <p className="text-center text-2xl">Imagen a 3D</p>
        </div>
        <div className="flex flex-wrap gap-4 px-4 mt-2">
          <div className="flex items-center justify-center gap-4 grow">
            <p>Nombre</p>

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
              className="text-lg bg-gradient-to-r flex justify-end from-azul-gradient to-morado-gradient py-1 px-6 rounded-lg border-none"
            >
              {loading ? "Realizando Predicción..." : "Generar"}
            </Button>
          </div>
        </div>

        <Imagen3DResult predictionResult={predictionResult} />
      </div>
    </div>
  );
};
