import { Facebook, Instagram, Twitter, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Footer = () => {
  const openFeedback = () => {
    window.dispatchEvent(new Event('open-feedback'));
  };

  return (
    <footer className="bg-[#000B2E]/80 border-t border-white/10 py-3 sm:py-4 md:py-8 mt-auto">
      <div className="mx-auto px-3 sm:px-6 max-w-5xl w-full">
        <div className="flex sm:hidden justify-center mb-3">
          <Button
            onClick={openFeedback}
            className="rounded-full bg-[#00063d] hover:bg-[#0a1854] shadow-lg px-5 py-3 h-auto"
            aria-label="Send feedback"
          >
            <MessageSquare className="h-4 w-4 text-white mr-2" />
            <span className="text-white font-medium text-sm">Feedback</span>
          </Button>
        </div>
        <div className="text-center">
          <h3 className="text-white text-sm sm:text-lg font-semibold mb-2 sm:mb-4">
            FOLLOW US ON SOCIAL MEDIA
          </h3>

          <div className="flex justify-center gap-3 sm:gap-4 mb-3 sm:mb-6">
            <a
              href="https://x.com/Inmate_insights"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#1DA1F2] hover:bg-[#1a8cd8] flex items-center justify-center transition-all duration-200 hover:scale-110"
              aria-label="Twitter/X"
            >
              <Twitter className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </a>

            <a
              href="https://www.instagram.com/inmateinsights007/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 hover:opacity-90 flex items-center justify-center transition-all duration-200 hover:scale-110"
              aria-label="Instagram"
            >
              <Instagram className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </a>

            <a
              href="https://www.tiktok.com/@inmateinsights_5?_r=1&_t=ZS-92gSzBToANx"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black hover:bg-gray-900 flex items-center justify-center transition-all duration-200 hover:scale-110"
              aria-label="TikTok"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
              </svg>
            </a>

            <a
              href="https://www.facebook.com/profile.php?id=61579922447590"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#1877F2] hover:bg-[#166FE5] flex items-center justify-center transition-all duration-200 hover:scale-110"
              aria-label="Facebook"
            >
              <Facebook className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </a>
          </div>

          <p className="text-gray-400 text-xs sm:text-sm pb-0">
            © 2026 Inmate Insights. All rights reserved.
            {' | '}
            <Link to="/privacy" className="text-gray-400 hover:text-white transition-colors underline">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
