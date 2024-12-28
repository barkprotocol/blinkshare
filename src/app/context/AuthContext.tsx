"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { auth } from "../firebase/config";
import { onAuthStateChanged, User } from "firebase/auth";
import { useRouter } from "next/navigation";

// Define types for the context values
interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
}

// Define the props for the AuthContextProvider component
interface AuthContextProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthContextProvider: React.FC<AuthContextProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        setUser(user || null);
        setLoading(false);
      },
      (error) => {
        setError(error.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // Redirect to login if the user is not authenticated and not loading
    if (!user && !loading) {
      router.push("/login");
    }
  }, [user, loading, router]);

  return (
    <AuthContext.Provider value={{ user, loading, error }}>
      {loading ? (
        <div className="loading-spinner">Loading...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthContextProvider");
  }
  return context;
};
