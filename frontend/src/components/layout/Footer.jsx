import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-green-deep text-green-light" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-green-muted rounded-lg flex items-center justify-center">
                <span className="text-cream font-bold">F</span>
              </div>
              <span className="text-lg font-bold text-cream">FoodLoop</span>
            </div>
            <p className="text-sm text-green-light/80 leading-relaxed">
              Connecting surplus food with people who need it. Reducing waste, building community.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-cream mb-3">Explore</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/browse" className="hover:text-cream transition-colors">Find Food</Link></li>
              <li><Link to="/how-it-works" className="hover:text-cream transition-colors">How It Works</Link></li>
              <li><Link to="/signup" className="hover:text-cream transition-colors">Get Started</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-cream mb-3">Trust & Safety</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/safety" className="hover:text-cream transition-colors">Food Safety</Link></li>
              <li><Link to="/contact" className="hover:text-cream transition-colors">Contact Us</Link></li>
              <li><Link to="/safety#reporting" className="hover:text-cream transition-colors">Report an Issue</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-cream mb-3">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li><span className="text-green-light/60 cursor-default">Terms of Service</span></li>
              <li><span className="text-green-light/60 cursor-default">Privacy Policy</span></li>
              <li><span className="text-green-light/60 cursor-default">Cookies</span></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-green-muted/30 mt-10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-green-light/60">
            © {new Date().getFullYear()} FoodLoop. Prototype — not a production service.
          </p>
          <p className="text-sm text-green-light/60 flex items-center gap-1">
            Made with <Heart size={14} className="text-terracotta" aria-label="love" /> for communities everywhere
          </p>
        </div>
      </div>
    </footer>
  );
}
