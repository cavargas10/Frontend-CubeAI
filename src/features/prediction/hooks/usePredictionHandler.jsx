import { useState, useCallback } from "react";
import {
  generateBoceto3D,
  generateImagen3D,
  generateTexto3D,
  generateTextImg3D,
  generateUnico3D,
  generateMultiImagen3D,
} from "../services/predictionApi";

const predictionSteps = {
  boceto3D: [
    "Analizando tu boceto...",
    "Interpretando las formas principales...",
    "Generando la malla 3D base...",
    "Extrapolando volumen y profundidad...",
    "Refinando la geometría del modelo...",
    "Casi listo, finalizando el modelo...",
  ],
  imagen3D: [
    "Procesando la imagen de entrada...",
    "Identificando contornos y profundidad...",
    "Creando un mapa de normales...",
    "Construyendo el modelo 3D inicial...",
    "Proyectando texturas sobre la malla...",
    "Optimizando el resultado final...",
  ],
  texto3D: [
    "Interpretando tu descripción...",
    "Generando conceptos visuales...",
    "Creando una forma 3D a partir del texto...",
    "Aplicando un estilo base...",
    "Añadiendo detalles y texturas...",
    "El modelo 3D está casi listo...",
  ],
  textimg3D: [
    "Interpretando tu descripción...",
    "Generando una imagen 2D base...",
    "Analizando la imagen generada...",
    "Extruyendo la imagen a 3D...",
    "Refinando la forma y las texturas...",
    "Tu creación 3D está por terminar...",
  ],
  multiimagen3D: [
    "Analizando las vistas (frontal, lateral, trasera)...",
    "Alineando las imágenes en el espacio 3D...",
    "Fusionando las perspectivas...",
    "Reconstruyendo la geometría completa...",
    "Generando una textura unificada...",
    "Compilando el modelo 3D final...",
  ],
  unico3D: [
    "Iniciando escaneo fotogramétrico...",
    "Calculando puntos de interés...",
    "Reconstruyendo la nube de puntos...",
    "Creando la malla 3D...",
    "Generando la textura a partir de la imagen...",
    "Finalizando el modelo 3D de alta fidelidad...",
  ],
  default: [
    "Iniciando proceso...",
    "Contactando con los servidores de IA...",
    "La solicitud está en cola...",
    "Procesando datos...",
    "Generando resultado...",
    "Casi hemos terminado...",
  ],
};

export const usePredictionHandler = (user) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loadingSteps, setLoadingSteps] = useState(predictionSteps.default);

  const submitPrediction = useCallback(
    async (endpoint, payload) => {
      setLoadingSteps(predictionSteps[endpoint] || predictionSteps.default);
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
    [user]
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