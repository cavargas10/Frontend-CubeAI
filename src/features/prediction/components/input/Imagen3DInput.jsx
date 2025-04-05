import React, { useState, useEffect } from "react";
import axios from "axios";
import { Sparkle, UploadSimple } from "@phosphor-icons/react";
import { Button } from "flowbite-react";
import { ErrorModal } from "../../../../components/modals/ErrorModal";
import { LoadingModal } from "../../../../components/modals/LoadingModal";
import { Imagen3DResult } from "../results/Imagen3DResult";

export const Imagen3DInput = ({
  user,
  setPrediction_img3d_result,
  setLoading,
  loading,
  BASE_URL,
  prediction_img3d_result,
  activeTab,
  isCollapsed
}) => {
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [generationName, setGenerationName] = useState("");
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loadingModalVisible, setLoadingModalVisible] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    return () => {
      resetState();
    };
  }, [activeTab]);

  const resetState = () => {
    setImageFile(null);
    setImagePreview(null);
    setGenerationName("");
    setErrorModalVisible(false);
    setErrorMessage("");
    setLoadingModalVisible(false);
    setPrediction_img3d_result(null);
    setLoading(false);
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
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
    if (file && file.type.startsWith('image/')) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
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
      }
    } catch (error) {
      const errorMsg = error.response?.data?.error || 
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
    <div className={`w-full sm:ml-[264px] xl:ml-[265px] 2xl:ml-[300px] bg-fondologin
      transition-all duration-300 ease-in-out${
      isCollapsed
        ? "sm:ml-[80px] xl:ml-[80px] 2xl:ml-[80px]"
        : "sm:ml-[264px] md:ml-[267px] xl:ml-[250px] 2xl:ml-[300px]"
      }`}
    >
      <div className="pt-6 bg-principal pb-4 border-b-2 border-linea ">
        <p className="text-center text-2xl">Imagen a 3D</p>
      </div>

      <div className="flex flex-col xl:flex-row w-full min-h-[calc(100vh-200px)] bg-fondologin">
        {/* Formulario (Lado izquierdo) */}
        <div className="w-full xl:w-1/3 p-6 border-r border-linea">
          <div className="flex flex-col gap-6">
            {/* Campo de nombre */}
            <div className="flex flex-col gap-2">
              <label className="text-lg">Nombre de la generación</label>
              <input
                type="text"
                placeholder="Ingrese un nombre"
                value={generationName}
                onChange={(e) => setGenerationName(e.target.value)}
                disabled={loading}
                className="bg-transparent border p-3 rounded-lg w-full"
              />
            </div>

            <div
              className={`relative border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors min-h-[16.5rem] flex flex-col items-center justify-center
                ${isDragging ? 'border-azul-gradient bg-opacity-10' : 'border-linea'}
                ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:border-azul-gradient'}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => !loading && document.getElementById('fileInput').click()}
            >
              <input
                id="fileInput"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={loading}
                className="hidden"
              />
              
              {imagePreview ? (
                <div className="w-full h-full flex flex-col items-center gap-4">
                  <img 
                    src={imagePreview} 
                    alt="Vista previa" 
                    className="max-w-full max-h-48 object-contain rounded-lg"
                  />
                </div>
              ) : (
                <>
                  <UploadSimple className="w-12 h-12 text-gray-400" weight="thin" />
                  <p className="mt-4 text-sm">
                    Arrastra una imagen o haz clic para seleccionar
                  </p>
                  <p className="mt-2 text-xs text-gray-400">
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
              <Sparkle size={24} weight="fill" />
              Generar
            </Button>
          </div>
        </div>

        {/* Resultado (Lado derecho) */}
        <div className="w-full xl:w-2/3">
          <Imagen3DResult prediction_img3d_result={prediction_img3d_result} />
        </div>
      </div>

      <ErrorModal
        showModal={errorModalVisible}
        closeModal={closeErrorModal}
        errorMessage={errorMessage}
      />

      <LoadingModal
        showLoadingModal={loadingModalVisible}
      />
    </div>
  );
};