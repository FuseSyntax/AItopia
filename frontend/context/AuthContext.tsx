import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';

interface Subscription {
  status: string;
  plan: string;
  selectedTools: string[];
}

interface AuthUser {
  token: string;
  subscription?: Subscription;
}

interface AuthContextProps {
  user: AuthUser | null;
  login: (token: string) => void;
  logout: () => void;
  updateUserSubscription: (subscription: Subscription) => void;
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  login: () => {},
  logout: () => {},
  updateUserSubscription: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedSubscription = localStorage.getItem('subscription');
    if (token) {
      const userData: AuthUser = { token };
      if (storedSubscription) {
        try {
          userData.subscription = JSON.parse(storedSubscription);
        } catch (e) {
          console.error('Error parsing stored subscription:', e);
        }
      }
      setUser(userData);
    }
  }, []);

  const login = (token: string) => {
    localStorage.setItem('token', token);
    setUser({ token });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('subscription');
    setUser(null);
  };

  const updateUserSubscription = (subscription: Subscription) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updatedUser = {
        ...prev,
        subscription,
      };
      localStorage.setItem('subscription', JSON.stringify(subscription));
      return updatedUser;
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUserSubscription }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);