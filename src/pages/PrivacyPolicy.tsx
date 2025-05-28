import React from 'react';
import { ChevronLeft } from 'lucide-react';

interface PrivacyPolicyProps {
  onClose: () => void;
}

const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ onClose }) => {
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
            Privacy Policy
          </h2>
        </div>
      </div>

      <div className="p-4 space-y-6">
        <section className="space-y-3">
          <h3 className="text-lg font-semibold text-[rgb(var(--foreground))]">Introduction</h3>
          <p className="text-gray-400">
            ShortDrama ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and share your personal information when you use our mobile application and services.
          </p>
        </section>

        <section className="space-y-3">
          <h3 className="text-lg font-semibold text-[rgb(var(--foreground))]">Information We Collect</h3>
          <p className="text-gray-400">
            We collect information you provide directly to us, such as when you create an account, subscribe to our service, or contact customer support. This information may include:
          </p>
          <ul className="list-disc pl-5 text-gray-400 space-y-2">
            <li>Name, email address, and phone number</li>
            <li>Payment information (processed securely through our payment providers)</li>
            <li>Account preferences and settings</li>
            <li>Content you view, search queries, and watch history</li>
            <li>Communications with us</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h3 className="text-lg font-semibold text-[rgb(var(--foreground))]">How We Use Your Information</h3>
          <p className="text-gray-400">
            We use the information we collect to:
          </p>
          <ul className="list-disc pl-5 text-gray-400 space-y-2">
            <li>Provide, maintain, and improve our services</li>
            <li>Process transactions and send related information</li>
            <li>Send you technical notices, updates, and support messages</li>
            <li>Respond to your comments and questions</li>
            <li>Personalize your experience and provide content recommendations</li>
            <li>Monitor and analyze trends and usage of our services</li>
            <li>Detect, investigate, and prevent fraudulent transactions and other illegal activities</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h3 className="text-lg font-semibold text-[rgb(var(--foreground))]">Sharing of Information</h3>
          <p className="text-gray-400">
            We may share your information with:
          </p>
          <ul className="list-disc pl-5 text-gray-400 space-y-2">
            <li>Service providers that perform services on our behalf</li>
            <li>Business partners with whom we jointly offer products or services</li>
            <li>Law enforcement or other third parties as required by law</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h3 className="text-lg font-semibold text-[rgb(var(--foreground))]">Your Choices</h3>
          <p className="text-gray-400">
            You can access and update certain information through your account settings. You may also:
          </p>
          <ul className="list-disc pl-5 text-gray-400 space-y-2">
            <li>Opt out of receiving promotional communications</li>
            <li>Set your browser to refuse cookies</li>
            <li>Request deletion of your account</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h3 className="text-lg font-semibold text-[rgb(var(--foreground))]">Contact Us</h3>
          <p className="text-gray-400">
            If you have any questions about this Privacy Policy, please contact us at privacy@shortdrama.com.
          </p>
        </section>

        <div className="pt-4 text-center text-gray-500 text-sm">
          <p>Last Updated: May 15, 2025</p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;