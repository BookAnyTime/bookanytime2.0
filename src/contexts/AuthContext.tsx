
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (fullName: string, email: string, phone: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  // Initialize from localStorage to avoid "false on refresh" issue
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("token"));
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Optional: you can still use useEffect if you want to sync with storage later
  useEffect(() => {
    const handleStorageChange = () => {
      const savedToken = localStorage.getItem("token");
      const savedUser = localStorage.getItem("user");

      setToken(savedToken);
      setUser(savedUser ? JSON.parse(savedUser) : null);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const login = async (email: string, password: string) => {
    const apiUrl = `${import.meta.env.VITE_API_URL}/api/auth/login`;
    const response = await axios.post(apiUrl, { email, password });
    const data = response.data;

    if (data.token && data.user) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);
      setToken(data.token);
    } else {
      throw new Error("Login failed");
    }
  };

  const signup = async (fullName: string, email: string, phone: string, password: string) => {
    const apiUrl = `${import.meta.env.VITE_API_URL}/api/auth/signup`;
    const response = await axios.post(apiUrl, { fullName, email, phone, password });
    const data = response.data;

    if (data.message?.toLowerCase().includes("signup successful")) {
      return true;
    } else {
      throw new Error(data.message || "Signup failed");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setToken(null);
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    signup,
    logout,
    isAuthenticated: !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
