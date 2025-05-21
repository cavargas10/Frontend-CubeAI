import { useState, useEffect, useCallback } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../../../config/firebase";
import { getUserData } from "../services/userApi";

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [authError, setAuthError] = useState(null);

  const fetchCurrentUserData = useCallback(async (firebaseUser) => {
    if (!firebaseUser) return;
    try {
      const token = await firebaseUser.getIdToken(true);
      const backendUserData = await getUserData(token);
      setUserData(backendUserData);
      setAuthError(null);
    } catch (err) {
      console.error("Error fetching user data from backend:", err);
      setAuthError("No se pudieron cargar los datos completos del usuario.");
      setUserData(null);
    }
  }, []);

  useEffect(() => {
    setLoadingAuth(true);
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        if (firebaseUser.emailVerified) {
          await fetchCurrentUserData(firebaseUser);
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
  }, [fetchCurrentUserData]);

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

  const refetchUserData = useCallback(async () => {
    if (user) {
      await fetchCurrentUserData(user);
    }
  }, [user, fetchCurrentUserData]);

  return {
    user,
    userData,
    loadingAuth,
    authError,
    handleLogout,
    refetchUserData,
  };
};