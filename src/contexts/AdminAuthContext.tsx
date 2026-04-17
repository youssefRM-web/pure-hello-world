import React, { createContext, useContext, useState, ReactNode } from "react";

interface AdminAuthContextType {
  isAdminAuthenticated: boolean;
  adminToken: string | null;
  admin: Record<string, unknown> | null;
  adminLogin: (token: string, admin?: Record<string, unknown>) => void;
  adminLogout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

const TOKEN_KEY = "admin_auth_token";
const USER_KEY = "admin_user";

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [adminToken, setAdminToken] = useState<string | null>(() =>
    localStorage.getItem(TOKEN_KEY)
  );
  const [admin, setAdmin] = useState<Record<string, unknown> | null>(() => {
    const stored = localStorage.getItem(USER_KEY);
    return stored ? JSON.parse(stored) : null;
  });

  const adminLogin = (token: string, adminData?: Record<string, unknown>) => {
    localStorage.setItem(TOKEN_KEY, token);
    // Mirror under auth_token so apiRequest sends the bearer header
    localStorage.setItem("auth_token", token);
    setAdminToken(token);
    if (adminData) {
      localStorage.setItem(USER_KEY, JSON.stringify(adminData));
      setAdmin(adminData);
    }
  };

  const adminLogout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem("auth_token");
    setAdminToken(null);
    setAdmin(null);
  };

  return (
    <AdminAuthContext.Provider
      value={{
        isAdminAuthenticated: !!adminToken,
        adminToken,
        admin,
        adminLogin,
        adminLogout,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used within AdminAuthProvider");
  return ctx;
}
