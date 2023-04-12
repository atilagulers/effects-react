import {createContext, useState, useEffect} from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
  const [token, setToken] = useState(localStorage.getItem('token'));

  const setAuthToken = (token) => {
    setToken(token);
    localStorage.setItem('token', token);
  };

  const removeAuthToken = () => {
    setToken(null);
    localStorage.removeItem('token');
  };

  useEffect(() => {
    console.log('effect');
  }, []);

  return (
    <AuthContext.Provider value={{token, setAuthToken, removeAuthToken}}>
      {children}
    </AuthContext.Provider>
  );
};
