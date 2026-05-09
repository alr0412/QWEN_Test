import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('userRole');
    const phone = localStorage.getItem('userPhone');
    
    if (token && role) {
      setUser({ token, role, phone });
    }
    setLoading(false);
  }, []);

  const login = (token, role, phone) => {
    localStorage.setItem('token', token);
    localStorage.setItem('userRole', role);
    localStorage.setItem('userPhone', phone);
    setUser({ token, role, phone });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userPhone');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
