import React, { useState } from "react";
import axios from "axios";
import { Sparkle } from "@phosphor-icons/react";
import { Texto3DResult } from "./Texto3DResult";
import { BtnObj } from "../Ui/BtnObj";
export const Texto3D = ({
  user,
  setPredictionResult,
  setLoading,
  setError,
  loading,
  BASE_URL,
  predictionResult,
}) => {
  const [generationName, setGenerationName] = useState("");
  const [userPrompt, setUserPrompt] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("");

  const handleStyleChange = (event) => {
    setSelectedStyle(event.target.value);
  };

  const handlePrediction = async () => {
    if (!generationName || !userPrompt || !selectedStyle) {
      setError("Todos los campos son obligatorios");
      return;
    }

    setLoading(true);
    setError(null);

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
    <div className=" ml-[250px]  w-full  bg-fondologin h-[569px]">
      <div className=" mt-6">
        <div className=" border-r-2">
          <p className="text-center text-2xl">Texto a 3D</p>
        </div>

        <div className="flex mt border ">
          <div className=" w-96 border-r-2 border-linea flex flex-col  gap-10 p-6">
            <div className="flex items-center  justify-center gap-4 grow">
              <p>Nombre</p>
              <input
                type="text"
                placeholder="Nombre de la generación"
                value={generationName}
                onChange={(e) => setGenerationName(e.target.value)}
                disabled={loading}
                className="mt-3 bg-transparent border p-2 rounded-md w-full"
              />
            </div>

            <div className="flex items-center justify-center grow mt-2">
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

            <div className="flex items-center gap-2 grow  ">
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

            <div className="flex items-center justify-end grow ">
              <button
                onClick={handlePrediction}
                disabled={loading}
                className=" w-full relative text-lg bg-gradient-to-r from-azul-gradient to-morado-gradient py-2  rounded-lg border-none flex items-center justify-center
                       
                "
              >
                <Sparkle size={24} color="#fff" className="absolute left-28" />
                <span className="">{loading ? "Generando..." : "Generar"}</span>
              </button>
            </div>

            <BtnObj predictionResult={predictionResult} />
          </div>

          <Texto3DResult predictionResult={predictionResult} />
        </div>
      </div>
    </div>
  );
};
