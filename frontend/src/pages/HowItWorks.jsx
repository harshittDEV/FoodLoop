import { Link } from 'react-router-dom';
import { Package, Search, Clock, Shield, Users, ArrowRight, CheckCircle, Heart } from 'lucide-react';

export default function HowItWorks() {
  return (
    <div>
      <section className="bg-white py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-green-deep mb-4">How FoodLoop works</h1>
          <p className="text-lg text-warm-gray max-w-2xl mx-auto">FoodLoop is a platform that connects people who have surplus food with those who need it. Here's how the process works for each role.</p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-green-deep mb-2 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-pale flex items-center justify-center"><Heart size={20} className="text-green-primary" /></div>
              For Donors
            </h2>
            <p className="text-warm-gray ml-13">Individuals and restaurants with surplus food</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { step: '1', icon: Users, title: 'Create your account', desc: 'Sign up as an individual donor or a restaurant. Complete your profile and go through the verification process.' },
              { step: '2', icon: Package, title: 'List your surplus food', desc: 'Add details about the food: what it is, how much, when it was prepared, allergen information, and when and where to pick it up. Choose to give it free or at a low price.' },
              { step: '3', icon: CheckCircle, title: 'Coordinate pickup', desc: 'When someone claims your listing, you get notified. Confirm the pickup time, and hand over the food safely.' },
            ].map(({ step, icon: Icon, title, desc }) => (
              <div key={step} className="card relative">
                <div className="absolute -top-3 left-4 w-7 h-7 bg-terracotta text-cream rounded-full flex items-center justify-center font-bold text-sm">{step}</div>
                <div className="mt-3 mb-3 w-12 h-12 rounded-xl bg-green-pale flex items-center justify-center"><Icon size={22} className="text-green-primary" /></div>
                <h3 className="font-bold text-green-deep mb-2">{title}</h3>
                <p className="text-sm text-warm-gray leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-green-deep mb-2 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-terracotta/10 flex items-center justify-center"><Search size={20} className="text-terracotta" /></div>
              For Recipients
            </h2>
            <p className="text-warm-gray ml-13">Individuals seeking food and NGOs collecting on behalf of communities</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { step: '1', icon: Users, title: 'Sign up and verify', desc: 'Create an account as a food seeker or an NGO. Verification helps build trust in the community.' },
              { step: '2', icon: Search, title: 'Browse and filter', desc: 'Search for available food near you. Filter by dietary needs, allergens, price, and donor type to find what works for you.' },
              { step: '3', icon: Clock, title: 'Claim and pick up', desc: 'Claim the food you need and arrange pickup within the listed window. Follow the pickup instructions carefully.' },
            ].map(({ step, icon: Icon, title, desc }) => (
              <div key={step} className="card relative">
                <div className="absolute -top-3 left-4 w-7 h-7 bg-green-primary text-cream rounded-full flex items-center justify-center font-bold text-sm">{step}</div>
                <div className="mt-3 mb-3 w-12 h-12 rounded-xl bg-terracotta/10 flex items-center justify-center"><Icon size={22} className="text-terracotta" /></div>
                <h3 className="font-bold text-green-deep mb-2">{title}</h3>
                <p className="text-sm text-warm-gray leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-green-deep mb-8 text-center">Our principles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { icon: Shield, title: 'Safety first', desc: 'Every listing requires preparation time, allergen disclosure, and clear pickup details. We expect honesty from every member.' },
              { icon: Heart, title: 'Community trust', desc: 'FoodLoop is built on mutual respect. Donors share in good faith, and recipients show up on time and treat food with care.' },
              { icon: Clock, title: 'Timeliness', desc: "Food doesn't last forever. We show best-before dates and pickup windows clearly, so nothing goes to waste." },
              { icon: Users, title: 'Inclusivity', desc: "Whether you're an individual, a restaurant, or an NGO — everyone is welcome. Dietary filters help people with specific needs find the right food." },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="card flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-green-pale flex items-center justify-center flex-shrink-0"><Icon size={20} className="text-green-primary" /></div>
                <div><h3 className="font-bold text-green-deep mb-1">{title}</h3><p className="text-sm text-warm-gray leading-relaxed">{desc}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-green-deep py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-cream mb-4">Ready to get started?</h2>
          <p className="text-green-light/80 mb-8">Join FoodLoop and make a difference in your community today.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup" className="bg-cream text-green-deep px-8 py-4 rounded-xl font-semibold hover:bg-green-pale transition-colors text-center flex items-center justify-center gap-2">Get Started <ArrowRight size={16} /></Link>
            <Link to="/browse" className="btn-accent text-center">Browse Food</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
