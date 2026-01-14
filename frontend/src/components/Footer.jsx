import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black text-white py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link
              to="/"
              className="font-playfair text-2xl text-white no-underline"
            >
              Replace<span className="text-crimson">able</span>.ai
            </Link>
            <p className="font-crimson text-titanium mt-4 max-w-md">
              Tracking the AI workforce revolution. Daily intelligence on
              automation, job displacement, and the future of work.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-inter text-xs font-semibold uppercase tracking-wider text-mist mb-4">
              Navigation
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="font-inter text-sm text-titanium hover:text-white transition-colors"
                >
                  News
                </Link>
              </li>
              <li>
                <Link
                  to="/reports"
                  className="font-inter text-sm text-titanium hover:text-white transition-colors"
                >
                  Reports
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-inter text-xs font-semibold uppercase tracking-wider text-mist mb-4">
              Platform
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/login"
                  className="font-inter text-sm text-titanium hover:text-white transition-colors"
                >
                  Admin Login
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-inter text-xs text-mist">
            © {currentYear} Replaceable.ai. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span className="font-inter text-xs text-green-500">
              System Operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
