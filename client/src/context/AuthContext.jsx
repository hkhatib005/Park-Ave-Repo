import { createContext, useContext, useState, useEffect } from 'react';
import { adminLogin } from '../utils/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('paj_token');
    const email = localStorage.getItem('paj_admin_email');
    if (token && email) setAdmin({ token, email });
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const { data } = await adminLogin(email, password);
    localStorage.setItem('paj_token', data.token);
    localStorage.setItem('paj_admin_email', data.email);
    setAdmin({ token: data.token, email: data.email });
  };

  const logout = () => {
    localStorage.removeItem('paj_token');
    localStorage.removeItem('paj_admin_email');
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ admin, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
