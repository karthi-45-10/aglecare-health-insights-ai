
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "sonner";

type User = {
  id: string;
  email: string;
  name: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (email: string, name: string, password: string) => Promise<boolean>;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const storedUser = localStorage.getItem("aglecare_user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        localStorage.removeItem("aglecare_user");
      }
    }
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string): Promise<boolean> => {
    try {
      // In a real app, this would be an API call to authenticate
      // For demo purposes, we'll simulate a successful login if the password is at least 6 characters
      if (password.length < 6) {
        toast.error("Invalid credentials");
        return false;
      }

      // Get or create user
      const users = JSON.parse(localStorage.getItem("aglecare_users") || "{}");
      const userRecord = users[email];

      if (!userRecord) {
        toast.error("User not found. Please sign up first.");
        return false;
      }

      if (userRecord.password !== password) {
        toast.error("Invalid password");
        return false;
      }

      const authenticatedUser = {
        id: userRecord.id,
        email: email,
        name: userRecord.name,
      };

      setUser(authenticatedUser);
      localStorage.setItem("aglecare_user", JSON.stringify(authenticatedUser));
      toast.success("Sign in successful!");
      return true;
    } catch (error) {
      console.error("Authentication error:", error);
      toast.error("Authentication failed. Please try again.");
      return false;
    }
  };

  const signUp = async (email: string, name: string, password: string): Promise<boolean> => {
    try {
      if (password.length < 6) {
        toast.error("Password must be at least 6 characters");
        return false;
      }

      // Get existing users or initialize empty object
      const users = JSON.parse(localStorage.getItem("aglecare_users") || "{}");
      
      // Check if user already exists
      if (users[email]) {
        toast.error("User already exists");
        return false;
      }

      // Create new user
      const newUser = {
        id: `user_${Date.now()}`,
        email,
        name,
        password, // In a real app, NEVER store passwords in plaintext
      };

      // Add to users object
      users[email] = newUser;
      localStorage.setItem("aglecare_users", JSON.stringify(users));

      // Log the user in
      const authenticatedUser = {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
      };

      setUser(authenticatedUser);
      localStorage.setItem("aglecare_user", JSON.stringify(authenticatedUser));
      
      toast.success("Account created successfully!");
      return true;
    } catch (error) {
      console.error("Signup error:", error);
      toast.error("Signup failed. Please try again.");
      return false;
    }
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem("aglecare_user");
    toast.info("You have been signed out");
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
