import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('skillproof_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('skillproof_token') || null);
  const [loading, setLoading] = useState(true);

  // Initialize and check current user on load
  useEffect(() => {
    const verifyAuth = async () => {
      const storedToken = localStorage.getItem('skillproof_token');
      if (!storedToken) {
        setLoading(false);
        return;
      }

      try {
        const response = await authApi.getMe();
        if (response.data && response.data.user) {
          setUser(response.data.user);
          localStorage.setItem('skillproof_user', JSON.stringify(response.data.user));
        }
      } catch (err) {
        console.warn('Session verification failed, logging out:', err.message);
        localStorage.removeItem('skillproof_token');
        localStorage.removeItem('skillproof_user');
        setUser(null);
        setToken(null);
      } finally {
        setLoading(false);
      }
    };

    verifyAuth();
  }, []);

  const login = async (email, password) => {
    const response = await authApi.login({ email, password });
    const { token: receivedToken, user: receivedUser } = response.data;

    localStorage.setItem('skillproof_token', receivedToken);
    localStorage.setItem('skillproof_user', JSON.stringify(receivedUser));

    setToken(receivedToken);
    setUser(receivedUser);
    return receivedUser;
  };

  const register = async (userData) => {
    const response = await authApi.register(userData);
    const { token: receivedToken, user: receivedUser } = response.data;

    localStorage.setItem('skillproof_token', receivedToken);
    localStorage.setItem('skillproof_user', JSON.stringify(receivedUser));

    setToken(receivedToken);
    setUser(receivedUser);
    return receivedUser;
  };

  const logout = () => {
    localStorage.removeItem('skillproof_token');
    localStorage.removeItem('skillproof_user');
    setUser(null);
    setToken(null);
  };

  const updateUser = (updatedFields) => {
    setUser((prev) => {
      const updated = { ...prev, ...updatedFields };
      localStorage.setItem('skillproof_user', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user && !!token,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
