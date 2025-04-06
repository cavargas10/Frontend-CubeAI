// src/features/prediction/context/PredictionContext.jsx
import React, {
  createContext,
  useState,
  useContext,
  useMemo,
  useCallback,
} from "react"; // Agrega useCallback

// 1. Crear el Contexto
// Este es el objeto que los componentes usarán para acceder a los datos.
const PredictionContext = createContext(undefined); // undefined es un valor inicial seguro

// 2. Crear el Componente Proveedor (Provider)
// Este componente envolverá las partes de tu aplicación que necesitan acceso
// al estado de las predicciones. Es donde vive el estado real.
export const PredictionProvider = ({ children }) => {
  // --- Estados para los resultados de cada tipo de predicción ---
  const [prediction_img3d_result, setPrediction_img3d_result_state] =
    useState(null);
  const [prediction_text3d_result, setPrediction_text3d_result_state] =
    useState(null);
  const [prediction_textimg3d_result, setPrediction_textimg3d_result_state] =
    useState(null);
  const [prediction_unico3d_result, setPrediction_unico3d_result_state] =
    useState(null);
  const [prediction_multiimg3d_result, setPrediction_multiimg3d_result_state] =
    useState(null);
  const [prediction_boceto3d_result, setPrediction_boceto3d_result_state] =
    useState(null);

  // --- Estados globales opcionales para Carga/Error de predicciones ---
  // Puedes decidir si quieres un indicador global o manejarlo por predicción
  const [isPredictionLoading, setIsPredictionLoading] = useState(false);
  const [predictionError, setPredictionError] = useState(null);

  // --- Funciones para actualizar los estados (Setters) ---
  // Usamos useCallback para asegurar que estas funciones no cambien innecesariamente
  // y provoquen re-renders en los consumidores del contexto.

  const setPrediction_img3d_result = useCallback((result) => {
    setPrediction_img3d_result_state(result);
    // Opcional: manejar loading/error global aquí si lo deseas
    // setIsPredictionLoading(false);
    // setPredictionError(null);
  }, []);

  const setPrediction_text3d_result = useCallback((result) => {
    setPrediction_text3d_result_state(result);
  }, []);

  const setPrediction_textimg3d_result = useCallback((result) => {
    setPrediction_textimg3d_result_state(result);
  }, []);

  const setPrediction_unico3d_result = useCallback((result) => {
    setPrediction_unico3d_result_state(result);
  }, []);

  const setPrediction_multiimg3d_result = useCallback((result) => {
    setPrediction_multiimg3d_result_state(result);
  }, []);

  const setPrediction_boceto3d_result = useCallback((result) => {
    setPrediction_boceto3d_result_state(result);
  }, []);

  // --- Función para limpiar resultados (Opcional pero útil) ---
  const clearResult = useCallback((type) => {
    switch (type) {
      case "img3d":
        setPrediction_img3d_result_state(null);
        break;
      case "text3d":
        setPrediction_text3d_result_state(null);
        break;
      case "textimg3d":
        setPrediction_textimg3d_result_state(null);
        break;
      case "unico3d":
        setPrediction_unico3d_result_state(null);
        break;
      case "multiimg3d":
        setPrediction_multiimg3d_result_state(null);
        break;
      case "boceto3d":
        setPrediction_boceto3d_result_state(null);
        break;
      default: // Limpiar todos si no se especifica tipo o es null/undefined
        setPrediction_img3d_result_state(null);
        setPrediction_text3d_result_state(null);
        setPrediction_textimg3d_result_state(null);
        setPrediction_unico3d_result_state(null);
        setPrediction_multiimg3d_result_state(null);
        setPrediction_boceto3d_result_state(null);
        break;
    }
    setPredictionError(null); // Limpiar error global al limpiar resultado
    setIsPredictionLoading(false); // Asegurar que loading global se apague
  }, []); // Sin dependencias, la función en sí no cambia

  // --- Memoizar el Valor del Contexto ---
  // Esto es crucial para el rendimiento. Solo se crea un nuevo objeto 'value'
  // si alguno de los estados o funciones que contiene realmente cambia.
  const value = useMemo(
    () => ({
      // Resultados
      prediction_img3d_result,
      prediction_text3d_result,
      prediction_textimg3d_result,
      prediction_unico3d_result,
      prediction_multiimg3d_result,
      prediction_boceto3d_result,
      // Setters (los que definimos con useCallback)
      setPrediction_img3d_result,
      setPrediction_text3d_result,
      setPrediction_textimg3d_result,
      setPrediction_unico3d_result,
      setPrediction_multiimg3d_result,
      setPrediction_boceto3d_result,
      // Estados globales opcionales
      isPredictionLoading,
      setIsPredictionLoading, // Pasamos el setter directamente
      predictionError,
      setPredictionError, // Pasamos el setter directamente
      // Función de limpieza
      clearResult,
    }),
    [
      // Lista de dependencias para useMemo
      prediction_img3d_result,
      prediction_text3d_result,
      prediction_textimg3d_result,
      prediction_unico3d_result,
      prediction_multiimg3d_result,
      prediction_boceto3d_result,
      setPrediction_img3d_result, // Incluir setters de useCallback
      setPrediction_text3d_result,
      setPrediction_textimg3d_result,
      setPrediction_unico3d_result,
      setPrediction_multiimg3d_result,
      setPrediction_boceto3d_result,
      isPredictionLoading,
      predictionError,
      clearResult,
    ]
  );

  return (
    <PredictionContext.Provider value={value}>
      {children}
    </PredictionContext.Provider>
  );
};

export const usePredictions = () => {
  const context = useContext(PredictionContext);
  if (context === undefined) {
    throw new Error(
      "usePredictions debe ser usado dentro de un PredictionProvider"
    );
  }
  return context; 
};
