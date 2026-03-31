import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";

interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  user: Record<string, unknown> | null;
  login: (token: string, user?: Record<string, unknown>) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("auth_token"));
  const [user, setUser] = useState<Record<string, unknown> | null>(() => {
    const stored = localStorage.getItem("restaurant_user");
    return stored ? JSON.parse(stored) : null;
  });

  const login = (newToken: string, userData?: Record<string, unknown>) => {
    localStorage.setItem("auth_token", newToken);
    setToken(newToken);
    if (userData) {
      localStorage.setItem("restaurant_user", JSON.stringify(userData));
      setUser(userData);
    }
  };

  const logout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("restaurant_user");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!token, token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
