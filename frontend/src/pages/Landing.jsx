import { Link } from 'react-router-dom';
import { ArrowRight, Heart, Shield, Users, Leaf, Clock, TrendingUp, Package } from 'lucide-react';
import { impactStats } from '../data/mockData';
import { useFood } from '../context/FoodContext';
import FoodCard from '../components/food/FoodCard';

function IsometricCrate() {
  return (
    <div className="relative w-64 h-64 mx-auto" aria-hidden="true">
      <svg viewBox="0 0 260 260" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-lg">
        <path d="M130 200 L40 150 L40 90 L130 140 Z" fill="#B7E4C7" stroke="#2D6A4F" strokeWidth="2"/>
        <path d="M130 200 L220 150 L220 90 L130 140 Z" fill="#D8F3DC" stroke="#2D6A4F" strokeWidth="2"/>
        <path d="M40 90 L130 40 L220 90 L130 140 Z" fill="#52B788" stroke="#2D6A4F" strokeWidth="2"/>
        <line x1="40" y1="110" x2="130" y2="160" stroke="#2D6A4F" strokeWidth="1" opacity="0.4"/>
        <line x1="40" y1="130" x2="130" y2="180" stroke="#2D6A4F" strokeWidth="1" opacity="0.4"/>
        <line x1="130" y1="160" x2="220" y2="110" stroke="#2D6A4F" strokeWidth="1" opacity="0.4"/>
        <line x1="130" y1="180" x2="220" y2="130" stroke="#2D6A4F" strokeWidth="1" opacity="0.4"/>
        <ellipse cx="100" cy="75" rx="18" ry="16" fill="#C67B5C"/>
        <ellipse cx="100" cy="72" rx="16" ry="14" fill="#E8A87C"/>
        <path d="M100 60 Q105 50 108 55" stroke="#2D6A4F" strokeWidth="2" fill="none"/>
        <ellipse cx="104" cy="55" rx="5" ry="3" fill="#52B788" transform="rotate(-20,104,55)"/>
        <circle cx="155" cy="78" r="15" fill="#E8A87C"/>
        <circle cx="155" cy="76" r="13" fill="#C67B5C" opacity="0.7"/>
        <path d="M170 95 L185 70 L180 68 Z" fill="#C67B5C"/>
        <path d="M183 72 Q188 60 192 65" stroke="#52B788" strokeWidth="2" fill="none"/>
        <path d="M185 70 Q190 58 194 63" stroke="#52B788" strokeWidth="2" fill="none"/>
        <ellipse cx="130" cy="82" rx="22" ry="10" fill="#E9C46A"/>
        <ellipse cx="130" cy="80" rx="20" ry="8" fill="#E8A87C" opacity="0.5"/>
        <ellipse cx="75" cy="85" rx="8" ry="4" fill="#52B788" transform="rotate(-30,75,85)"/>
        <ellipse cx="78" cy="82" rx="6" ry="3" fill="#B7E4C7" transform="rotate(-30,78,82)"/>
      </svg>
    </div>
  );
}

function StatCard({ icon: Icon, value, label }) {
  return (
    <div className="text-center p-6">
      <div className="mx-auto w-12 h-12 rounded-full bg-green-pale flex items-center justify-center mb-3">
        <Icon size={22} className="text-green-primary" />
      </div>
      <p className="text-3xl font-bold text-green-deep mb-1">
        {typeof value === 'number' ? value.toLocaleString() : value}
      </p>
      <p className="text-sm text-warm-gray">{label}</p>
    </div>
  );
}

