
import { Link } from 'react-router-dom';
import Footer from '@/components/Footer';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#00063d] to-[#0a1854] flex flex-col">
      <div className="flex-1 container mx-auto px-6 py-12 max-w-3xl">
        <Link to="/" className="text-slate-300 hover:text-white font-medium mb-8 block">
          &larr; Back to Home
        </Link>

        <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700/50 rounded-2xl p-8 shadow-2xl">
          <h1 className="text-3xl font-bold text-white mb-2">Privacy Policy</h1>
          <p className="text-slate-400 text-sm mb-8">Last updated: February 10, 2026</p>

          <div className="space-y-6 text-slate-300 leading-relaxed">
            <section>
              <h2 className="text-xl font-semibold text-white mb-3">1. Information We Collect</h2>
              <p>When you use Inmate Insights (WA DOC Records), we may collect the following information:</p>
              <ul className="list-disc list-inside mt-2 space-y-1 text-slate-400">
                <li>Account information (name, email address) when you sign up</li>
                <li>Authentication data when you sign in via Google or Facebook</li>
                <li>Payment information processed securely through Stripe</li>
                <li>Search queries and record requests you make on the platform</li>
                <li>Feedback and communications you send to us</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">2. How We Use Your Information</h2>
              <p>We use the collected information to:</p>
              <ul className="list-disc list-inside mt-2 space-y-1 text-slate-400">
                <li>Provide and maintain our services</li>
                <li>Process your record requests and payments</li>
                <li>Send you order confirmations and updates via email</li>
                <li>Improve our website and user experience</li>
                <li>Respond to your feedback and support requests</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">3. Third-Party Services</h2>
              <p>We use the following third-party services:</p>
              <ul className="list-disc list-inside mt-2 space-y-1 text-slate-400">
                <li><strong className="text-slate-300">Supabase</strong> - for authentication and data storage</li>
                <li><strong className="text-slate-300">Stripe</strong> - for secure payment processing</li>
                <li><strong className="text-slate-300">Google OAuth</strong> - for social sign-in</li>
                <li><strong className="text-slate-300">Facebook OAuth</strong> - for social sign-in</li>
                <li><strong className="text-slate-300">Meta Pixel & TikTok Pixel</strong> - for analytics and advertising</li>
              </ul>
              <p className="mt-2">These services have their own privacy policies governing the use of your information.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">4. Data Security</h2>
              <p>
                We implement appropriate security measures to protect your personal information.
                All data is transmitted over encrypted connections (HTTPS). Payment information is
                handled directly by Stripe and is never stored on our servers.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">5. Cookies and Tracking</h2>
              <p>
                We use cookies and similar tracking technologies (Meta Pixel, TikTok Pixel) to
                analyze website traffic and improve our services. You can control cookie preferences
                through your browser settings.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">6. Your Rights</h2>
              <p>You have the right to:</p>
              <ul className="list-disc list-inside mt-2 space-y-1 text-slate-400">
                <li>Access the personal data we hold about you</li>
                <li>Request correction of inaccurate data</li>
                <li>Request deletion of your account and data</li>
                <li>Opt out of marketing communications</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">7. Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, please contact us at{' '}
                <a href="mailto:Inmateinsights5@gmail.com" className="text-blue-400 hover:text-blue-300 underline">
                  Inmateinsights5@gmail.com
                </a>
              </p>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
