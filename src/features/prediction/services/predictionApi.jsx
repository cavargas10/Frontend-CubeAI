import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const api = axios.create({
  baseURL: BASE_URL,
});

const handleApiError = (error, defaultMessage = "Error en la solicitud") => {
  console.error("API Service Error:", error.response || error.message || error);
  const message =
    error.response?.data?.detail ||
    error.response?.data?.error ||
    error.message ||
    defaultMessage;
  throw new Error(message);
};

export const startGenerationJob = async (token, endpoint, payload) => {
  try {
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const isFormData = payload instanceof FormData;
    if (!isFormData) {
      headers["Content-Type"] = "application/json";
    }

    const response = await api.post(`/generation/${endpoint}`, payload, {
      headers,
    });
    return response.data;
  } catch (error) {
    handleApiError(error, `Error al iniciar la generación para ${endpoint}`);
  }
};

export const getJobStatus = async (token, jobId) => {
  try {
    const response = await api.get(`/generation/status/${jobId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    handleApiError(error, `Error al obtener el estado del trabajo ${jobId}`);
  }
};

export const regenerateGenerationJob = async (token, predictionType, generationName, payload) => {
  try {
    const response = await api.put(
      `/generation/${predictionType}/${generationName}`,
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    handleApiError(error, `Error al regenerar la tarea para ${generationName}`);
  }
};

export const getGenerations = async (token, generationType) => {
  try {
    const response = await api.get(`/generation/history/${generationType}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!Array.isArray(response.data)) {
      throw new Error("La respuesta de la API no es un array válido.");
    }
    return response.data;
  } catch (error) {
    handleApiError(
      error,
      `Error al obtener el historial para ${generationType}`
    );
  }
};

export const deleteGeneration = async (token, generation) => {
  try {
    if (!generation || !generation.prediction_type || !generation.generation_name) {
      throw new Error("Datos de generación inválidos para la eliminación.");
    }

    const readableToApiTypeMap = {
      "Imagen a 3D": "Imagen3D",
      "Texto a 3D": "Texto3D",
      "Texto a Imagen a 3D": "TextImg3D",
      "Unico a 3D": "Unico3D",
      "Multi Imagen a 3D": "MultiImagen3D",
      "Boceto a 3D": "Boceto3D",
      "Estudio de Texturizado": "Retexturize3D",
    };
    
    const predictionType = readableToApiTypeMap[generation.prediction_type];
    if (!predictionType) {
        throw new Error(`Tipo de predicción desconocido: ${generation.prediction_type}`);
    }
    
    const generationName = generation.generation_name;

    const response = await api.delete(
      `/generation/${predictionType}/${generationName}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data || { success: true, message: "Cuenta eliminada correctamente." };
  } catch (error) {
    handleApiError(error, "Error al eliminar la generación");
  }
};

export const uploadPredictionPreview = async (token, formData) => {
  try {
    const response = await api.post(`/generation/preview`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    handleApiError(
      error,
      "Error al subir la previsualización de la generación"
    );
  }
};
