import { useState, useCallback } from "react";
import {
  generateBoceto3D,
  generateImagen3D,
  generateTexto3D,
  generateTextImg3D,
  generateUnico3D,
  generateMultiImagen3D,
} from "../services/predictionApi";

export const usePredictionHandler = (user) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const submitPrediction = useCallback(
    async (endpoint, payload) => {
      setIsLoading(true);
      setError(null);

      if (!user) {
        const errorMsg =
          "Usuario no autenticado. No se puede realizar la predicción.";
        console.error(errorMsg);
        setError(errorMsg);
        setIsLoading(false);
        return null;
      }

      let predictionFunction;
      switch (endpoint) {
        case "boceto3D":
          predictionFunction = generateBoceto3D;
          break;
        case "imagen3D":
          predictionFunction = generateImagen3D;
          break;
        case "texto3D":
          predictionFunction = generateTexto3D;
          break;
        case "textimg3D":
          predictionFunction = generateTextImg3D;
          break;
        case "unico3D":
          predictionFunction = generateUnico3D;
          break;
        case "multiimagen3D":
          predictionFunction = generateMultiImagen3D;
          break;
        default:
          const unknownEndpointError = `Endpoint de predicción desconocido: ${endpoint}`;
          console.error(unknownEndpointError);
          setError(unknownEndpointError);
          setIsLoading(false);
          return null;
      }

      try {
        const token = await user.getIdToken(true);
        console.log(`Calling prediction service: ${endpoint}`);
        const responseData = await predictionFunction(token, payload);
        console.log(
          `Prediction service successful (${endpoint}):`,
          responseData
        );
        setIsLoading(false);
        return responseData;
      } catch (err) {
        console.error(`Prediction service failed (${endpoint}):`, err);
        setError(err.message);
        setIsLoading(false);
        return null;
      }
    },
    [user]
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    isLoading,
    error,
    submitPrediction,
    clearError,
    setError,
  };
};
