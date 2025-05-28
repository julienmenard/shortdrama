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
            const userData = userInfoResponse.data[0];
            setUser(userData);
            setIsAuthenticated(true);
            
            // Store username in localStorage
            if (userData.firstname) {
              localStorage.setItem('username', userData.firstname);
            } else if (userData.msisdn) {
              localStorage.setItem('username', userData.msisdn);
            } else if (userData.email) {
              localStorage.setItem('username', userData.email);
            }
          } else {
            // Invalid session or API error, clear storage and show error
            localStorage.removeItem('userId');
            localStorage.removeItem('username');
            console.warn('Session validation failed:', userInfoResponse.message || 'Unknown error');
            setError('Your session has expired. Please log in again.');
          }
        } catch (error) {
          console.error('Session check error:', error);
          localStorage.removeItem('userId');
          localStorage.removeItem('username');
          setError('Connection error. Please check your network and try again.');
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    // Add retry mechanism for network issues
    const attemptSessionCheck = () => {
      checkSession().catch(error => {
        console.error('Failed to check session:', error);
        // Only retry if we're online - no point retrying if network is down
        if (navigator.onLine) {
          console.log('Retrying session check in 3 seconds...');
          setTimeout(attemptSessionCheck, 3000);
        } else {
          setIsLoading(false);
          setError('Network is unavailable. Please check your connection.');
        }
      });
    };

    attemptSessionCheck();
  }, []);

  const login = async (identifier: string, password: string): Promise<boolean> => {
    setError(null);
    setIsLoading(true);
    
    try {
      // Check network connectivity first
      if (!navigator.onLine) {
        setError('Network connection unavailable. Please check your internet connection.');
        return false;
      }
      
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
        const userData = userInfoResponse.data[0];
        setUser(userData);
        setIsAuthenticated(true);
        
        // Store username in localStorage
        if (userData.firstname) {
          localStorage.setItem('username', userData.firstname);
        } else if (userData.msisdn) {
          localStorage.setItem('username', userData.msisdn);
        } else if (userData.email) {
          localStorage.setItem('username', userData.email);
        }
        
        return true;
      } else {
        setError(userInfoResponse.message || 'Failed to retrieve user information.');
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
    localStorage.removeItem('username');
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