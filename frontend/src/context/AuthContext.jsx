import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // If a token exists, we need to verify the session.
  // Otherwise, there is nothing to load.
  const [loading, setLoading] = useState(() =>
    Boolean(localStorage.getItem("cabx-token")),
  );

  useEffect(() => {
    const token = localStorage.getItem("cabx-token");

    // No existing session
    if (!token) {
      return;
    }

    const restoreSession = async () => {
      try {
        const res = await api.get("/auth/me");
        setUser(res.data.user);
      } catch (error) {
        localStorage.removeItem("cabx-token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  const register = async ({ name, email, phone, password, role }) => {
    const res = await api.post("/auth/register", {
      name,
      email,
      phone,
      password,
      role,
    });

    localStorage.setItem("cabx-token", res.data.token);
    setUser(res.data.user);

    return res.data.user;
  };

  const login = async ({ email, password }) => {
    const res = await api.post("/auth/login", {
      email,
      password,
    });

    localStorage.setItem("cabx-token", res.data.token);
    setUser(res.data.user);

    return res.data.user;
  };

  const logout = () => {
    localStorage.removeItem("cabx-token");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        register,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
