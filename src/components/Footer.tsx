import { Facebook, Instagram, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-[#00063d]/60 border-t border-slate-600/50 py-8 mt-12">
      <div className="container mx-auto px-6">
        <div className="text-center">
          <h3 className="text-white text-lg font-semibold mb-4">
            FOLLOW US ON SOCIAL MEDIA
          </h3>

          <div className="flex justify-center gap-4 mb-6">
            <a
              href="https://x.com/Inmate_insights"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-blue-400 hover:bg-blue-500 flex items-center justify-center transition-all duration-200 hover:scale-110"
              aria-label="Twitter/X"
            >
              <Twitter className="w-5 h-5 text-white" />
            </a>

            <a
              href="https://www.instagram.com/inmateinsights007/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-pink-500 hover:bg-pink-600 flex items-center justify-center transition-all duration-200 hover:scale-110"
              aria-label="Instagram"
            >
              <Instagram className="w-5 h-5 text-white" />
            </a>

            <a
              href="https://www.tiktok.com/@inmateinsights_5?_r=1&_t=ZS-92gSzBToANx"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-black hover:bg-gray-900 flex items-center justify-center transition-all duration-200 hover:scale-110"
              aria-label="TikTok"
            >
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
              </svg>
            </a>

            <a
              href="https://www.facebook.com/profile.php?id=61579922447590"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center transition-all duration-200 hover:scale-110"
              aria-label="Facebook"
            >
              <Facebook className="w-5 h-5 text-white" />
            </a>
          </div>

          <p className="text-slate-400 text-sm pb-12 sm:pb-0">
            © 2026 WA DOC Records. All rights reserved.
            {' | '}
            <Link to="/privacy" className="text-slate-400 hover:text-white transition-colors underline">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
