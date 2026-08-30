import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // true while we check for an existing session

  // On first load, if a token is already saved, fetch the current user
  // so a page refresh doesn't log the rider out.
  useEffect(() => {
    const token = localStorage.getItem("cabx-token");

    if (!token) {
      setLoading(false);
      return;
    }

    api
      .get("/auth/me")
      .then((res) => setUser(res.data.user))
      .catch(() => {
        localStorage.removeItem("cabx-token");
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const register = async ({ name, email, phone, password }) => {
    const res = await api.post("/auth/register", { name, email, phone, password });
    localStorage.setItem("cabx-token", res.data.token);
    setUser(res.data.user);
    return res.data.user;
  };

  const login = async ({ email, password }) => {
    const res = await api.post("/auth/login", { email, password });
    localStorage.setItem("cabx-token", res.data.token);
    setUser(res.data.user);
    return res.data.user;
  };

  const logout = () => {
    localStorage.removeItem("cabx-token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
