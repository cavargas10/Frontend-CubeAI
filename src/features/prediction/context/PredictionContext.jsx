// src/features/prediction/context/PredictionContext.jsx
import React, { createContext, useState, useContext, useMemo, useCallback } from 'react';

const PredictionContext = createContext(undefined);

export const PredictionProvider = ({ children }) => {
  // Estados para cada tipo de predicción
  const [prediction_img3d_result, setPrediction_img3d_result_state] = useState(null);
  const [prediction_text3d_result, setPrediction_text3d_result_state] = useState(null);
  const [prediction_textimg3d_result, setPrediction_textimg3d_result_state] = useState(null);
  const [prediction_unico3d_result, setPrediction_unico3d_result_state] = useState(null);
  const [prediction_multiimg3d_result, setPrediction_multiimg3d_result_state] = useState(null);
  const [prediction_boceto3d_result, setPrediction_boceto3d_result_state] = useState(null);

  // *** ELIMINADOS: isPredictionLoading, setIsPredictionLoading, predictionError, setPredictionError ***

  // --- Setters (envueltos en useCallback) ---
  const setPrediction_img3d_result = useCallback((result) => setPrediction_img3d_result_state(result), []);
  const setPrediction_text3d_result = useCallback((result) => setPrediction_text3d_result_state(result), []);
  const setPrediction_textimg3d_result = useCallback((result) => setPrediction_textimg3d_result_state(result), []);
  const setPrediction_unico3d_result = useCallback((result) => setPrediction_unico3d_result_state(result), []);
  const setPrediction_multiimg3d_result = useCallback((result) => setPrediction_multiimg3d_result_state(result), []);
  const setPrediction_boceto3d_result = useCallback((result) => setPrediction_boceto3d_result_state(result), []);

  // --- Función para limpiar resultados (la mantenemos) ---
  const clearResult = useCallback((type) => {
    switch (type) {
      case 'img3d': setPrediction_img3d_result_state(null); break;
      case 'text3d': setPrediction_text3d_result_state(null); break;
      case 'textimg3d': setPrediction_textimg3d_result_state(null); break;
      case 'unico3d': setPrediction_unico3d_result_state(null); break;
      case 'multiimg3d': setPrediction_multiimg3d_result_state(null); break;
      case 'boceto3d': setPrediction_boceto3d_result_state(null); break;
      default:
        setPrediction_img3d_result_state(null);
        setPrediction_text3d_result_state(null);
        setPrediction_textimg3d_result_state(null);
        setPrediction_unico3d_result_state(null);
        setPrediction_multiimg3d_result_state(null);
        setPrediction_boceto3d_result_state(null);
        break;
    }
     // Ya no limpiamos error/loading global aquí
  }, []);

  // --- Valor del Contexto Memoizado ---
  const value = useMemo(() => ({
    // Resultados
    prediction_img3d_result,
    prediction_text3d_result,
    prediction_textimg3d_result,
    prediction_unico3d_result,
    prediction_multiimg3d_result,
    prediction_boceto3d_result,
    // Setters
    setPrediction_img3d_result,
    setPrediction_text3d_result,
    setPrediction_textimg3d_result,
    setPrediction_unico3d_result,
    setPrediction_multiimg3d_result,
    setPrediction_boceto3d_result,
    // Función de limpieza
    clearResult,
     // *** YA NO INCLUYE: isPredictionLoading, setIsPredictionLoading, predictionError, setPredictionError ***
  }), [
    // Dependencias (sin loading/error global)
    prediction_img3d_result, prediction_text3d_result, prediction_textimg3d_result,
    prediction_unico3d_result, prediction_multiimg3d_result, prediction_boceto3d_result,
    setPrediction_img3d_result, setPrediction_text3d_result, setPrediction_textimg3d_result,
    setPrediction_unico3d_result, setPrediction_multiimg3d_result, setPrediction_boceto3d_result,
    clearResult,
  ]);

  return (
    <PredictionContext.Provider value={value}>
      {children}
    </PredictionContext.Provider>
  );
};

// Hook para consumir (sin cambios)
export const usePredictions = () => {
  const context = useContext(PredictionContext);
  if (context === undefined) {
    throw new Error('usePredictions must be used within a PredictionProvider');
  }
  return context;
};