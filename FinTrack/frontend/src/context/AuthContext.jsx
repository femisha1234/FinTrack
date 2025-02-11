import React, { createContext, useState, useEffect, useContext } from 'react';

// Create context for auth
export const AuthContext = createContext();

// Create custom hook to use auth
export const useAuth = () => {
  return useContext(AuthContext); // Hook to access AuthContext value
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);

  // On component mount, check for token in localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ token, setToken }}>
      {children}
    </AuthContext.Provider>
  );
};
