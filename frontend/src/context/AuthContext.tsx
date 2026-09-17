import { createContext, useContext, useEffect, useState } from "react";
import { authApi } from "../api/cabx";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    const res = await authApi.me();
    setUser(res.data.user);
    return res.data.user;
  };

  useEffect(() => {
    const token = localStorage.getItem("cabx-token");

    if (!token) {
      setLoading(false);
      return;
    }

    refreshUser()
      .catch(() => {
        localStorage.removeItem("cabx-token");
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const register = async ({ name, email, phone, password, role }) => {
    const res = await authApi.register({
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
    const res = await authApi.login({ email, password });
    localStorage.setItem("cabx-token", res.data.token);
    setUser(res.data.user);
    return res.data.user;
  };

  const linkWallet = async (walletAddress, tokenAccount) => {
    const res = await authApi.linkWallet({ walletAddress, tokenAccount });
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
        refreshUser,
        linkWallet,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
