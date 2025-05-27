import React from 'react';
import { ChevronLeft, Apple, Smartphone, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface SubscriptionViewProps {
  onClose: () => void;
}

const SubscriptionView: React.FC<SubscriptionViewProps> = ({ onClose }) => {
  const { t } = useTranslation();

  const features = [
    t('subscription.features.adFree'),
    t('subscription.features.offline'),
    t('subscription.features.quality'),
    t('subscription.features.multiDevice'),
    t('subscription.features.earlyAccess'),
    t('subscription.features.exclusive')
  ];

  const handleAppStore = () => {
    window.location.href = 'https://apps.apple.com/app/shortdrama';
  };

  const handleGooglePlay = () => {
    window.location.href = 'https://play.google.com/store/apps/details?id=com.shortdrama';
  };

  return (
    <div className="min-h-screen bg-[rgb(var(--background))] pb-20">
      <div className="sticky top-0 z-10 bg-[rgb(var(--background))] border-b border-gray-800">
        <div className="px-4 py-4 flex items-center">
          <button 
            onClick={onClose}
            className="mr-3 p-2 hover:bg-gray-800 rounded-full transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-[rgb(var(--foreground))]" />
          </button>
          <h2 className="text-xl font-bold text-[rgb(var(--foreground))]">
            {t('subscription.title')}
          </h2>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Premium Features */}
        <div className="bg-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            {t('subscription.premiumFeatures')}
          </h3>
          <ul className="space-y-3">
            {features.map((feature, index) => (
              <li key={index} className="flex items-center text-gray-300">
                <Check className="w-5 h-5 text-pink-500 mr-2" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Subscription Options */}
        <div className="space-y-4">
          {/* App Store */}
          <button
            onClick={handleAppStore}
            className="w-full bg-gray-800 rounded-xl p-4 flex items-center justify-between hover:bg-gray-700 transition-colors"
          >
            <div className="flex items-center">
              <div className="bg-black p-3 rounded-xl">
                <Apple className="w-8 h-8 text-white" />
              </div>
              <div className="ml-4 text-left">
                <h4 className="text-white font-medium">{t('subscription.appStore')}</h4>
                <p className="text-gray-400 text-sm">{t('subscription.viaApple')}</p>
              </div>
            </div>
            <ChevronLeft className="w-6 h-6 text-gray-400 transform rotate-180" />
          </button>

          {/* Google Play */}
          <button
            onClick={handleGooglePlay}
            className="w-full bg-gray-800 rounded-xl p-4 flex items-center justify-between hover:bg-gray-700 transition-colors"
          >
            <div className="flex items-center">
              <div className="bg-black p-3 rounded-xl">
                <Smartphone className="w-8 h-8 text-white" />
              </div>
              <div className="ml-4 text-left">
                <h4 className="text-white font-medium">{t('subscription.googlePlay')}</h4>
                <p className="text-gray-400 text-sm">{t('subscription.viaAndroid')}</p>
              </div>
            </div>
            <ChevronLeft className="w-6 h-6 text-gray-400 transform rotate-180" />
          </button>
        </div>

        {/* Terms */}
        <p className="text-center text-gray-400 text-sm px-6">
          {t('subscription.terms')}
        </p>
      </div>
    </div>
  );
};

export default SubscriptionView;