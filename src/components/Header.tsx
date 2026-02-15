
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { MapPin, ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';
import UserMenu from './UserMenu';

interface HeaderProps {
  selectedState?: string | null;
}

const Header = ({ selectedState = null }: HeaderProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const showBackButton = location.pathname === '/my-records' || location.pathname === '/results';

  return (
    <header className="bg-[#000B2E]/80 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
      <div className="mx-auto px-2 sm:px-4 md:px-6 max-w-5xl w-full py-2 sm:py-3 md:py-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center space-x-2 md:space-x-3 min-w-0 flex-1">
            {showBackButton && (
              <Button
                onClick={() => navigate('/')}
                variant="ghost"
                size="sm"
                className="text-gray-300 hover:text-white hover:bg-white/10"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Search
              </Button>
            )}
            <Link to="/" className="cursor-pointer">
              <div className="border-2 border-[#000B2E] bg-white p-1">
                <div className="flex items-center gap-0">
                  <div className="bg-[#000B2E] px-3 py-1.5 md:px-4 md:py-2 border-r border-[#000B2E]">
                    <span className="text-white font-bold text-sm md:text-base tracking-wide">INMATE</span>
                  </div>
                  <div className="bg-white px-3 py-1.5 md:px-4 md:py-2">
                    <span className="text-black font-bold text-sm md:text-base tracking-wide">INSIGHTS</span>
                  </div>
                </div>
              </div>
            </Link>
          </div>

          <div className="flex items-center space-x-2 md:space-x-4 flex-shrink-0">
            {selectedState && (
              <div className="hidden md:flex items-center space-x-2 text-gray-300">
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
