import React from 'react';
import { ChevronLeft, HelpCircle, MessageCircle, Smartphone, Mail, FileText, Link } from 'lucide-react';

interface HelpSupportProps {
  onClose: () => void;
}

const HelpSupport: React.FC<HelpSupportProps> = ({ onClose }) => {
  const faqItems = [
    {
      question: "How do I cancel my subscription?",
      answer: "You can cancel your subscription anytime by going to Profile > Subscription > Cancel Subscription. Your subscription will remain active until the end of your current billing period."
    },
    {
      question: "Can I download videos for offline viewing?",
      answer: "Yes, premium subscribers can download videos for offline viewing. Look for the download icon next to the video you want to save for offline viewing."
    },
    {
      question: "Why am I experiencing buffering issues?",
      answer: "Buffering can occur due to slow internet connections. Try connecting to a stronger Wi-Fi network or reducing the video quality in the player settings."
    },
    {
      question: "How do I report inappropriate content?",
      answer: "You can report inappropriate content by tapping the three dots next to the video and selecting 'Report'. Please provide as much detail as possible about your concern."
    },
    {
      question: "Can I watch ShortDrama on multiple devices?",
      answer: "Yes, you can watch ShortDrama on multiple devices with the same account. Premium subscribers can stream on up to 3 devices simultaneously."
    }
  ];

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
            Help & Support
          </h2>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Contact Options */}
        <div className="bg-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Contact Us</h3>
          <div className="space-y-4">
            <a href="mailto:support@shortdrama.com" className="flex items-center p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors">
              <div className="bg-pink-600 p-2 rounded-full mr-3">
                <Mail className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-medium text-white">Email Support</p>
                <p className="text-sm text-gray-300">support@shortdrama.com</p>
              </div>
            </a>
            
            <a href="tel:+18005551234" className="flex items-center p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors">
              <div className="bg-green-600 p-2 rounded-full mr-3">
                <Smartphone className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-medium text-white">Call Us</p>
                <p className="text-sm text-gray-300">+1 (800) 555-1234</p>
              </div>
            </a>
            
            <a href="#" className="flex items-center p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors">
              <div className="bg-blue-600 p-2 rounded-full mr-3">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-medium text-white">Live Chat</p>
                <p className="text-sm text-gray-300">Available 24/7</p>
              </div>
            </a>
          </div>
        </div>

        {/* FAQs */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-[rgb(var(--foreground))]">Frequently Asked Questions</h3>
          
          {faqItems.map((item, index) => (
            <div key={index} className="bg-gray-800 rounded-lg p-4">
              <div className="flex items-start">
                <HelpCircle className="w-5 h-5 text-pink-500 flex-shrink-0 mt-0.5 mr-2" />
                <div>
                  <h4 className="font-medium text-white mb-2">{item.question}</h4>
                  <p className="text-gray-400 text-sm">{item.answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Resources */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-[rgb(var(--foreground))]">Additional Resources</h3>
          
          <a href="#" className="flex items-center justify-between p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
            <div className="flex items-center">
              <FileText className="w-5 h-5 text-pink-500 mr-3" />
              <span className="text-white">User Guide</span>
            </div>
            <Link className="w-4 h-4 text-gray-400" />
          </a>
          
          <a href="#" className="flex items-center justify-between p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
            <div className="flex items-center">
              <FileText className="w-5 h-5 text-pink-500 mr-3" />
              <span className="text-white">Billing & Subscription FAQ</span>
            </div>
            <Link className="w-4 h-4 text-gray-400" />
          </a>
          
          <a href="#" className="flex items-center justify-between p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
            <div className="flex items-center">
              <FileText className="w-5 h-5 text-pink-500 mr-3" />
              <span className="text-white">Device Compatibility</span>
            </div>
            <Link className="w-4 h-4 text-gray-400" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default HelpSupport;