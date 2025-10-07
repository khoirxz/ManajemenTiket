import { useState } from "react";
import { api } from "../api/client";

export function useAuth() {
  const [user, setUser] = useState<{ id: number; name: string } | null>(() => {
    const u = localStorage.getItem("user");
    return u ? JSON.parse(u) : null;
  });

  const login = async (email: string, password: string) => {
    const { data } = await api.post("/login", { email, password });
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    setUser(data.user);
  };

  const logout = async () => {
    try {
      await api.post("/logout");
    } catch (error) {
      console.error("Logout failed", error);
    }
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    // window.location.href = "/login";
  };

  return { user, login, logout };
}
