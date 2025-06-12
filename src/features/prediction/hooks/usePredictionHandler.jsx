import { useState, useCallback } from "react";
import {
  generateBoceto3D,
  generateImagen3D,
  generateTexto3D,
  generateTextImg3D,
  generateUnico3D,
  generateMultiImagen3D,
} from "../services/predictionApi";
import { useTranslation } from "react-i18next";

export const usePredictionHandler = (user) => {
  const { t } = useTranslation();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loadingSteps, setLoadingSteps] = useState([]);

  const submitPrediction = useCallback(
    async (endpoint, payload) => {
      const translatedSteps = t(`loading_steps.${endpoint}`, { returnObjects: true }) || t('loading_steps.default', { returnObjects: true });
      setLoadingSteps(translatedSteps);

      setIsLoading(true);
      setError(null);

      if (!user) {
        setError("Usuario no autenticado. Inicia sesión para continuar.");
        setIsLoading(false);
        return null;
      }

      let predictionFunction;
      switch (endpoint) {
        case "boceto3D": predictionFunction = generateBoceto3D; break;
        case "imagen3D": predictionFunction = generateImagen3D; break;
        case "texto3D": predictionFunction = generateTexto3D; break;
        case "textimg3D": predictionFunction = generateTextImg3D; break;
        case "unico3D": predictionFunction = generateUnico3D; break;
        case "multiimagen3D": predictionFunction = generateMultiImagen3D; break;
        default:
          const unknownEndpointError = `Endpoint de predicción desconocido: ${endpoint}`;
          console.error(unknownEndpointError);
          setError(unknownEndpointError);
          setIsLoading(false);
          return null;
      }
      
      try {
        const token = await user.getIdToken(true);
        const responseData = await predictionFunction(token, payload);
        return responseData;
      } catch (err) {
        setError(err.message || "Ha ocurrido un error inesperado.");
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [user, t] 
  );

  const clearError = useCallback(() => setError(null), []);

  return {
    isLoading,
    error,
    loadingSteps, 
    submitPrediction,
    clearError,
    setError,
  };
};