import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL;

const handleApiError = (error, defaultMessage = "Error en la solicitud de predicción") => {
  console.error("Prediction API Error:", error.response || error);
  const message = error.response?.data?.error || error.message || defaultMessage;
  throw new Error(message);
};

export const generateBoceto3D = async (token, formData) => {
  try {
    const response = await axios.post(`${BASE_URL}/boceto3D`, formData, {
      headers: {
        "Content-Type": "multipart/form-data", 
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data; 
  } catch (error) {
    handleApiError(error, "Error al generar desde boceto"); 
  }
};

export const generateImagen3D = async (token, formData) => {
  try {
    const response = await axios.post(`${BASE_URL}/imagen3D`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    handleApiError(error, "Error al generar desde imagen");
  }
};

export const generateTexto3D = async (token, data) => {
  try {
    const response = await axios.post(`${BASE_URL}/texto3D`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    handleApiError(error, "Error al generar desde texto");
  }
};

export const generateTextImg3D = async (token, data) => {
    try {
        const response = await axios.post(`${BASE_URL}/textimg3D`, data, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        handleApiError(error, "Error al generar desde texto e imagen");
    }
};

export const generateUnico3D = async (token, formData) => {
    try {
        const response = await axios.post(`${BASE_URL}/unico3D`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        handleApiError(error, "Error al generar desde único");
    }
};

export const generateMultiImagen3D = async (token, formData) => {
    try {
        const response = await axios.post(`${BASE_URL}/multiimagen3D`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        handleApiError(error, "Error al generar desde multi-imagen");
    }
};

export const getGenerations = async (token, generationType) => {
  try {
    const response = await axios.get(`${BASE_URL}/generations?type=${generationType}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!Array.isArray(response.data)) {
        throw new Error("La respuesta de la API no es un array válido.");
    }
    return response.data;
  } catch (error) {
    handleApiError(error, `Error al obtener el historial para ${generationType}`);
  }
};

export const deleteGeneration = async (token, generation) => {
  try {
    if (!generation || !generation.prediction_type || !generation.generation_name) {
      throw new Error("Datos de generación inválidos para la eliminación.");
    }

    const response = await axios.delete(
      `${BASE_URL}/generation`,
      {
        headers: { Authorization: `Bearer ${token}` },
        data: {
          prediction_type: generation.prediction_type, 
          generation_name: generation.generation_name,
        },
      }
    );
    return { success: true, data: response.data };
  } catch (error) {
    handleApiError(error, "Error al eliminar la generación");
  }
};