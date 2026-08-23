import React, { createContext, useCallback, useContext, useMemo, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => (typeof window !== 'undefined' ? localStorage.getItem('tavora_token') : null));
  const [isBanned, setIsBanned] = useState(false);

  useEffect(() => {
    const savedUser = typeof window !== 'undefined' ? localStorage.getItem('tavora_user') : null;
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem('tavora_user');
      }
    }
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    const accessibility = user?.accessibility || {};
    const root = document.documentElement;
    root.dataset.textSize = accessibility.textSize || 'normal';
    root.dataset.reduceMotion = accessibility.reduceMotion ? 'true' : 'false';
    root.dataset.highContrast = accessibility.highContrast ? 'true' : 'false';
    root.dataset.appearance = user?.appearance || 'dark';
  }, [user]);

  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken || null);
    if (typeof window !== 'undefined') {
      localStorage.setItem('tavora_user', JSON.stringify(userData));
      if (authToken) {
        localStorage.setItem('tavora_token', authToken);
      } else {
        localStorage.removeItem('tavora_token');
      }
    }
    setIsBanned(false);
  };

  const updateUser = (nextUser) => {
    setUser(nextUser);
    if (typeof window !== 'undefined') {
      localStorage.setItem('tavora_user', JSON.stringify(nextUser));
    }
  };

  const updateSession = (nextUser, nextToken) => {
    updateUser(nextUser);
    if (nextToken) {
      setToken(nextToken);
      if (typeof window !== 'undefined') localStorage.setItem('tavora_token', nextToken);
    }
  };

  const getAuthHeaders = useCallback(() => {
    const authToken = token || (typeof window !== 'undefined' ? localStorage.getItem('tavora_token') : null);
    return {
      'Content-Type': 'application/json',
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
    };
  }, [token]);

  const logout = () => {
    setUser(null);
    setToken(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('tavora_user');
      localStorage.removeItem('tavora_token');
    }
    setIsBanned(false);
  };

  const value = useMemo(
    () => ({
      user,
      token,
      isBanned,
      login,
      logout,
      updateUser,
      updateSession,
      getAuthHeaders,
      setUser,
      setIsBanned,
    }),
    [user, token, isBanned]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
