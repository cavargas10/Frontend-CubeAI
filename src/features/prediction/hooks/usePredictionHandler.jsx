import { useState, useCallback } from "react";
import { startGenerationJob } from "../services/predictionApi"; 
import { useTranslation } from "react-i18next";

export const usePredictionHandler = (user) => {
  const { t } = useTranslation();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const submitPrediction = useCallback(
    async (endpoint, payload) => {
      setIsLoading(true);
      setError(null);

      if (!user) {
        setError("Usuario no autenticado. Inicia sesión para continuar.");
        setIsLoading(false);
        return null;
      }
      
      try {
        const token = await user.getIdToken(true);
        const responseData = await startGenerationJob(token, endpoint, payload);
        
        return responseData;

      } catch (err) {
        setError(err.message || "Ha ocurrido un error inesperado al iniciar la generación.");
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [user] 
  );

  const clearError = useCallback(() => setError(null), []);

  return {
    isLoading, 
    error,
    submitPrediction,
    clearError,
    setError,
  };
};