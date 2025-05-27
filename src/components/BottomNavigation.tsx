import React from 'react';
import { Home, Search, Bookmark, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const BottomNavigation = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const navItems = [
    {
      name: 'Home',
      path: '/',
      icon: Home
    },
    {
      name: 'For you',
      path: '/for-you',
      icon: Search
    },
    {
      name: 'My list',
      path: '/my-list',
      icon: Bookmark
    },
    {
      name: 'Profile',
      path: '/profile',
      icon: User
    }
  ];
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black bg-opacity-95 border-t border-gray-800 px-2 py-2">
      <nav className="flex justify-around">
        {navItems.map(item => (
          <Link 
            key={item.name} 
            to={item.path} 
            className={`flex flex-col items-center px-3 py-2 rounded-lg ${
              isActive(item.path) 
                ? 'text-pink-500' 
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            <item.icon className="h-6 w-6" />
            <span className="text-xs mt-1">{item.name}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default BottomNavigation;