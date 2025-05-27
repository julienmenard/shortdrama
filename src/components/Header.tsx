import React from 'react';
import { Film } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-gray-800 py-4 shadow-lg sticky top-0 z-10">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Film className="h-8 w-8 text-purple-500" />
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">StreamFlix</h1>
        </div>
        <nav>
          <ul className="flex space-x-6">
            <li><a href="#" className="hover:text-purple-400 transition-colors">Home</a></li>
            <li><a href="#" className="hover:text-purple-400 transition-colors">Series</a></li>
            <li><a href="#" className="hover:text-purple-400 transition-colors">Movies</a></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;