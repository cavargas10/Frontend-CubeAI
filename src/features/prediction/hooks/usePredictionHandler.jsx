import { useState, useCallback, useRef, useMemo } from "react";
import { startGenerationJob, getJobStatus } from "../services/predictionApi";
import { useTranslation } from "react-i18next";

export const usePredictionHandler = (user) => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [jobStatus, setJobStatus] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const pollingIntervalRef = useRef(null);

  const stopPolling = useCallback(() => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
  }, []);

  const reset = useCallback(() => {
    stopPolling();
    setIsLoading(false);
    setJobStatus(null);
    setResult(null);
    setError(null);
  }, [stopPolling]);

  const clearError = useCallback(() => {
    setError(null);
    if (jobStatus?.status === 'failed') {
      setJobStatus(null);
    }
  }, [jobStatus]);

  const submitPrediction = useCallback(
    async (endpoint, payload) => {
      reset();
      setIsLoading(true);

      if (!user) {
        setError("Usuario no autenticado. Inicia sesión para continuar.");
        setIsLoading(false);
        return;
      }

      try {
        const token = await user.getIdToken(true);
        const initialStatus = await startGenerationJob(
          token,
          endpoint,
          payload
        );

        setIsLoading(false);
        setJobStatus({ ...initialStatus, job_type: endpoint });

        if (
          initialStatus.status === "completed" ||
          initialStatus.status === "failed"
        ) {
          if (initialStatus.status === "completed")
            setResult(initialStatus.result);
          if (initialStatus.status === "failed") setError(initialStatus.error);
          return;
        }

        const jobId = initialStatus.job_id;
        pollingIntervalRef.current = setInterval(async () => {
          try {
            const currentToken = await user.getIdToken();
            const statusUpdate = await getJobStatus(currentToken, jobId);

            setJobStatus({ ...statusUpdate, job_type: endpoint });

            if (statusUpdate.status === "completed") {
              setResult(statusUpdate.result);
              stopPolling();
            } else if (statusUpdate.status === "failed") {
              setError(
                statusUpdate.error || t("errors.generic_generation_failed")
              );
              stopPolling();
            }
          } catch (pollingErr) {
            setError(pollingErr.message || t("errors.generic_polling_failed"));
            stopPolling();
          }
        }, 5000);
      } catch (err) {
        setError(
          err.message ||
            "Ha ocurrido un error inesperado al iniciar la generación."
        );
        setIsLoading(false);
      }
    },
    [user, reset, stopPolling, t]
  );
  const isJobActive = useMemo(() => {
    return isLoading || jobStatus?.status === 'queued' || jobStatus?.status === 'processing';
  }, [isLoading, jobStatus]);


  return {
    submitPrediction,
    isLoading,
    jobStatus,
    result,
    error,
    reset,
    clearError,
    isJobActive,
  };
};