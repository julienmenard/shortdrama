import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Film, Play, CheckCircle, X, ArrowRight, Instagram, Facebook, Twitter } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState('');
  
  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <header className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-pink-600/50 to-purple-900/50 z-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black z-10" />
        <img 
          src="https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
          alt="Drama Series" 
          className="w-full h-screen object-cover"
        />
        
        <div className="absolute top-0 left-0 right-0 z-20 p-4">
          <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Film className="h-8 w-8 text-pink-500" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-purple-500 bg-clip-text text-transparent">ShortDrama</h1>
            </div>
            <div className="hidden md:flex space-x-8 items-center">
              <a href="#features" className="hover:text-pink-400 transition-colors">Features</a>
              <a href="#pricing" className="hover:text-pink-400 transition-colors">Pricing</a>
              <a href="#faqs" className="hover:text-pink-400 transition-colors">FAQs</a>
              <button 
                onClick={() => navigate('/login')}
                className="px-4 py-2 rounded-full bg-white text-pink-600 font-medium hover:bg-pink-100 transition-colors"
              >
                Log In
              </button>
            </div>
          </div>
        </div>
        
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl md:text-6xl font-bold mb-4">Stream Addictive Short Dramas</h2>
            <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto text-gray-200">
              Immerse yourself in captivating stories that fit perfectly into your busy life. Bite-sized drama, maximum emotion.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button 
                onClick={() => navigate('/login')}
                className="px-6 py-3 rounded-full bg-pink-600 font-medium hover:bg-pink-700 transition-colors flex items-center justify-center"
              >
                <Play className="w-5 h-5 mr-2" fill="white" />
                Start Watching Now
              </button>
              <button 
                onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-6 py-3 rounded-full bg-transparent border border-white font-medium hover:bg-white/10 transition-colors"
              >
                View Plans
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Why Choose ShortDrama?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="bg-gray-800 rounded-xl p-6 transform transition-transform hover:scale-105">
              <div className="bg-pink-600 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <Film className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">Short-form Drama</h3>
              <p className="text-gray-300">
                Perfect 10-15 minute episodes designed to fit into your busy schedule.
              </p>
            </div>
            
            <div className="bg-gray-800 rounded-xl p-6 transform transition-transform hover:scale-105">
              <div className="bg-purple-600 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">Ad-Free Experience</h3>
              <p className="text-gray-300">
                Enjoy uninterrupted viewing with no ads or commercials.
              </p>
            </div>
            
            <div className="bg-gray-800 rounded-xl p-6 transform transition-transform hover:scale-105">
              <div className="bg-pink-600 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">High-Quality Content</h3>
              <p className="text-gray-300">
                Premium production quality with captivating storylines.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Content Preview */}
      <section className="py-20 bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">Trending Shows</h2>
          <p className="text-center text-gray-300 max-w-2xl mx-auto mb-12">
            Discover the hottest short dramas that everyone is talking about
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="relative group overflow-hidden rounded-xl">
              <img 
                src="https://images.pexels.com/photos/7149165/pexels-photo-7149165.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                alt="Drama 1" 
                className="w-full aspect-[3/4] object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                <div className="p-4">
                  <h3 className="font-bold">Hollywood Star's Fake Girlfriend</h3>
                  <p className="text-sm text-gray-300">Season 1</p>
                </div>
              </div>
            </div>
            
            <div className="relative group overflow-hidden rounded-xl">
              <img 
                src="https://images.pexels.com/photos/8108063/pexels-photo-8108063.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                alt="Drama 2" 
                className="w-full aspect-[3/4] object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                <div className="p-4">
                  <h3 className="font-bold">Mafia Lord's Son</h3>
                  <p className="text-sm text-gray-300">Season 1</p>
                </div>
              </div>
            </div>
            
            <div className="relative group overflow-hidden rounded-xl">
              <img 
                src="https://images.pexels.com/photos/5384445/pexels-photo-5384445.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                alt="Drama 3" 
                className="w-full aspect-[3/4] object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                <div className="p-4">
                  <h3 className="font-bold">Hidden Identity</h3>
                  <p className="text-sm text-gray-300">Season 2</p>
                </div>
              </div>
            </div>
            
            <div className="relative group overflow-hidden rounded-xl">
              <img 
                src="https://images.pexels.com/photos/5876695/pexels-photo-5876695.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                alt="Drama 4" 
                className="w-full aspect-[3/4] object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                <div className="p-4">
                  <h3 className="font-bold">Secret Love</h3>
                  <p className="text-sm text-gray-300">Season 1</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-black">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Simple, Affordable Pricing</h2>
          <p className="text-center text-gray-300 max-w-2xl mx-auto mb-12">
            Choose the plan that works for you
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-gray-800 rounded-2xl overflow-hidden border border-gray-700">
              <div className="p-6 border-b border-gray-700">
                <h3 className="text-xl font-bold">Free Plan</h3>
                <div className="mt-4 flex items-baseline">
                  <span className="text-4xl font-extrabold">$0</span>
                  <span className="ml-1 text-gray-400">/month</span>
                </div>
              </div>
              <div className="p-6">
                <ul className="space-y-4">
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-pink-500 mr-2" />
                    <span>Standard quality streaming</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-pink-500 mr-2" />
                    <span>Ad-supported viewing</span>
                  </li>
                  <li className="flex items-center opacity-50">
                    <X className="w-5 h-5 text-gray-400 mr-2" />
                    <span>Limited catalog access</span>
                  </li>
                  <li className="flex items-center opacity-50">
                    <X className="w-5 h-5 text-gray-400 mr-2" />
                    <span>No offline viewing</span>
                  </li>
                </ul>
                <button
                  className="w-full mt-8 px-4 py-3 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors font-medium"
                  onClick={() => navigate('/login')}
                >
                  Get Started
                </button>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-pink-600 to-purple-700 rounded-2xl overflow-hidden transform scale-105 shadow-xl relative">
              <div className="absolute top-0 right-0 bg-white text-pink-600 text-xs font-bold px-3 py-1 rounded-bl-lg">
                POPULAR
              </div>
              <div className="p-6 border-b border-pink-500/30">
                <h3 className="text-xl font-bold">Premium</h3>
                <div className="mt-4 flex items-baseline">
                  <span className="text-4xl font-extrabold">$7.99</span>
                  <span className="ml-1 text-pink-200">/month</span>
                </div>
              </div>
              <div className="p-6">
                <ul className="space-y-4">
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-white mr-2" />
                    <span>HD streaming</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-white mr-2" />
                    <span>Ad-free experience</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-white mr-2" />
                    <span>Full catalog access</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-white mr-2" />
                    <span>Download for offline viewing</span>
                  </li>
                </ul>
                <button
                  className="w-full mt-8 px-4 py-3 rounded-lg bg-white text-pink-600 hover:bg-pink-100 transition-colors font-medium"
                  onClick={handleSubscribe}
                >
                  Subscribe Now
                </button>
              </div>
            </div>
            
            <div className="bg-gray-800 rounded-2xl overflow-hidden border border-gray-700">
              <div className="p-6 border-b border-gray-700">
                <h3 className="text-xl font-bold">Family Plan</h3>
                <div className="mt-4 flex items-baseline">
                  <span className="text-4xl font-extrabold">$12.99</span>
                  <span className="ml-1 text-gray-400">/month</span>
                </div>
              </div>
              <div className="p-6">
                <ul className="space-y-4">
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-pink-500 mr-2" />
                    <span>4K Ultra HD streaming</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-pink-500 mr-2" />
                    <span>Ad-free experience</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-pink-500 mr-2" />
                    <span>Full catalog access</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-pink-500 mr-2" />
                    <span>Up to 5 profiles</span>
                  </li>
                </ul>
                <button
                  className="w-full mt-8 px-4 py-3 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors font-medium"
                  onClick={handleSubscribe}
                >
                  Subscribe Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section id="faqs" className="py-20 bg-gradient-to-b from-gray-900 to-black">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Frequently Asked Questions</h2>
          
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-bold mb-2">What is ShortDrama?</h3>
              <p className="text-gray-300">
                ShortDrama is a streaming platform dedicated to short-form drama series. Our content is specifically designed to deliver compelling stories in 10-15 minute episodes.
              </p>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-bold mb-2">Can I watch ShortDrama on multiple devices?</h3>
              <p className="text-gray-300">
                Yes! You can stream ShortDrama on your smartphone, tablet, computer, or smart TV. Our premium plans allow multiple devices to stream simultaneously.
              </p>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-bold mb-2">How often is new content added?</h3>
              <p className="text-gray-300">
                We release new episodes and series every week. Premium subscribers get early access to new content before it's available to free users.
              </p>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-bold mb-2">Can I cancel my subscription anytime?</h3>
              <p className="text-gray-300">
                Absolutely! There are no contracts or commitments. You can cancel your subscription at any time, and your account will remain active until the end of your billing period.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-pink-600 to-purple-700">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Start Watching?</h2>
          <p className="text-xl max-w-2xl mx-auto mb-8">
            Join millions of viewers enjoying short, captivating dramas that fit perfectly into your busy schedule.
          </p>
          <form className="max-w-md mx-auto flex flex-col sm:flex-row gap-2" onSubmit={handleSubscribe}>
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="flex-1 px-4 py-3 rounded-full text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-300"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button 
              type="submit"
              className="px-6 py-3 rounded-full bg-black text-white font-medium hover:bg-gray-900 transition-colors flex items-center justify-center"
            >
              Get Started
              <ArrowRight className="ml-2 w-5 h-5" />
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Film className="h-8 w-8 text-pink-500" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-purple-500 bg-clip-text text-transparent">ShortDrama</h1>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-pink-500 transition-colors">
                <Instagram className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-pink-500 transition-colors">
                <Facebook className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-pink-500 transition-colors">
                <Twitter className="w-6 h-6" />
              </a>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-gray-300 font-bold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-500 hover:text-pink-400 transition-colors">About Us</a></li>
                <li><a href="#" className="text-gray-500 hover:text-pink-400 transition-colors">Careers</a></li>
                <li><a href="#" className="text-gray-500 hover:text-pink-400 transition-colors">Press</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-gray-300 font-bold mb-4">Support</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-500 hover:text-pink-400 transition-colors">Help Center</a></li>
                <li><a href="#" className="text-gray-500 hover:text-pink-400 transition-colors">Contact Us</a></li>
                <li><a href="#" className="text-gray-500 hover:text-pink-400 transition-colors">Device Support</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-gray-300 font-bold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-500 hover:text-pink-400 transition-colors">Terms of Service</a></li>
                <li><a href="#" className="text-gray-500 hover:text-pink-400 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-500 hover:text-pink-400 transition-colors">Cookie Preferences</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-gray-300 font-bold mb-4">Download</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-500 hover:text-pink-400 transition-colors">iOS App</a></li>
                <li><a href="#" className="text-gray-500 hover:text-pink-400 transition-colors">Android App</a></li>
                <li><a href="#" className="text-gray-500 hover:text-pink-400 transition-colors">Smart TV App</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center text-gray-500 text-sm">
            <p>© 2025 ShortDrama. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Subscribe Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-2xl max-w-md w-full p-6 relative animate-fade-in">
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="text-center mb-6">
              <div className="bg-pink-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Thank You!</h3>
              <p className="text-gray-300">
                This is a demo app. In a real application, you would now be subscribed to ShortDrama Premium.
              </p>
            </div>
            
            <button 
              onClick={() => navigate('/login')}
              className="w-full px-4 py-3 rounded-lg bg-pink-600 hover:bg-pink-700 transition-colors font-medium"
            >
              Continue to Log In
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;