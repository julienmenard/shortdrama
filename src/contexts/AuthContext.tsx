import React, { createContext, useState, useContext, useEffect } from 'react';
import { authenticateUser, getUserInfo, UserInfo } from '../api';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: UserInfo | null;
  error: string | null;
  login: (identifier: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [user, setUser] = useState<UserInfo | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check for existing session on load
    const checkSession = async () => {
      const userId = localStorage.getItem('userId');
      if (userId) {
        try {
          setIsLoading(true);
          const userInfoResponse = await getUserInfo(parseInt(userId));
          
          if (userInfoResponse.error === 0 && userInfoResponse.data && userInfoResponse.data.length > 0) {
            setUser(userInfoResponse.data[0]);
            setIsAuthenticated(true);
          } else {
            // Invalid session, clear storage
            localStorage.removeItem('userId');
          }
        } catch (error) {
          console.error('Session check error:', error);
          localStorage.removeItem('userId');
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  const login = async (identifier: string, password: string): Promise<boolean> => {
    setError(null);
    setIsLoading(true);
    
    try {
      // Authenticate user
      const authResponse = await authenticateUser(identifier, password);
      
      if (authResponse.error !== 0) {
        setError('Authentication failed. Please check your network connection.');
        return false;
      }
      
      if (authResponse.data.user_id === false) {
        setError('Invalid credentials. Please try again.');
        return false;
      }
      
      // Store user ID for session
      localStorage.setItem('userId', authResponse.data.user_id.toString());
      
      // Fetch user info
      const userInfoResponse = await getUserInfo(authResponse.data.user_id);
      
      if (userInfoResponse.error === 0 && userInfoResponse.data && userInfoResponse.data.length > 0) {
        setUser(userInfoResponse.data[0]);
        setIsAuthenticated(true);
        return true;
      } else {
        setError('Failed to retrieve user information.');
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('An unexpected error occurred. Please try again later.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('userId');
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    isAuthenticated,
    isLoading,
    user,
    error,
    login,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};