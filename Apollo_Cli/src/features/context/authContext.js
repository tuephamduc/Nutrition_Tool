import React, { createContext } from 'react';
import useAuthProvider from 'hooks/Auth/useAuthProvider';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const auth = useAuthProvider();
  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  )
}
export default AuthProvider