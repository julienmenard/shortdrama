import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { AtSign, Smartphone, Lock, ArrowRight } from 'lucide-react';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

type LoginMethod = 'email' | 'phone';

const LoginForm: React.FC = () => {
  const { login, isLoading, error } = useAuth();
  const [loginMethod, setLoginMethod] = useState<LoginMethod>('phone');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const identifier = loginMethod === 'email' ? email : phoneNumber;
    await login(identifier, password);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-gray-900 rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
        Log In to ShortDrama
      </h2>
      
      <div className="flex mb-6 bg-gray-800 rounded-xl p-1">
        <button
          type="button"
          className={`flex-1 py-2 rounded-lg text-center transition-all ${
            loginMethod === 'phone' 
              ? 'bg-pink-600 text-white' 
              : 'text-gray-400 hover:text-gray-200'
          }`}
          onClick={() => setLoginMethod('phone')}
        >
          <Smartphone className="h-4 w-4 inline mr-1" />
          Phone
        </button>
        <button
          type="button"
          className={`flex-1 py-2 rounded-lg text-center transition-all ${
            loginMethod === 'email' 
              ? 'bg-pink-600 text-white' 
              : 'text-gray-400 hover:text-gray-200'
          }`}
          onClick={() => setLoginMethod('email')}
        >
          <AtSign className="h-4 w-4 inline mr-1" />
          Email
        </button>
      </div>
      
      {error && (
        <div className="mb-4 p-3 bg-red-900/50 border border-red-600 rounded-lg text-red-300 text-sm">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {loginMethod === 'email' ? (
          <div className="relative">
            <AtSign className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className="w-full pl-10 pr-4 py-3 bg-gray-800 rounded-xl focus:ring-2 focus:ring-pink-500 focus:outline-none"
              required
            />
          </div>
        ) : (
          <div className="phone-input-container">
            <style jsx>{`
              .PhoneInput {
                background-color: #1f2937;
                border-radius: 0.75rem;
                padding: 0.5rem 1rem;
                display: flex;
                align-items: center;
              }
              .PhoneInputCountry {
                margin-right: 0.75rem;
              }
              .PhoneInputInput {
                flex: 1;
                background-color: transparent;
                border: none;
                color: white;
                padding: 0.5rem 0;
                outline: none;
              }
              .PhoneInputInput::placeholder {
                color: #9ca3af;
              }
            `}</style>
            <PhoneInput
              international
              countryCallingCodeEditable={false}
              defaultCountry="US"
              value={phoneNumber}
              onChange={(value) => setPhoneNumber(value || '')}
              placeholder="Phone number"
            />
          </div>
        )}
        
        <div className="relative">
          <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full pl-10 pr-4 py-3 bg-gray-800 rounded-xl focus:ring-2 focus:ring-pink-500 focus:outline-none"
            required
          />
        </div>
        
        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full flex items-center justify-center py-3 px-4 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-xl font-medium shadow-lg hover:from-pink-700 hover:to-purple-700 transition-all ${
              isLoading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? (
              <span className="inline-block h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
            ) : null}
            {isLoading ? 'Logging in...' : 'Log In'}
            {!isLoading && <ArrowRight className="ml-2 h-5 w-5" />}
          </button>
        </div>
        
        <div className="text-center mt-4 text-gray-400 text-sm">
          <p>Don't have an account? <a href="#" className="text-pink-500 hover:text-pink-400">Sign Up</a></p>
          <p className="mt-2">
            <a href="#" className="text-gray-400 hover:text-gray-300">Forgot password?</a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;