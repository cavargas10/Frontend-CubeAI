import { useState, useEffect, useCallback } from "react"; 
import { onAuthStateChanged, signOut } from "firebase/auth";
import axios from "axios";
import { auth } from "../../../config/firebase"; 

const BASE_URL = import.meta.env.VITE_BASE_URL; 
export const useAuth = () => {
  const [user, setUser] = useState(null); 
  const [userData, setUserData] = useState(null); 
  const [loadingAuth, setLoadingAuth] = useState(true); 
  const [authError, setAuthError] = useState(null); 
  
  useEffect(() => {
    setLoadingAuth(true); 
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser); 

      if (firebaseUser) {
        if (firebaseUser.emailVerified) {
          try {
            const token = await firebaseUser.getIdToken(true); 
            const response = await axios.get(`${BASE_URL}/user_data`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            setUserData(response.data); 
            setAuthError(null); 
          } catch (err) {
            console.error("Error fetching user data from backend:", err);
            
            setAuthError("No se pudieron cargar los datos completos del usuario.");
            setUserData(null); 
          }
        } else {
          
          setUserData(null); 
          setAuthError(null); 
          console.log("Usuario no verificado.");
        }
      } else {
        
        setUserData(null); 
        setAuthError(null); 
      }
      setLoadingAuth(false); 
    });

    return () => unsubscribe();
  }, []); 

  const handleLogout = useCallback(async () => {
    setAuthError(null); 
    try {
      await signOut(auth);
      
      console.log("Logout exitoso");
    } catch (error) {
      console.error("Error during logout:", error);
      setAuthError("Error al cerrar la sesión. Intente nuevamente.");
    }
  }, []); 

  const updateUserData = useCallback((newData) => {
    setUserData(prevData => {
      if (!prevData) return newData;
      return { ...prevData, ...newData };
    });
  }, []);

  return {
    user,         
    userData,     
    loadingAuth,  
    authError,    
    handleLogout,
    updateUserData 
  };
};