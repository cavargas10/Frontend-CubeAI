// src/features/auth/hooks/useAuth.js
import { useState, useEffect, useCallback } from "react"; // Asegúrate que useCallback esté importado
import { onAuthStateChanged, signOut } from "firebase/auth";
import axios from "axios";
import { auth } from "../../../config/firebase"; // Ruta actualizada a la configuración de Firebase

const BASE_URL = import.meta.env.VITE_BASE_URL; // Obtiene la URL base de las variables de entorno

export const useAuth = () => {
  // --- Estados de Autenticación y Datos del Usuario ---
  const [user, setUser] = useState(null); // Almacena el objeto de usuario de Firebase Auth
  const [userData, setUserData] = useState(null); // Almacena datos adicionales de tu backend
  const [loadingAuth, setLoadingAuth] = useState(true); // Indica si el estado inicial de auth está cargando
  const [authError, setAuthError] = useState(null); // Almacena errores relacionados con auth o carga de datos

  // --- Efecto para escuchar cambios de Auth y cargar datos ---
  useEffect(() => {
    setLoadingAuth(true); // Indica que estamos iniciando la verificación
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser); // Actualiza el usuario de Firebase (puede ser null)

      if (firebaseUser) {
        // Si hay usuario de Firebase, intenta obtener datos adicionales del backend
        // (Solo si está verificado, ajusta esta lógica si es necesario)
        if (firebaseUser.emailVerified) {
          try {
            const token = await firebaseUser.getIdToken(true); // Forzar refresco del token si es necesario
            const response = await axios.get(`${BASE_URL}/user_data`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            setUserData(response.data); // Guarda los datos del backend
            setAuthError(null); // Limpia cualquier error previo
          } catch (err) {
            console.error("Error fetching user data from backend:", err);
            // Decide qué error mostrar. ¿Es crítico si no se cargan los datos?
            setAuthError("No se pudieron cargar los datos completos del usuario.");
            setUserData(null); // Asegura que no haya datos parciales
          }
        } else {
          // El usuario existe pero no está verificado
          setUserData(null); // No cargamos datos del backend
          setAuthError(null); // No es necesariamente un error, pero no hay datos completos
          console.log("Usuario no verificado.");
        }
      } else {
        // No hay usuario de Firebase
        setUserData(null); // Limpia los datos del backend
        setAuthError(null); // No hay error si no hay usuario
      }
      setLoadingAuth(false); // Marca como terminada la carga inicial/cambio de estado
    });

    // Función de limpieza: se desuscribe del listener cuando el componente que usa el hook se desmonta
    return () => unsubscribe();
  }, []); // Array vacío: este efecto solo se ejecuta al montar el hook

  // --- Función de Logout ---
  const handleLogout = useCallback(async () => {
    setAuthError(null); // Limpia errores antes de intentar logout
    try {
      await signOut(auth);
      // El listener onAuthStateChanged se encargará de poner user y userData a null
      console.log("Logout exitoso");
    } catch (error) {
      console.error("Error during logout:", error);
      setAuthError("Error al cerrar la sesión. Intente nuevamente.");
    }
  }, []); // Sin dependencias

  // --- Valor de Retorno del Hook ---
  // Devuelve solo la información y funciones relevantes para la autenticación
  return {
    user,         // Objeto de usuario de Firebase (o null)
    userData,     // Datos del backend (o null)
    loadingAuth,  // Booleano: ¿está cargando el estado inicial?
    authError,    // Mensaje de error (o null)
    handleLogout, // Función para cerrar sesión
  };
};

// No necesitas un export default si solo exportas el hook nombrado