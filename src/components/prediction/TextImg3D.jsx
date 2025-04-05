import React, { useState, useEffect } from "react";
import axios from "axios";
import { Sparkle } from "@phosphor-icons/react";
import { TextImg3DResult } from "./TextImg3DResult";
import { ErrorModal } from "../modals/ErrorModal";
import { LoadingModal } from "../modals/LoadingModal";
import { Button } from "flowbite-react";

const styles = [
  { name: "Disney", value: "disney"},
  { name: "Pixar", value: "pixar"},
  { name: "Realista", value: "realista"},
  { name: "Anime", value: "anime"},
  { name: "Chibi", value: "chibi"},
];

export const TextImg3D = ({
  user,
  setPrediction_textimg3d_result,
  setLoading,
  loading,
  BASE_URL,
  prediction_textimg3d_result,
  activeTab,
  isCollapsed,
}) => {
  const [generationName, setGenerationName] = useState("");
  const [subject, setSubject] = useState("");
  const [style, setStyle] = useState(null);
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
    setStyle(null);
    setAdditionalDetails("");
    setErrorModalVisible(false);
    setErrorMessage("");
    setLoadingModalVisible(false);
    setPrediction_textimg3d_result(null);
    setLoading(false);
  };

  const handlePrediction = async () => {
    if (!generationName || !subject || !style || !additionalDetails) {
      setErrorMessage("Todos los campos son obligatorios");
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
      setErrorMessage(
        error.response?.data?.error ||
          "Error al generar el modelo. Intente nuevamente."
      );
      setErrorModalVisible(true);
    } finally {
      setLoading(false);
      setLoadingModalVisible(false);
    }
  };

  return (
    <div className={`w-full sm:ml-[264px] xl:ml-[265px] 2xl:ml-[300px] bg-fondologin 
      transition-all duration-300 ease-in-out${
      isCollapsed ? "sm:ml-[80px] xl:ml-[80px] 2xl:ml-[80px]" : ""
    }`}>
      <div className="bg-principal pt-6 pb-4 border-b-2 border-linea">
        <p className="text-center text-2xl">Texto e Imagen a 3D</p>
      </div>

      <div className="flex flex-col xl:flex-row w-full min-h-[calc(100vh-200px)] bg-fondologin">
        {/* Formulario (Izquierda) */}
        <div className="w-full xl:w-1/3 p-6 border-r border-linea">
          <div className="flex flex-col gap-4">
            {/* Nombre */}
            <div className="flex flex-col gap-3">
              <label className="text-base">Nombre de la generación</label>
              <input
                type="text"
                placeholder="Ingrese un nombre"
                value={generationName}
                onChange={(e) => setGenerationName(e.target.value)}
                disabled={loading}
                className="bg-transparent border p-2 rounded-md w-full text-sm"
              />
            </div>

            {/* Prompt */}
            <div className="flex flex-col gap-3">
              <label className="text-base">Prompt</label>
              <input
                type="text"
                placeholder="Ingrese descripción"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                disabled={loading}
                className="bg-transparent border p-2 rounded-md w-full text-sm"
              />
            </div>

            {/* Detalles adicionales */}
            <div className="flex flex-col gap-3">
              <label className="text-base">Detalles adicionales</label>
              <input
                type="text"
                placeholder="Ingrese detalles adicionales"
                value={additionalDetails}
                onChange={(e) => setAdditionalDetails(e.target.value)}
                disabled={loading}
                className="bg-transparent border p-2 rounded-md w-full text-sm"
              />
            </div>

            {/* Estilos (Botones visuales en lugar de combo box) */}
            <div className="flex flex-col gap-2">
              <label className="text-base">Estilo</label>
              <div className="grid grid-cols-3 gap-2">
                {styles.map((s) => (
                  <button
                    key={s.value}
                    onClick={() => setStyle(s.value)}
                    disabled={loading}
                    className={`relative border rounded-md p-2 flex flex-col items-center justify-center transition-all text-sm
                      ${
                        style === s.value
                          ? "border-azul-gradient shadow-md scale-105"
                          : "border-gray-500 hover:border-azul-gradient"
                      }`}
                  >
                    <span className="">{s.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Botón de generación */}
            <Button
              onClick={handlePrediction}
              disabled={loading}
              className="w-full text-base bg-gradient-to-r hover:bg-gradient-to-tr from-azul-gradient to-morado-gradient py-2 rounded-lg border-none flex items-center justify-center gap-1"
            >
              <Sparkle size={20} weight="fill" />
              Generar
            </Button>
          </div>
        </div>

        {/* Resultado (Derecha) */}
        <div className="w-full xl:w-2/3">
          <TextImg3DResult prediction_textimg3d_result={prediction_textimg3d_result} />
        </div>
      </div>

      <ErrorModal
        showModal={errorModalVisible}
        closeModal={() => setErrorModalVisible(false)}
        errorMessage={errorMessage}
      />

      <LoadingModal
        showLoadingModal={loadingModalVisible}
        message="Generando el modelo 3D..."
      />
    </div>
  );
};