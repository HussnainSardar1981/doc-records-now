
import React from 'react';
import { Shield, MapPin } from 'lucide-react';
import UserMenu from './UserMenu';

interface HeaderProps {
  selectedState?: string | null;
}

const Header = ({ selectedState = null }: HeaderProps) => {
  console.log('Header rendering with selectedState:', selectedState);
  
  return (
    <header className="bg-slate-900/95 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-50">
      <div className="container mx-auto px-3 sm:px-4 md:px-6 py-3 md:py-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center space-x-2 md:space-x-3 min-w-0 flex-1">
            <Shield className="w-6 h-6 md:w-8 md:h-8 text-blue-400 flex-shrink-0" />
            <div className="min-w-0">
              <h1 className="text-lg md:text-2xl font-bold text-white truncate">Inmate Records</h1>
              <p className="text-slate-300 text-xs md:text-sm hidden sm:block">Official DOC Database</p>
            </div>
          </div>

          <div className="flex items-center space-x-2 md:space-x-4 flex-shrink-0">
            {selectedState && (
              <div className="hidden md:flex items-center space-x-2 text-slate-300">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">{selectedState}</span>
              </div>
            )}
            <UserMenu />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
