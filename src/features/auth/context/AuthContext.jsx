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

  const value = useMemo(() => ({
    user,
    userData,
    loadingAuth,
    authError,
    handleLogout,
    refetchUserData,
    isAuthenticated: !!user && user.emailVerified
  }), [user, userData, loadingAuth, authError, handleLogout, refetchUserData]);

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