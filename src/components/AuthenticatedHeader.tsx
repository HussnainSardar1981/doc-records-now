
import React from 'react';
import UserMenu from './UserMenu';

const AuthenticatedHeader = () => {
  return (
    <header className="bg-slate-900/95 backdrop-blur-sm border-b border-slate-700/50 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">PI</span>
            </div>
            <h1 className="text-xl font-bold text-white">Prison Inmate Search</h1>
          </div>
          
          <UserMenu />
        </div>
      </div>
    </header>
  );
};

export default AuthenticatedHeader;
