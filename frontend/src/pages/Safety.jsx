import { Link } from 'react-router-dom';
import { Shield, Thermometer, AlertTriangle, Clock, CheckCircle, Eye, Flag, ArrowRight } from 'lucide-react';

export default function Safety() {
  return (
    <div>
      <section className="bg-white py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-green-pale flex items-center justify-center mb-6"><Shield size={28} className="text-green-primary" /></div>
          <h1 className="text-4xl font-bold text-green-deep mb-4">Food safety & trust</h1>
          <p className="text-lg text-warm-gray max-w-2xl mx-auto">We take food safety seriously. Here's how we help ensure that every exchange is safe and trustworthy.</p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-green-deep mb-8">For donors</h2>
          <div className="space-y-6">
            {[
              { icon: Thermometer, title: 'Proper storage and handling', points: ['Keep hot food above 60°C and cold food below 5°C until pickup.', 'Use clean, food-safe containers for packaging.', 'Label containers clearly with the food name and preparation time.', 'Wash hands and use clean utensils when handling food.'] },
              { icon: Clock, title: 'Accurate timing', points: ["List the actual preparation time — don't guess.", 'Set a realistic best-before window based on the food type.', 'Remove expired listings promptly.', 'If food quality changes before pickup, update or remove the listing.'] },
              { icon: AlertTriangle, title: 'Allergen disclosure', points: ['List ALL known allergens present in the food.', "If you're unsure about an ingredient, mention it in the description.", 'Be specific: "contains tree nuts (almonds)" is better than just "nuts".', 'Update the listing if you remember a missed allergen.'] },
              { icon: Eye, title: 'Transparency', points: ["Describe the food honestly — don't exaggerate quantity or quality.", 'If the food has been frozen and thawed, say so.', 'Mention if the food was part of a buffet or served-style event.', "Share clear pickup instructions so there's no confusion."] },
            ].map(({ icon: Icon, title, points }) => (
              <div key={title} className="card flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-green-pale flex items-center justify-center flex-shrink-0"><Icon size={20} className="text-green-primary" /></div>
                <div>
                  <h3 className="font-bold text-green-deep mb-2">{title}</h3>
                  <ul className="space-y-1.5">
                    {points.map((point, i) => (
                      <li key={i} className="text-sm text-warm-gray flex items-start gap-2">
                        <CheckCircle size={14} className="text-green-muted mt-0.5 flex-shrink-0" />{point}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-green-deep mb-8">For recipients</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { title: 'Check allergen info', desc: 'Always review allergen details before claiming food. If you have severe allergies, confirm directly with the donor.' },
              { title: 'Inspect at pickup', desc: "Check the food's appearance, smell, and packaging when you pick it up. Don't accept food that seems off." },
              { title: 'Handle safely', desc: 'Refrigerate perishable items as soon as possible. Reheat hot food to at least 74°C (165°F) before eating.' },
              { title: 'Be punctual', desc: "Pick up within the listed window. Food safety depends on timing. If you can't make it, cancel the claim." },
            ].map(({ title, desc }) => (
              <div key={title} className="card">
                <h3 className="font-bold text-green-deep mb-2">{title}</h3>
                <p className="text-sm text-warm-gray leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16" id="reporting">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card !p-8 md:!p-12 bg-gradient-to-br from-terracotta/5 to-cream">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-terracotta/10 flex items-center justify-center flex-shrink-0"><Flag size={22} className="text-terracotta" /></div>
              <div>
                <h2 className="text-xl font-bold text-green-deep mb-3">Report an issue</h2>
                <p className="text-warm-gray leading-relaxed mb-4">If you encounter unsafe food, misleading listings, or any other concern, please report it immediately. We take every report seriously and will investigate promptly.</p>
                <ul className="space-y-2 mb-6">
                  {['Food that appears spoiled or unsafe', 'Missing or inaccurate allergen information', "Donor or recipient who didn't show up", 'Inappropriate or fraudulent listings'].map((item, i) => (
                    <li key={i} className="text-sm text-warm-gray flex items-center gap-2"><CheckCircle size={14} className="text-green-muted" />{item}</li>
                  ))}
                </ul>
                <Link to="/contact" className="btn-accent inline-flex items-center gap-2">Contact Us <ArrowRight size={16} /></Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-green-pale/30 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-sm text-warm-gray text-center leading-relaxed">
            <strong className="text-green-deep">Disclaimer:</strong> FoodLoop is a prototype platform for connecting food donors and recipients.
            We do not guarantee food safety, quality, or hygiene standards. Users are responsible for their own food safety practices.
            This platform does not replace professional food safety certification or inspection.
          </p>
        </div>
      </section>
    </div>
  );
}
