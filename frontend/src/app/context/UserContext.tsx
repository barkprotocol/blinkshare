'use client';

import React, { createContext, useState, useEffect, useContext } from 'react';

// Define the user type
type User = {
  email: string;
  name: string;
  profileImage?: string;
  walletAddress?: string;
  // other user properties
};

interface UserContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

// Create the context with an initial null value
const UserContext = createContext<UserContextType | undefined>(undefined);

// Create a provider component
export const UserProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  // You can fetch user data from an API, Firebase, or local storage
  useEffect(() => {
    // Example: Get user data from localStorage or an API
    const storedUser = JSON.parse(localStorage.getItem('user') || 'null');
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to access user data in any component
export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
