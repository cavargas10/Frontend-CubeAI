import { useState, useEffect } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import axios from "axios";
import { auth } from "../../Config/firebaseConfig"; 

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const UseAuth = () => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [prediction_img3d_result, setPrediction_img3d_result] = useState(null);
  const [prediction_text3d_result, setPrediction_text3d_result] = useState(null);
  const [prediction_textimg3d_result, setPrediction_textimg3d_result] = useState(null);
  const [prediction_unico3d_result, setPrediction_unico3d_result] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        if (!user.emailVerified) {
          setUserData(null);
          setLoading(false);
          return;
        }

        try {
          const token = await user.getIdToken();
          const response = await axios.get(`${BASE_URL}/user_data`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          setUserData(response.data);
          setError(null);
        } catch (err) {
          setError("Error al obtener los datos del usuario.");
          setUserData(null);
        }
      } else {
        setUserData(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setUserData(null);
    } catch (error) {
      setError("Error al cerrar sesión.");
    }
  };

  return {
    user,
    userData,
    loading,
    error,
    prediction_img3d_result,
    prediction_text3d_result,
    prediction_textimg3d_result,
    prediction_unico3d_result,
    setPrediction_img3d_result,
    setPrediction_text3d_result,
    setPrediction_textimg3d_result,
    setPrediction_unico3d_result,
    setLoading,
    setError,
    handleLogout,
  };
};
