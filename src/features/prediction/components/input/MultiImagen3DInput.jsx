import { useState, useEffect, useCallback } from "react";
import { Sparkle, UploadSimple, TextAa, CheckCircle } from "@phosphor-icons/react";
import { ErrorModal } from "../../../../components/modals/ErrorModal";
import { LoadingModal } from "../../../../components/modals/LoadingModal";
import { MultiImagen3DResult } from "../results/MultiImagen3DResult";
import { usePredictionHandler } from "../../hooks/usePredictionHandler";
import { useMultiImageUpload } from "../../hooks/useMultiImageUpload";
import { useAuth } from "../../../auth/hooks/useAuth";
import { usePredictions } from "../../context/PredictionContext";
import { uploadPredictionPreview } from "../../services/predictionApi";

function dataURLtoBlob(dataurl) {
    const arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {type:mime});
}

export const MultiImagen3DInput = ({ isCollapsed }) => {
  const { user } = useAuth();
  const { dispatch, clearResult, prediction_multiimg3d_result } = usePredictions();
  const [generationName, setGenerationName] = useState("");

  const {
    imageFiles,
    imagePreviews,
    currentImageType,
    isDragging,
    handleFileChange,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    selectImageType,
    resetMultiImageState,
  } = useMultiImageUpload();

  const {
    isLoading: predictionLoading,
    error: predictionError,
    loadingSteps,
    submitPrediction,
    clearError: clearPredictionError,
    setError: setPredictionError,
  } = usePredictionHandler(user);

  const resetComponentState = useCallback(() => {
    setGenerationName("");
    resetMultiImageState();
    clearPredictionError();
    clearResult('multiimg3d');
  }, [
    resetMultiImageState,
    clearPredictionError,
    clearResult,
  ]);

  useEffect(() => {
    return () => {
      resetComponentState();
    };
  }, [resetComponentState]);

  const handleLocalPrediction = async () => {
    if (!imageFiles.frontal || !imageFiles.lateral || !imageFiles.trasera) {
      setPredictionError("Por favor, cargue las tres imágenes (frontal, lateral y trasera).");
      return;
    }
    if (!generationName.trim()) {
      setPredictionError("Por favor, ingrese un nombre para la generación.");
      return;
    }

    dispatch({ type: 'SET_PREDICTION', payload: { type: 'multiimg3d', result: null } });

    const formData = new FormData();
    formData.append("frontal", imageFiles.frontal);
    formData.append("lateral", imageFiles.lateral);
    formData.append("trasera", imageFiles.trasera);
    formData.append("generationName", generationName);

    const result = await submitPrediction("multiimagen3D", formData);
    if (result) {
      dispatch({ type: 'SET_PREDICTION', payload: { type: 'multiimg3d', result } });
    }
  };
  
  const handlePreviewUpload = useCallback(async (dataURL) => {
    if (!user || !prediction_multiimg3d_result || !prediction_multiimg3d_result.generation_name) return;
    if (prediction_multiimg3d_result.previewImageUrl) return;

    try {
        const token = await user.getIdToken();
        const previewBlob = dataURLtoBlob(dataURL);
        
        const formData = new FormData();
        formData.append('preview', previewBlob, 'preview.png');
        formData.append('generation_name', prediction_multiimg3d_result.generation_name);
        formData.append('prediction_type_api', 'MultiImagen3D'); // <-- TIPO CORRECTO

        await uploadPredictionPreview(token, formData);
        console.log("Previsualización subida con éxito para 'Multi Imagen a 3D'.");
        
    } catch (error) {
        console.error("Error al subir la previsualización:", error);
    }
  }, [user, prediction_multiimg3d_result]);

  const isButtonDisabled =
    predictionLoading ||
    !generationName.trim() ||
    !imageFiles.frontal ||
    !imageFiles.lateral ||
    !imageFiles.trasera;

  return (
    <section
      className={`w-full bg-fondologin text-white transition-all duration-300 ease-in-out relative flex flex-col min-h-[calc(100vh-4rem)] ${
        isCollapsed ? "sm:pl-[80px]" : "md:pl-[267px] 2xl:pl-[300px]"
      }`}
    >
      <div className="relative z-10 px-4 sm:px-6 md:px-8 pt-6 pb-8 flex flex-col flex-grow">
        <div className="mb-6 flex-shrink-0">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-azul-gradient to-morado-gradient">
                Multi Imagen a 3D
              </h1>
              <div className="h-1 w-24 bg-gradient-to-r from-azul-gradient to-morado-gradient rounded-full mt-1.5"></div>
            </div>
          </div>
        </div>

        <hr className="border-t-2 border-linea/20 mb-6 flex-shrink-0" />

        <div className="flex-grow flex flex-col xl:grid xl:grid-cols-5 xl:gap-4">
          <div className="xl:col-span-2 mb-6 xl:mb-0">
            <div className="bg-principal/30 backdrop-blur-sm border border-linea/20 rounded-2xl p-4 h-full flex flex-col space-y-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <TextAa size={18} className="text-azul-gradient" />
                  <h3 className="text-sm font-semibold text-white">
                    Nombre de la Generación
                  </h3>
                </div>
                <input
                  type="text"
                  placeholder="Ej: Mi personaje completo"
                  value={generationName}
                  onChange={(e) => setGenerationName(e.target.value)}
                  disabled={predictionLoading}
                  className={`w-full p-2.5 rounded-lg bg-principal/50 border-2 ${
                    generationName.trim()
                      ? "border-azul-gradient"
                      : "border-linea/30"
                  } text-white placeholder-gray-400 focus:ring-2 focus:ring-azul-gradient/50 focus:border-azul-gradient transition-all duration-300`}
                />
              </div>

              <div className="flex-grow flex flex-col min-h-0">
                <div className="flex items-center gap-3 mb-2">
                  <UploadSimple size={18} className="text-azul-gradient" />
                  <h3 className="text-sm font-semibold text-white">
                    Sube tus Vistas
                  </h3>
                </div>

                <div className="flex gap-2 mb-2">
                  {["frontal", "lateral", "trasera"].map((type) => (
                    <button
                      key={type}
                      onClick={() => !predictionLoading && selectImageType(type)}
                      disabled={predictionLoading}
                      className={`flex-1 border-2 rounded-lg py-1.5 px-2 flex items-center justify-center transition-all text-xs h-10 gap-1.5 ${
                        currentImageType === type
                          ? "border-azul-gradient bg-azul-gradient/20 shadow-md font-semibold"
                          : "border-linea/30 hover:border-azul-gradient/50 bg-principal/50 text-gray-300 hover:text-white"
                      }`}
                    >
                      <span className="capitalize">{type}</span>
                      {imageFiles[type] && (
                        <CheckCircle
                          size={14}
                          weight="fill"
                          className="text-green-400"
                        />
                      )}
                    </button>
                  ))}
                </div>

                <div
                  className={`relative border-2 border-dashed rounded-lg p-2 text-center cursor-pointer transition-colors flex flex-col items-center justify-center flex-grow ${
                    isDragging
                      ? "border-azul-gradient bg-azul-gradient/10"
                      : imagePreviews[currentImageType]
                      ? "border-azul-gradient bg-azul-gradient/10"
                      : "border-linea/30"
                  } ${
                    predictionLoading
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:border-azul-gradient/50"
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() =>
                    !predictionLoading &&
                    document.getElementById("fileInput-multiimagen3d").click()
                  }
                >
                  <input
                    id="fileInput-multiimagen3d"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    disabled={predictionLoading}
                    className="hidden"
                  />
                  {imagePreviews[currentImageType] ? (
                    <div className="w-full h-full relative min-h-[200px] sm:min-h-[220px] xl:min-h-0 p-1">
                      <img
                        src={imagePreviews[currentImageType]}
                        alt={`Vista previa (${currentImageType})`}
                        className="absolute inset-0 w-full h-full object-contain rounded-lg"
                      />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center p-4 min-h-[200px] sm:min-h-[220px] xl:min-h-0">
                      <UploadSimple
                        className="w-10 h-10 text-gray-400 mb-3"
                        weight="light"
                      />
                      <p className="text-sm text-gray-300 capitalize">
                        Arrastra o haz clic para subir la vista{" "}
                        <strong>{currentImageType}</strong>
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        PNG, JPG, JPEG (MAX. 10MB)
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-auto flex-shrink-0">
                <button
                  onClick={handleLocalPrediction}
                  disabled={isButtonDisabled}
                  className="w-full text-base font-semibold bg-gradient-to-r from-azul-gradient to-morado-gradient py-3 rounded-lg border-none flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-lg hover:shadow-morado-gradient/20 hover:scale-105 disabled:opacity-60 disabled:hover:scale-100 disabled:cursor-not-allowed"
                >
                  <Sparkle size={22} weight="fill" />
                  Generar Modelo 3D
                </button>
              </div>
            </div>
          </div>
          <div className="xl:col-span-3 flex-grow">
            <div className="h-full min-h-[400px] sm:min-h-[500px] md:min-h-[600px] xl:min-h-0">
              <MultiImagen3DResult onFirstLoad={handlePreviewUpload} />
            </div>
          </div>
        </div>
      </div>

      <ErrorModal
        showModal={!!predictionError}
        closeModal={clearPredictionError}
        errorMessage={predictionError || ""}
      />
      <LoadingModal
        showLoadingModal={predictionLoading}
        steps={loadingSteps}
      />
    </section>
  );
};