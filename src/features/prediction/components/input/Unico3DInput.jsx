import { useState, useEffect, useCallback, useRef } from "react";
import { Sparkle, UploadSimple, TextAa } from "@phosphor-icons/react";
import { ErrorModal } from "../../../../components/modals/ErrorModal";
import { ProgressModal } from "../../../../components/modals/ProgressModal";
import { Unico3DResult } from "../results/Unico3DResult";
import { usePredictionHandler } from "../../hooks/usePredictionHandler";
import { useImageUpload } from "../../hooks/useImageUpload";
import { useAuth } from "../../../auth/hooks/useAuth";
import { usePredictions } from "../../context/PredictionContext";
import { uploadPredictionPreview, getJobStatus } from "../../services/predictionApi";
import { useTranslation } from "react-i18next";

function dataURLtoBlob(dataurl) {
  const arr = dataurl.split(","),
    mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}

export const Unico3DInput = ({ isCollapsed }) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { dispatch, clearResult, prediction_unico3d_result } = usePredictions();

  const [generationName, setGenerationName] = useState("");
  const {
    imageFile,
    imagePreview,
    isDragging,
    handleFileChange,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    resetImageState,
  } = useImageUpload();

  const {
    isLoading: isSubmitting,
    error: submissionError,
    submitPrediction,
    clearError: clearSubmissionError,
  } = usePredictionHandler(user);

  const [activeJobId, setActiveJobId] = useState(null);
  const [jobStatus, setJobStatus] = useState(null);
  const [pollingError, setPollingError] = useState(null);
  const pollingIntervalRef = useRef(null);

  const resetComponentState = useCallback(() => {
    setGenerationName("");
    resetImageState();
    clearSubmissionError();
    setPollingError(null);
    clearResult("unico3d");
  }, [resetImageState, clearSubmissionError, clearResult]);

  useEffect(() => {
    return () => {
      resetComponentState();
    };
  }, [resetComponentState]);

  const stopPolling = () => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
  };

  const handleJobCompletion = (result) => {
    stopPolling();
    dispatch({
      type: "SET_PREDICTION",
      payload: { type: "unico3d", result },
    });
    setTimeout(() => {
        setActiveJobId(null);
        setJobStatus(null);
    }, 2000);
  };
  
  const handleJobFailure = (errorMsg) => {
      stopPolling();
      setPollingError(errorMsg || "La generación ha fallado.");
  };

  const pollJobStatus = useCallback(async (jobId, jobType) => {
    if (!user) return;
    try {
      const token = await user.getIdToken();
      const status = await getJobStatus(token, jobId);
      setJobStatus({ ...status, job_type: jobType });

      if (status.status === 'completed') {
        handleJobCompletion(status.result);
      } else if (status.status === 'failed') {
        handleJobFailure(status.error);
      }
    } catch (err) {
      handleJobFailure(err.message);
    }
  }, [user, dispatch]);

  useEffect(() => {
    if (activeJobId && jobStatus?.job_type) {
      pollingIntervalRef.current = setInterval(() => {
        pollJobStatus(activeJobId, jobStatus.job_type);
      }, 5000);
    }
    return () => stopPolling();
  }, [activeJobId, pollJobStatus, jobStatus?.job_type]);

  const handleLocalPrediction = async () => {
    if (!generationName.trim()) {
      setPollingError("Por favor, ingrese un nombre para la generación");
      return;
    }
    if (!imageFile) {
      setPollingError("No se ha seleccionado ninguna imagen");
      return;
    }
    
    clearResult("unico3d");
    setPollingError(null);
    setJobStatus(null);

    const jobType = "Unico3D";
    const formData = new FormData();
    formData.append("image", imageFile);
    formData.append("generationName", generationName);

    const response = await submitPrediction(jobType, formData);

    if (response && response.job_id) {
        setActiveJobId(response.job_id);
        setJobStatus({
            ...response,
            job_type: jobType,
        });
    } else {
        setPollingError(submissionError || "No se pudo iniciar la generación.");
    }
  };

  const handlePreviewUpload = useCallback(
    async (dataURL) => {
      if (
        !user ||
        !prediction_unico3d_result ||
        !prediction_unico3d_result.generation_name
      )
        return;
      if (prediction_unico3d_result.previewImageUrl) return;

      try {
        const token = await user.getIdToken();
        const previewBlob = dataURLtoBlob(dataURL);
        const formData = new FormData();
        formData.append("preview", previewBlob, "preview.png");
        formData.append(
          "generation_name",
          prediction_unico3d_result.generation_name
        );
        formData.append("prediction_type_api", "Unico3D");

        await uploadPredictionPreview(token, formData);
        console.log("Previsualización subida con éxito para 'Único a 3D'.");
      } catch (error) {
        console.error("Error al subir la previsualización:", error);
      }
    },
    [user, prediction_unico3d_result]
  );

  const isFormDisabled = isSubmitting || !!activeJobId;
  const isButtonDisabled = isFormDisabled || !generationName.trim() || !imageFile;

  const closeModalAndReset = () => {
      stopPolling();
      setActiveJobId(null);
      setJobStatus(null);
      setPollingError(null);
  };
  
  const showProgress = !!activeJobId && jobStatus?.status !== 'completed' && jobStatus?.status !== 'failed';
  const showError = !!pollingError || (!!activeJobId && jobStatus?.status === 'failed');

  return (
    <section
      className={`w-full bg-white dark:bg-fondologin text-gray-800 dark:text-white transition-all duration-300 ease-in-out relative flex flex-col min-h-[calc(100vh-4rem)] ${
        isCollapsed ? "sm:pl-[80px]" : "md:pl-[267px] 2xl:pl-[300px]"
      }`}
    >
      <div className="relative z-10 px-4 sm:px-6 md:px-8 pt-6 pb-8 flex flex-col flex-grow">
        <div className="mb-6 flex-shrink-0">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-azul-gradient to-morado-gradient">
                {t("generation_pages.unique_to_3d.title")}
              </h1>
              <div className="h-1 w-24 bg-gradient-to-r from-azul-gradient to-morado-gradient rounded-full mt-1.5"></div>
            </div>
          </div>
        </div>

        <hr className="border-t-2 border-gray-200 dark:border-linea/20 mb-6 flex-shrink-0" />

        <div className="flex-grow flex flex-col xl:grid xl:grid-cols-5 xl:gap-4">
          <div className="xl:col-span-2 mb-6 xl:mb-0">
            <div className="bg-gray-50 dark:bg-principal/30 backdrop-blur-sm border border-gray-200 dark:border-linea/20 rounded-2xl p-4 h-full flex flex-col space-y-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <TextAa size={18} className="text-azul-gradient" />
                  <h3 className="text-sm font-semibold text-gray-800 dark:text-white">
                    {t("generation_pages.common.generation_name_label")}
                  </h3>
                </div>
                <input
                  type="text"
                  placeholder={t(
                    "generation_pages.common.name_placeholder_generic"
                  )}
                  value={generationName}
                  onChange={(e) => setGenerationName(e.target.value)}
                  disabled={isFormDisabled}
                  className={`w-full p-2.5 rounded-lg bg-white dark:bg-principal/50 border-2 text-gray-800 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-azul-gradient/50 focus:border-azul-gradient transition-all duration-300 ${
                    generationName.trim()
                      ? "border-azul-gradient"
                      : "border-gray-300 dark:border-linea/30"
                  }`}
                />
              </div>

              <div className="flex-grow flex flex-col min-h-0">
                <div className="flex items-center gap-3 mb-2">
                  <UploadSimple size={18} className="text-azul-gradient" />
                  <h3 className="text-sm font-semibold text-gray-800 dark:text-white">
                    {t("generation_pages.common.upload_image_label")}
                  </h3>
                </div>
                <div
                  className={`relative border-2 border-dashed rounded-lg p-2 text-center cursor-pointer transition-colors flex flex-col items-center justify-center flex-grow 
                  ${
                    isDragging
                      ? "border-azul-gradient bg-azul-gradient/5"
                      : imagePreview
                        ? "border-azul-gradient bg-azul-gradient/5"
                        : "border-gray-300 dark:border-linea/30"
                  } 
                  ${
                    isFormDisabled
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:border-azul-gradient/50"
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() =>
                    !isFormDisabled &&
                    document.getElementById("fileInput-unico3d").click()
                  }
                >
                  <input
                    id="fileInput-unico3d"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    disabled={isFormDisabled}
                    className="hidden"
                  />
                  {imagePreview ? (
                    <div className="w-full h-full relative min-h-[200px] sm:min-h-[220px] xl:min-h-0">
                      <img
                        src={imagePreview}
                        alt="Vista previa"
                        className="absolute inset-0 w-full h-full object-contain rounded-lg"
                      />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center p-4 min-h-[200px] sm:min-h-[220px] xl:min-h-0">
                      <UploadSimple
                        className="w-10 h-10 text-gray-400 mb-3"
                        weight="light"
                      />
                      <p className="text-sm text-gray-500 dark:text-gray-300">
                        {t("generation_pages.common.drag_and_drop_prompt")}
                      </p>
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
                        {t("generation_pages.common.file_types")}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-auto flex-shrink-0">
                <button
                  onClick={handleLocalPrediction}
                  disabled={isButtonDisabled}
                  className="w-full text-base font-semibold bg-gradient-to-r from-azul-gradient to-morado-gradient py-3 rounded-lg border-none flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-lg hover:shadow-morado-gradient/20 hover:scale-105 disabled:opacity-60 disabled:hover:scale-100 disabled:cursor-not-allowed text-white"
                >
                  <Sparkle size={22} weight="fill" />
                  {t("generation_pages.common.generate_button")}
                </button>
              </div>
            </div>
          </div>
          <div className="xl:col-span-3 flex-grow">
            <div className="h-full min-h-[400px] sm:min-h-[500px] md:min-h-[600px] xl:min-h-0 border-2 border-gray-200 dark:border-linea/20 rounded-3xl overflow-hidden">
              <Unico3DResult onFirstLoad={handlePreviewUpload} />
            </div>
          </div>
        </div>
      </div>

      <ProgressModal 
        show={showProgress} 
        jobStatus={jobStatus}
      />
      <ErrorModal
        showModal={showError}
        closeModal={closeModalAndReset}
        errorMessage={pollingError || jobStatus?.error || "Ha ocurrido un error."}
      />
    </section>
  );
};