import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth, AuthProvider } from './contexts/AuthContext';
import { SavedVideosProvider } from './contexts/SavedVideosContext';
import { ThemeProvider } from './contexts/ThemeContext';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import FeedPage from './pages/FeedPage';
import VideoPlayerPage from './pages/VideoPlayerPage';
import ProfilePage from './pages/ProfilePage';
import MyListPage from './pages/MyListPage';
import { initializeSnowplow, trackUserInteraction } from './services/snowplow';
import './i18n';
import './index.css';

// Initialize Snowplow when the app starts
initializeSnowplow();

// Track page views
const PageTracker = () => {
  const location = useLocation();

  useEffect(() => {
    let retryCount = 0;
    const maxRetries = 5;
    const retryDelay = 1000; // 1 second

    const attemptTracking = () => {
      if (typeof (window as any).snowplow === 'function' && (window as any).snowplowReady) {
        trackUserInteraction();
      } else if (retryCount < maxRetries) {
        retryCount++;
        setTimeout(attemptTracking, retryDelay);
      } else {
        console.warn('Failed to initialize Snowplow tracking after maximum retries');
      }
    };

    attemptTracking();
  }, [location]);

  return null;
};

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return !isAuthenticated ? <>{children}</> : <Navigate to="/" replace />;
};

const AppRoutes = () => {
  return (
    <>
      <PageTracker />
      <Routes>
        <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
        <Route path="/for-you" element={<ProtectedRoute><FeedPage /></ProtectedRoute>} />
        <Route path="/video/:id" element={<ProtectedRoute><VideoPlayerPage /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/my-list" element={<ProtectedRoute><MyListPage /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/\" replace />} />
      </Routes>
    </>
  );
};

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <SavedVideosProvider>
            <AppRoutes />
          </SavedVideosProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;