import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, User, CreditCard, Bell, Shield, HelpCircle, ChevronRight, ChevronLeft, Languages, Moon, Sun } from 'lucide-react';
import BottomNavigation from '../components/BottomNavigation';
import Logo from '../components/Logo';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';
import SubscriptionView from '../components/SubscriptionView';
import PrivacyPolicy from './PrivacyPolicy';
import HelpSupport from './HelpSupport';

const LanguageSelector: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { i18n } = useTranslation();
  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
    { code: 'pl', name: 'Polski' },
    { code: 'zh', name: '中文' },
    { code: 'ar', name: 'العربية' }
  ];

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-[rgb(var(--background))] rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-[rgb(var(--foreground))]">Select Language</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-300"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        </div>
        <div className="space-y-2">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                i18n.changeLanguage(lang.code);
                onClose();
              }}
              className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                i18n.language === lang.code
                  ? 'bg-pink-600 text-white'
                  : 'hover:bg-gray-700 text-[rgb(var(--foreground))]'
              }`}
            >
              <span>{lang.name}</span>
              {i18n.language === lang.code && (
                <div className="w-2 h-2 rounded-full bg-white" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const NotificationPermissionDialog: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [requestStatus, setRequestStatus] = useState<string>('pending'); // pending, granted, denied
  const { t } = useTranslation();

  const requestNotificationPermission = async () => {
    try {
      // Check if the browser supports notifications
      if (!('Notification' in window)) {
        console.log('This browser does not support notifications');
        setRequestStatus('unsupported');
        return;
      }

      // Check if permission is already granted
      if (Notification.permission === 'granted') {
        setRequestStatus('granted');
        return;
      }

      // Request permission
      const permission = await Notification.requestPermission();
      setRequestStatus(permission);
      
      // Show a test notification if permission was granted
      if (permission === 'granted') {
        new Notification('ShortDrama Notifications Enabled', {
          body: 'You will now receive notifications about new episodes and updates.',
          icon: '/src/pages/logo/heartblood.png'
        });
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      setRequestStatus('error');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-[rgb(var(--background))] rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-[rgb(var(--foreground))]">Notifications</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-300"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        </div>
        
        <div className="space-y-4">
          {requestStatus === 'pending' && (
            <>
              <p className="text-gray-300 mb-4">
                Would you like to receive browser notifications from ShortDrama when new episodes are released or when there are important updates?
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={requestNotificationPermission}
                  className="flex-1 bg-pink-600 text-white py-3 rounded-lg font-medium hover:bg-pink-700 transition-colors"
                >
                  Enable Notifications
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 bg-gray-700 text-white py-3 rounded-lg font-medium hover:bg-gray-600 transition-colors"
                >
                  Not Now
                </button>
              </div>
            </>
          )}
          
          {requestStatus === 'granted' && (
            <div className="text-center py-4">
              <div className="bg-green-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Bell className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Notifications Enabled!</h3>
              <p className="text-gray-300 mb-4">
                You'll now receive notifications about new episodes and important updates.
              </p>
              <button
                onClick={onClose}
                className="bg-gray-700 text-white py-2 px-6 rounded-lg font-medium hover:bg-gray-600 transition-colors"
              >
                Close
              </button>
            </div>
          )}
          
          {requestStatus === 'denied' && (
            <div className="text-center py-4">
              <div className="bg-red-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Bell className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Notifications Blocked</h3>
              <p className="text-gray-300 mb-4">
                You've blocked notifications for ShortDrama. To enable them, please update your browser settings.
              </p>
              <button
                onClick={onClose}
                className="bg-gray-700 text-white py-2 px-6 rounded-lg font-medium hover:bg-gray-600 transition-colors"
              >
                Close
              </button>
            </div>
          )}
          
          {requestStatus === 'unsupported' && (
            <div className="text-center py-4">
              <div className="bg-yellow-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Bell className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Not Supported</h3>
              <p className="text-gray-300 mb-4">
                Your browser doesn't support notifications. Please try using a different browser.
              </p>
              <button
                onClick={onClose}
                className="bg-gray-700 text-white py-2 px-6 rounded-lg font-medium hover:bg-gray-600 transition-colors"
              >
                Close
              </button>
            </div>
          )}
          
          {requestStatus === 'error' && (
            <div className="text-center py-4">
              <div className="bg-red-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Bell className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Something Went Wrong</h3>
              <p className="text-gray-300 mb-4">
                We couldn't set up notifications. Please try again later.
              </p>
              <button
                onClick={onClose}
                className="bg-gray-700 text-white py-2 px-6 rounded-lg font-medium hover:bg-gray-600 transition-colors"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ProfilePage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [showHelpSupport, setShowHelpSupport] = useState(false);
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  const [showSubscription, setShowSubscription] = useState(false);
  const [showNotificationDialog, setShowNotificationDialog] = useState(false);
  const [username, setUsername] = useState<string>('');
  const { t } = useTranslation();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    // Get username from localStorage or from user object
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    } else if (user?.firstname) {
      setUsername(user.firstname);
    } else if (user?.msisdn) {
      setUsername(user.msisdn);
    } else if (user?.email) {
      setUsername(user.email);
    } else {
      setUsername(t('profile.anonymous'));
    }
  }, [user, t]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Get the primary identifier (phone or email)
  const primaryIdentifier = user?.msisdn || user?.email || t('profile.anonymous');

  const menuItems = [
    { icon: CreditCard, label: t('profile.subscription'), action: () => setShowSubscription(true) },
    { icon: Bell, label: t('profile.notifications'), action: () => setShowNotificationDialog(true) },
    { icon: Languages, label: t('profile.language'), action: () => setShowLanguageSelector(true) },
    { icon: theme === 'dark' ? Sun : Moon, label: t('profile.theme'), action: toggleTheme },
    { icon: Shield, label: t('profile.privacy'), action: () => setShowPrivacyPolicy(true) },
    { icon: HelpCircle, label: t('profile.helpSupport'), action: () => setShowHelpSupport(true) },
  ];

  if (showPrivacyPolicy) {
    return <PrivacyPolicy onClose={() => setShowPrivacyPolicy(false)} />;
  }

  if (showHelpSupport) {
    return <HelpSupport onClose={() => setShowHelpSupport(false)} />;
  }

  if (showLanguageSelector) {
    return <LanguageSelector onClose={() => setShowLanguageSelector(false)} />;
  }

  if (showSubscription) {
    return <SubscriptionView onClose={() => setShowSubscription(false)} />;
  }

  return (
    <div className="min-h-screen bg-[rgb(var(--background))] pb-20">
      <div className="px-4 pt-4 mb-4 flex justify-center">
        <Logo size="medium" />
      </div>
      
      <div className="bg-gradient-to-r from-pink-600 to-purple-600 py-10 px-4">
        <div className="flex items-center">
          <div className="bg-white rounded-full w-20 h-20 flex items-center justify-center">
            <User className="w-10 h-10 text-pink-600" />
          </div>
          <div className="ml-4">
            <h1 className="text-xl font-bold text-white">
              {username}
            </h1>
            <p className="text-white text-opacity-80">
              {primaryIdentifier}
            </p>
            <div className="mt-1 px-2 py-0.5 bg-white/20 text-white text-xs rounded-full inline-block">
              {user?.subscribed ? t('profile.premiumUser') : t('profile.freeUser')}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 px-4">
        <div className="bg-gray-800 rounded-xl overflow-hidden">
          {menuItems.map((item, index) => (
            <React.Fragment key={index}>
              <button 
                className="w-full flex items-center justify-between px-4 py-3.5 text-[rgb(var(--foreground))] hover:bg-gray-700 transition-colors"
                onClick={item.action}
              >
                <div className="flex items-center">
                  <item.icon className="w-5 h-5 text-gray-400 mr-3" />
                  <span>{item.label}</span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-500" />
              </button>
              {index < menuItems.length - 1 && (
                <div className="w-full h-px bg-gray-700 mx-auto" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="mt-8 px-4">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center justify-center py-3 px-4 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium shadow-lg transition-colors"
        >
          <LogOut className="w-5 h-5 mr-2" />
          {t('common.logout')}
        </button>
      </div>

      <div className="mt-8 text-center text-gray-500 text-sm px-4">
        <p>{t('profile.version')} 1.0.0</p>
        <p className="mt-1">{t('profile.copyright')}</p>
      </div>

      {showNotificationDialog && (
        <NotificationPermissionDialog onClose={() => setShowNotificationDialog(false)} />
      )}

      <BottomNavigation />
    </div>
  );
};

export default ProfilePage;