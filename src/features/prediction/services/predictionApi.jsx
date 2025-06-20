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
    if (
      !generation ||
      !generation.prediction_type ||
      !generation.generation_name
    ) {
      throw new Error("Datos de generación inválidos para la eliminación.");
    }
    const response = await api.delete(`/generation`, {
      headers: { Authorization: `Bearer ${token}` },
      data: {
        prediction_type: generation.prediction_type,
        generation_name: generation.generation_name,
      },
    });
    return { success: true, data: response.data };
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
