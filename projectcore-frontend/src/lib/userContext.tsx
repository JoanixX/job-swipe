import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "@shared/schema";
import { apiRequest } from "./queryClient";

interface UserContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<User>;
  register: (userData: any) => Promise<User>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  setUserType: (type: "student" | "business") => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check for saved user in localStorage
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<User> => {
    setIsLoading(true);
    try {
      
      const res = await apiRequest("POST", "/api/login", { username, password });
      const data = await res.json();
      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
      return data.user;
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: any): Promise<User> => {
    setIsLoading(true);
    try {
      const res = await apiRequest("POST", "/api/register", userData);
      const data = await res.json();
      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
      return data.user;
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    }
  };

  const setUserType = (type: "student" | "business") => {
    // This function is used before registration to set user's theme preference
    localStorage.setItem("userType", type);
    document.documentElement.classList.remove("student-theme", "business-theme");
    document.documentElement.classList.add(`${type}-theme`);
  };

  useEffect(() => {
    // Set theme based on user type
    if (user) {
      const userType = user.userType as "student" | "business";
      document.documentElement.classList.remove("student-theme", "business-theme");
      document.documentElement.classList.add(`${userType}-theme`);
    }
  }, [user]);

  return (
    <UserContext.Provider value={{ 
      user, 
      isLoading, 
      isAuthenticated: !!user,
      login, 
      register, 
      logout, 
      updateUser,
      setUserType
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
