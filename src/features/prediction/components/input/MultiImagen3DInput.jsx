import React, { useState, useEffect } from "react";
import axios from "axios";
import { Sparkle, UploadSimple } from "@phosphor-icons/react";
import { Button } from "flowbite-react";
import { ErrorModal } from "../../../../components/modals/ErrorModal";
import { LoadingModal } from "../../../../components/modals/LoadingModal";
import { MultiImagen3DResult } from "../results/MultiImagen3DResult";

export const MultiImagen3DInput = ({
  user,
  setPrediction_multiimg3d_result,
  setLoading,
  loading,
  BASE_URL,
  prediction_multiimg3d_result,
  activeTab,
  isCollapsed,
}) => {
  const [imageFiles, setImageFiles] = useState({
    frontal: null,
    lateral: null,
    trasera: null,
  });
  const [imagePreviews, setImagePreviews] = useState({
    frontal: null,
    lateral: null,
    trasera: null,
  });
  const [currentImageType, setCurrentImageType] = useState("frontal");
  const [generationName, setGenerationName] = useState("");
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loadingModalVisible, setLoadingModalVisible] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const resetState = () => {
    setImageFiles({ frontal: null, lateral: null, trasera: null });
    setImagePreviews({ frontal: null, lateral: null, trasera: null });
    setCurrentImageType("frontal");
    setGenerationName("");
    setErrorModalVisible(false);
    setErrorMessage("");
    setLoadingModalVisible(false);
    setPrediction_multiimg3d_result(null);
    setLoading(false);
  };

  useEffect(() => {
    return () => {
      resetState();
    };
  }, [activeTab]);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFiles((prev) => ({ ...prev, [currentImageType]: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prev) => ({
          ...prev,
          [currentImageType]: reader.result,
        }));
      };
      reader.readAsDataURL(file);
      setCurrentImageType(
        currentImageType === "frontal"
          ? "lateral"
          : currentImageType === "lateral"
            ? "trasera"
            : "frontal"
      );
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setImageFiles((prev) => ({ ...prev, [currentImageType]: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prev) => ({
          ...prev,
          [currentImageType]: reader.result,
        }));
      };
      reader.readAsDataURL(file);
      setCurrentImageType(
        currentImageType === "frontal"
          ? "lateral"
          : currentImageType === "lateral"
            ? "trasera"
            : "frontal"
      );
    }
  };

  const handlePrediction = async () => {
    if (!imageFiles.frontal || !imageFiles.lateral || !imageFiles.trasera) {
      setErrorMessage(
        "Por favor, cargue las tres imágenes (frontal, lateral y trasera)."
      );
      setErrorModalVisible(true);
      return;
    }
    if (!generationName) {
      setErrorMessage("Por favor, ingrese un nombre para la generación.");
      setErrorModalVisible(true);
      return;
    }

    setLoadingModalVisible(true);
    setLoading(true);

    try {
      const token = await user.getIdToken();
      const formData = new FormData();
      formData.append("frontal", imageFiles.frontal);
      formData.append("lateral", imageFiles.lateral);
      formData.append("trasera", imageFiles.trasera);
      formData.append("generationName", generationName);

      const response = await axios.post(`${BASE_URL}/multiimagen3D`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      if (typeof setPrediction_multiimg3d_result === "function") {
        setPrediction_multiimg3d_result(response.data);
      }
    } catch (error) {
      const errorMsg =
        error.response?.data?.error ||
        "Error al realizar la predicción. Por favor, intente nuevamente.";
      setErrorMessage(errorMsg);
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
    <div
      className={`w-full sm:ml-[264px] xl:ml-[265px] 2xl:ml-[300px] bg-fondologin transition-all duration-300 ease-in-out ${
        isCollapsed
          ? "sm:ml-[80px] xl:ml-[80px] 2xl:ml-[80px]"
          : "sm:ml-[264px] md:ml-[267px] xl:ml-[250px] 2xl:ml-[300px]"
      }`}
    >
      <div className="bg-principal pt-6 pb-4 border-b-2 border-linea">
        <p className="text-center text-2xl">Imagen a 3D (Múltiples vistas)</p>
      </div>
      <div className="flex flex-col xl:flex-row w-full min-h-[calc(100vh-200px)] bg-fondologin">
        {/* Formulario (Lado izquierdo) */}
        <div className="w-full xl:w-1/3 p-6 border-r border-linea">
          <div className="flex flex-col gap-4">
            {/* Campo de nombre */}
            <div className="flex flex-col gap-2">
              <label className="text-base font-medium">
                Nombre de la generación
              </label>
              <input
                type="text"
                placeholder="Ingrese un nombre"
                value={generationName}
                onChange={(e) => setGenerationName(e.target.value)}
                disabled={loading}
                className="bg-transparent border p-2 rounded-md w-full text-base"
              />
            </div>

            {/* Indicador de progreso */}
            <div className="flex justify-between text-base text-gray-500">
              <span
                className={`cursor-pointer ${
                  currentImageType === "frontal" ? "text-blue-500" : ""
                }`}
                onClick={() => setCurrentImageType("frontal")}
              >
                Frontal
              </span>
              <span
                className={`cursor-pointer ${
                  currentImageType === "lateral" ? "text-blue-500" : ""
                }`}
                onClick={() => setCurrentImageType("lateral")}
              >
                Lateral
              </span>
              <span
                className={`cursor-pointer ${
                  currentImageType === "trasera" ? "text-blue-500" : ""
                }`}
                onClick={() => setCurrentImageType("trasera")}
              >
                Trasera
              </span>
            </div>

            {/* Área de carga de imágenes */}
            <div
              className={`relative border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors min-h-[16rem] flex flex-col items-center justify-center ${
                isDragging ? "border-blue-500 bg-opacity-10" : "border-gray-300"
              } ${loading ? "opacity-50 cursor-not-allowed" : "hover:border-blue-500"}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() =>
                !loading && document.getElementById("fileInput").click()
              }
            >
              <input
                id="fileInput"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={loading}
                className="hidden"
              />

              {imagePreviews[currentImageType] ? (
                <div className="w-full h-full flex flex-col items-center gap-2">
                  <img
                    src={imagePreviews[currentImageType]}
                    alt={`Vista previa (${currentImageType})`}
                    className="max-w-full max-h-32 object-contain rounded-md"
                  />
                </div>
              ) : (
                <>
                  <UploadSimple
                    className="w-8 h-8 text-gray-400"
                    weight="thin"
                  />
                  <p className="mt-2 text-base">
                    Arrastra o haz clic para seleccionar la imagen{" "}
                    <strong>{currentImageType}</strong>
                  </p>
                  <p className="mt-1 text-base text-gray-400">
                    PNG, JPG, JPEG (MAX. 10MB)
                  </p>
                </>
              )}
            </div>

            {/* Botón de generar */}
            <Button
              onClick={handlePrediction}
              disabled={loading}
              className="w-full text-base bg-gradient-to-r hover:bg-gradient-to-tr from-azul-gradient to-morado-gradient py-2 rounded-md border-none flex items-center justify-center gap-2"
            >
              <Sparkle size={16} weight="fill" />
              Generar
            </Button>
          </div>
        </div>

        {/* Resultado (Lado derecho) */}
        <div className="w-full xl:w-2/3">
          <MultiImagen3DResult prediction_multiimg3d_result={prediction_multiimg3d_result} />
        </div>
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