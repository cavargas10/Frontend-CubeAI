
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL; 

const handleApiError = (error, defaultMessage = "Error en la solicitud de usuario") => {
  console.error("User API Service Error:", error.response || error.message || error);
  
  const message = error.response?.data?.error || error.message || defaultMessage;
  
  throw new Error(message);
};

export const getUserData = async (token) => {
  if (!token) {
    console.error("getUserData: No token provided");
    throw new Error("Token de autenticación requerido.");
  }
  try {
    const response = await axios.get(`${BASE_URL}/user_data`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data; 
  } catch (error) {
    handleApiError(error, "Error al obtener los datos del usuario desde el backend");
  }
};

export const updateUserName = async (token, name) => {
  if (!token) throw new Error("Token de autenticación requerido.");
  if (!name || typeof name !== 'string' || name.trim() === '') {
    throw new Error("El nombre proporcionado no es válido.");
  }
  try {
    const response = await axios.post(`${BASE_URL}/update_name`, { name }, { 
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    handleApiError(error, "Error al actualizar el nombre del usuario");
  }
};

export const updateUserProfilePicture = async (token, formData) => {
  if (!token) throw new Error("Token de autenticación requerido.");
  if (!(formData instanceof FormData)) {
      throw new Error("Se requiere un objeto FormData para la imagen de perfil.");
  }
  try {
    const response = await axios.post(`${BASE_URL}/update_profile_picture`, formData, {
      headers: {
        "Content-Type": "multipart/form-data", 
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    handleApiError(error, "Error al actualizar la imagen de perfil");
  }
};

export const deleteUserAccount = async (token) => {
  if (!token) throw new Error("Token de autenticación requerido.");
  try {
    const response = await axios.delete(`${BASE_URL}/delete_user`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    
    return response.data || { success: true, message: "Cuenta eliminada correctamente." };
  } catch (error) {
    handleApiError(error, "Error al eliminar la cuenta del usuario");
  }
};