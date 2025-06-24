import { createContext, useContext, useMemo } from 'react';
import { useAuth } from '../hooks/useAuth';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const { 
    user, 
    userData, 
    loadingAuth, 
    authError, 
    handleLogout, 
    refetchUserData 
  } = useAuth();

  const authStatus = useMemo(() => {
    if (loadingAuth) return 'authenticating';
    if (!user) return 'unauthenticated';
    if (!user.emailVerified) return 'unverified';
    if (user.emailVerified && userData) return 'authenticated';
    if (user.emailVerified && !userData) return 'loading_data';
    return 'unauthenticated';
  }, [user, userData, loadingAuth]);

  const value = useMemo(() => ({
    user,
    userData,
    loadingAuth,
    authStatus,
    authError,
    handleLogout,
    refetchUserData
  }), [user, userData, loadingAuth, authStatus, authError, handleLogout, refetchUserData]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};