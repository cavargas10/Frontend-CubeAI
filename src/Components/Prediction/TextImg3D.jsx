import React, { useState } from "react";
import axios from "axios";
import { Sparkle } from "@phosphor-icons/react";
import { TextImg3DResult } from "./TextImg3DResult";

export const TextImg3D = ({
  user,
  setPredictionResult,
  setLoading,
  setError,
  loading,
  BASE_URL,
  predictionResult,
}) => {
  const [generationName, setGenerationName] = useState("");
  const [subject, setSubject] = useState("");
  const [style, setStyle] = useState("");
  const [additionalDetails, setAdditionalDetails] = useState("");

  const handleStyleChange = (event) => {
    setStyle(event.target.value);
  };

  const handlePrediction = async () => {
    if (!generationName || !subject || !style || !additionalDetails) {
      setError("Todos los campos son obligatorios");
      return;
    }

    setLoading(true);
    setError(null);

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
    <div className="col-span-8 ml-[250px] w-full border-l-2 mt-6 border-linea">
      <div className="">
        <div className="border-solid border-b-2 border-linea pb-4">
          <p className="text-center text-2xl">Texto e Imagen a 3D</p>
        </div>
        <div className="flex gap-4 px-4 mt-2">
          <div className="flex items-center gap-2 grow">
            <p>Nombre</p>
            <input
              type="text"
              placeholder="Ingrese un nombre"
              value={generationName}
              onChange={(e) => setGenerationName(e.target.value)}
              disabled={loading}
              className="bg-transparent border p-2 rounded-md w-full"
            />
          </div>
          <div className="flex items-center gap-2 grow">
            <p>Prompt</p>
            <input
              type="text"
              placeholder="Ingrese Prompt"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              disabled={loading}
              className="bg-transparent border p-2 rounded-md w-full"
            />
          </div>
          <div className="flex items-center gap-2 grow">
            <p>Detalles</p>
            <input
              type="text"
              placeholder="Detalles adicionales"
              value={additionalDetails}
              onChange={(e) => setAdditionalDetails(e.target.value)}
              disabled={loading}
              className="bg-transparent border p-2 rounded-md w-full"
            />
          </div>
          <div className="flex items-center gap-2 grow">
            <p>Estilo</p>
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
          <div className="flex items-center justify-end grow">
            <button
              onClick={handlePrediction}
              disabled={loading}
              className="relative text-lg bg-gradient-to-r from-azul-gradient to-morado-gradient py-2 px-6 rounded-lg border-none flex items-center"
            >
              <Sparkle size={24} color="#fff" className="absolute left-2" />
              <span className="ml-6">
                {loading ? "Generando..." : "Generar"}
              </span>
            </button>
          </div>
        </div>

        <TextImg3DResult predictionResult={predictionResult} />
      </div>
    </div>
  );
};
