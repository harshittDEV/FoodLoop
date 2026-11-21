import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, User, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ROLE_LABELS, isDonorRole } from '../../utils/constants';

export default function Navbar() {
  const { user, isAuthenticated, signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;
  const linkClass = (path) =>
    `font-medium transition-colors duration-200 ${
      isActive(path) ? 'text-terracotta' : 'text-green-deep hover:text-green-primary'
    }`;

  const handleSignOut = () => {
    signOut();
    setProfileOpen(false);
    navigate('/');
  };

  return (
    <nav className="bg-white/90 backdrop-blur-sm border-b border-green-pale sticky top-0 z-40" role="navigation" aria-label="Main navigation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 group" aria-label="FoodLoop home">
            <div className="w-8 h-8 bg-green-primary rounded-lg flex items-center justify-center group-hover:bg-green-deep transition-colors">
              <span className="text-cream font-bold text-lg">F</span>
            </div>
            <span className="text-xl font-bold text-green-deep">
              Food<span className="text-green-primary">Loop</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link to="/browse" className={linkClass('/browse')}>Find Food</Link>
            <Link to="/how-it-works" className={linkClass('/how-it-works')}>How It Works</Link>
            <Link to="/safety" className={linkClass('/safety')}>Safety</Link>
            <Link to="/contact" className={linkClass('/contact')}>Contact</Link>
          </div>

          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(v => !v)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-green-pale/50 transition-colors"
                  aria-expanded={profileOpen}
                  aria-haspopup="true"
                >
                  <div className="w-8 h-8 bg-green-muted rounded-full flex items-center justify-center">
                    <User size={16} className="text-cream" />
                  </div>
                  <span className="text-sm font-medium text-green-deep max-w-[120px] truncate">{user.name}</span>
                  <ChevronDown size={14} className="text-warm-gray" />
                </button>
                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-green-pale py-2 z-50">
                    <div className="px-4 py-3 border-b border-green-pale">
                      <p className="text-sm font-semibold text-green-deep">{user.name}</p>
                      <p className="text-xs text-warm-gray">{ROLE_LABELS[user.role]}</p>
                    </div>
                    <Link
                      to="/dashboard"
                      onClick={() => setProfileOpen(false)}
                      className="block px-4 py-2.5 text-sm text-green-deep hover:bg-green-pale/50 transition-colors"
                    >
                      Dashboard
                    </Link>
                    {isDonorRole(user.role) && (
                      <Link
                        to="/create"
                        onClick={() => setProfileOpen(false)}
                        className="block px-4 py-2.5 text-sm text-green-deep hover:bg-green-pale/50 transition-colors"
                      >
                        Share Food
                      </Link>
                    )}
                    <button
                      onClick={handleSignOut}
                      className="w-full text-left px-4 py-2.5 text-sm text-danger hover:bg-danger/5 transition-colors flex items-center gap-2"
                    >
                      <LogOut size={14} /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/signin" className="btn-secondary text-sm !px-4 !py-2">Sign In</Link>
                <Link to="/signup" className="btn-primary text-sm !px-4 !py-2">Get Started</Link>
              </>
            )}
          </div>

          <button
            className="md:hidden p-2 rounded-lg hover:bg-green-pale/50 transition-colors"
            onClick={() => setMobileOpen(v => !v)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-green-pale">
          <div className="px-4 py-4 space-y-3">
            <Link to="/browse" className="block py-2 font-medium text-green-deep" onClick={() => setMobileOpen(false)}>Find Food</Link>
            <Link to="/how-it-works" className="block py-2 font-medium text-green-deep" onClick={() => setMobileOpen(false)}>How It Works</Link>
            <Link to="/safety" className="block py-2 font-medium text-green-deep" onClick={() => setMobileOpen(false)}>Safety</Link>
            <Link to="/contact" className="block py-2 font-medium text-green-deep" onClick={() => setMobileOpen(false)}>Contact</Link>
            <hr className="border-green-pale" />
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="block py-2 font-medium text-green-deep" onClick={() => setMobileOpen(false)}>Dashboard</Link>
                {isDonorRole(user.role) && (
                  <Link to="/create" className="block py-2 font-medium text-green-deep" onClick={() => setMobileOpen(false)}>Share Food</Link>
                )}
                <button onClick={() => { handleSignOut(); setMobileOpen(false); }} className="block py-2 font-medium text-danger">Sign Out</button>
              </>
            ) : (
              <div className="flex gap-3 pt-2">
                <Link to="/signin" className="btn-secondary text-sm flex-1 text-center" onClick={() => setMobileOpen(false)}>Sign In</Link>
                <Link to="/signup" className="btn-primary text-sm flex-1 text-center" onClick={() => setMobileOpen(false)}>Get Started</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
