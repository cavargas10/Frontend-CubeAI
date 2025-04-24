import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL;

const handleApiError = (error, defaultMessage = "Error en la solicitud de predicción") => {
  console.error("Prediction API Error:", error);
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
      headers: {
        Authorization: `Bearer ${token}`,
      },
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

export const getGenerations = async (token) => {
  try {
    const response = await axios.get(`${BASE_URL}/generations`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.data || typeof response.data !== 'object') {
        throw new Error("Respuesta inesperada al obtener generaciones.");
    }

    const expectedKeys = ['imagen3D', 'texto3D', 'textimg3D', 'unico3D', 'multiimg3D', 'boceto3D'];
    for (const key of expectedKeys) {
        if (!Array.isArray(response.data[key])) {
             console.warn(`Falta o no es un array la clave '${key}' en la respuesta de generaciones.`);
             response.data[key] = []; 
        }
    }
    return response.data;
  } catch (error) {
    handleApiError(error, "Error al obtener el historial de generaciones");
  }
};

export const deleteGeneration = async (token, generationType, generationName) => {
  try {
    const encodedName = encodeURIComponent(generationName);
    const response = await axios.delete(
      `${BASE_URL}/generation/${generationType}/${encodedName}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return { success: true, data: response.data };
  } catch (error) {
    handleApiError(error, "Error al eliminar la generación");
  }
};