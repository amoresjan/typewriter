import React, { useState, useEffect, useCallback } from "react";
import { AuthContext } from "./AuthContext";
import { User } from "@app-types";
import { getBaseUrl } from "../lib/api";

const STORAGE_KEY = "typewriter_user";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? (JSON.parse(stored) as User) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) return;
    fetch(`${getBaseUrl()}/api/auth/refresh/`, {
      method: "POST",
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Session expired");
        return res.json() as Promise<User>;
      })
      .then((data) => setUser(data))
      .catch(() => {
        localStorage.removeItem(STORAGE_KEY);
        setUser(null);
      });
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    const res = await fetch(`${getBaseUrl()}/api/auth/login/`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error((err as { error?: string }).error ?? "Login failed");
    }
    const data = (await res.json()) as User;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    setUser(data);
  }, []);

  const register = useCallback(async (username: string, password: string) => {
    const res = await fetch(`${getBaseUrl()}/api/auth/register/`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    if (!res.ok) {
      const err = await res.json();
      const errData = err as { username?: string[]; error?: string };
      throw new Error(errData.username?.[0] ?? errData.error ?? "Registration failed");
    }
    const data = (await res.json()) as User;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    setUser(data);
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch(`${getBaseUrl()}/api/auth/logout/`, {
        method: "POST",
        credentials: "include",
      });
    } catch {
      // best-effort server logout; always clear local state
    }
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
