import React from 'react';
import { Link } from 'react-router-dom';
import LoginForm from '../components/LoginForm';
import Logo from '../components/Logo';

const LoginPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex flex-col items-center p-6">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-10 pt-8">
          <Logo size="large" />
        </div>
        
        <LoginForm />
        
        <p className="text-center mt-12 text-gray-500 text-xs px-8">
          By continuing, you agree to ShortDrama's{' '}
          <a href="/terms" className="text-pink-500 hover:text-pink-400 underline">
            Terms of Service
          </a>{' '}
          and acknowledge that you've read our{' '}
          <a href="/privacy" className="text-pink-500 hover:text-pink-400 underline">
            Privacy Policy
          </a>
        </p>
        
        <div className="text-center mt-6">
          <p className="text-gray-400 text-sm">
            New to ShortDrama?{' '}
            <Link to="/landing" className="text-pink-500 hover:text-pink-400">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;