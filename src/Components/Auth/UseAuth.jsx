import { useState, useEffect } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import axios from "axios";
import { auth } from "../../Config/firebaseConfig"; 

export const UseAuth = () => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [predictionResult, setPredictionResult] = useState(null);

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
          const response = await axios.get("http://localhost:8080/user_data", {
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
      console.error("Error al cerrar sesión:", error);
      setError("Error al cerrar sesión.");
    }
  };

  return {
    user,
    userData,
    loading,
    error,
    predictionResult,
    setPredictionResult,
    setLoading,
    setError,
    handleLogout,
  };
};