export default function Landing() {
  const { featuredOffers } = useFood();
  const featured = featuredOffers.slice(0, 3);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-pale text-green-deep text-sm font-medium mb-6">
                <Leaf size={16} />
                Reduce food waste. Feed your community.
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-green-deep leading-tight mb-6">
                Good food deserves a{' '}
                <span className="text-green-primary">second chance</span>
              </h1>
              <p className="text-lg text-warm-gray leading-relaxed mb-8 max-w-lg">
                FoodLoop connects restaurants and individuals with surplus food to NGOs and people who need it. Share for free or at a low price — no food left behind.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/browse" className="btn-primary text-center flex items-center justify-center gap-2">
                  Find Food <ArrowRight size={18} />
                </Link>
                <Link to="/signup" className="btn-secondary text-center">
                  Share Food
                </Link>
              </div>
            </div>
            <div className="hidden lg:flex justify-center">
              <IsometricCrate />
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-green-pale/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" aria-hidden="true" />
      </section>

      {/* How it works */}
      <section className="bg-white py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-green-deep mb-4">How FoodLoop works</h2>
            <p className="text-warm-gray max-w-2xl mx-auto">Three simple steps to share or find food in your community</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Package, step: '1', title: 'List your surplus', desc: 'Restaurants and individuals post food that would otherwise go to waste — free or at a low price.' },
              { icon: Users, step: '2', title: 'Browse & claim', desc: 'NGOs and individuals browse available food nearby, filter by dietary needs, and claim what they need.' },
              { icon: Clock, step: '3', title: 'Pick up & enjoy', desc: 'Coordinate a pickup time, follow food-safety guidelines, and enjoy a meal that matters.' },
            ].map(({ icon: StepIcon, step, title, desc }) => (
              <div key={step} className="relative card text-center">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-terracotta text-cream rounded-full flex items-center justify-center font-bold text-sm">
                  {step}
                </div>
                <div className="mt-4 mb-4 mx-auto w-14 h-14 rounded-2xl bg-green-pale flex items-center justify-center">
                  <StepIcon size={24} className="text-green-primary" />
                </div>
                <h3 className="font-bold text-green-deep mb-2">{title}</h3>
                <p className="text-sm text-warm-gray leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/how-it-works" className="text-green-primary font-semibold hover:text-green-deep transition-colors inline-flex items-center gap-1">
              Learn more about how it works <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Nearby Offers */}
      {featured.length > 0 && (
        <section className="py-16 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-green-deep mb-2">Available near you</h2>
                <p className="text-warm-gray">Fresh offers from your community</p>
              </div>
              <Link to="/browse" className="hidden sm:inline-flex items-center gap-1 text-green-primary font-semibold hover:text-green-deep transition-colors">
                View all <ArrowRight size={16} />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featured.map(listing => (
                <FoodCard key={listing.id} listing={listing} />
              ))}
            </div>
            <div className="sm:hidden text-center mt-8">
              <Link to="/browse" className="btn-secondary inline-flex items-center gap-2">
                View all listings <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Impact Stats */}
      <section className="bg-white py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-green-deep mb-4">Our community impact</h2>
            <p className="text-warm-gray max-w-xl mx-auto">Together, we're making a difference one meal at a time</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard icon={Heart} value={impactStats.mealsShared} label="Meals shared" />
            <StatCard icon={Users} value={impactStats.activeDonors} label="Active donors" />
            <StatCard icon={TrendingUp} value={`${(impactStats.foodSavedKg / 1000).toFixed(1)}t`} label="Food saved" />
            <StatCard icon={Shield} value={impactStats.partneredNGOs} label="Partner NGOs" />
          </div>
        </div>
      </section>

      {/* Trust & Safety */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card !p-8 md:!p-12 bg-gradient-to-br from-green-pale/50 to-cream">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-green-deep mb-4">Food safety is our priority</h2>
                <p className="text-warm-gray leading-relaxed mb-6">
                  Every listing includes preparation time, allergen information, and clear pickup instructions. We encourage accurate disclosure and safe handling practices.
                </p>
                <Link to="/safety" className="btn-primary inline-flex items-center gap-2">
                  Learn about our safety guidelines <ArrowRight size={16} />
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: Shield, text: 'Allergen disclosure on every listing' },
                  { icon: Clock, text: 'Clear prep time and best-before info' },
                  { icon: Users, text: 'Verified donor profiles' },
                  { icon: Heart, text: 'Community-driven trust ratings' },
                ].map(({ icon: ItemIcon, text }) => (
                  <div key={text} className="flex items-start gap-3 p-3">
                    <ItemIcon size={20} className="text-green-primary flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-green-deep font-medium">{text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-green-deep py-16 md:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-cream mb-4">
            Ready to close the loop?
          </h2>
          <p className="text-green-light/80 text-lg mb-8 max-w-xl mx-auto">
            Whether you have food to share or need a meal, FoodLoop is here for your community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/browse" className="bg-cream text-green-deep px-8 py-4 rounded-xl font-semibold hover:bg-green-pale transition-colors text-center">
              Find Food
            </Link>
            <Link to="/signup" className="btn-accent text-center">
              Start Sharing
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
