import { useState, useCallback } from "react";
import axios from "axios";

export const usePredictionHandler = (user, BASE_URL) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const submitPrediction = useCallback(
    async (endpoint, payload, config = {}) => {
      setIsLoading(true);
      setError(null);
      setResult(null);

      if (!user) {
        setError("Usuario no autenticado.");
        setIsLoading(false);
        return null;
      }

      try {
        const token = await user.getIdToken();
        const headers = {
          Authorization: `Bearer ${token}`,
          ...(config.headers || {}),
        };

        const response = await axios.post(`${BASE_URL}/${endpoint}`, payload, {
          headers,
        });
        setResult(response.data);
        setIsLoading(false);
        return response.data;
      } catch (err) {
        const errorMsg =
          err.response?.data?.error ||
          `Error en la predicción (${endpoint}). Intente nuevamente.`;
        setError(errorMsg);
        setIsLoading(false);
        return null;
      }
    },
    [user, BASE_URL]
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const clearResult = useCallback(() => {
    setResult(null);
  }, []);

  return {
    isLoading,
    error,
    result,
    submitPrediction,
    clearError,
    clearResult,
    setError,
    setIsLoading,
  };
};
