import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import Input from '../components/common/Input';
import Textarea from '../components/common/Textarea';
import Select from '../components/common/Select';
import TagSelector from '../components/common/TagSelector';
import Button from '../components/common/Button';
import { apiCreateOffer } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { FOOD_CATEGORIES, DIETARY_TAGS, ALLERGENS, isDonorRole } from '../utils/constants';

const categoryOptions = [
  { value: '', label: 'Select a category' },
  ...FOOD_CATEGORIES.map(c => ({ value: c, label: c })),
];

function toISO(datetimeLocal) {
  if (!datetimeLocal) return null;
  const d = new Date(datetimeLocal);
  return isNaN(d.getTime()) ? null : d.toISOString();
}

export default function CreateListing() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [form, setForm] = useState({
    title: '', description: '', category: '', quantity: '',
    isFree: true, price: '', preparedAt: '', bestBefore: '',
    pickupStart: '', pickupEnd: '', pickupAddress: '',
    pickupInstructions: '', dietaryTags: [], allergens: [],
  });

  if (!isAuthenticated || !user || !isDonorRole(user.role)) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-green-deep mb-4">Access restricted</h1>
        <p className="text-warm-gray mb-6">Only registered donors can create food listings.</p>
        <button onClick={() => navigate('/signup')} className="btn-primary">Sign up as a donor</button>
      </div>
    );
  }

  const updateField = (field, value) => {
    setForm(f => ({ ...f, [field]: value }));
    if (errors[field]) setErrors(e => ({ ...e, [field]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Title is required';
    if (!form.description.trim()) e.description = 'Description is required';
    if (!form.category) e.category = 'Select a category';
    if (!form.quantity.trim()) e.quantity = 'Quantity is required';
    if (!form.isFree && (!form.price || parseFloat(form.price) <= 0)) e.price = 'Enter a valid price';
    if (!form.bestBefore) e.bestBefore = 'Best-before date is required';
    if (!form.pickupStart) e.pickupStart = 'Pickup start time is required';
    if (!form.pickupEnd) e.pickupEnd = 'Pickup end time is required';
    if (!form.pickupAddress.trim()) e.pickupAddress = 'Pickup address is required';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setSubmitting(true);
    try {
      await apiCreateOffer({
        title: form.title.trim(),
        description: form.description.trim(),
        category: form.category,
        quantity: form.quantity.trim(),
        isFree: form.isFree,
        price: form.isFree ? 0 : parseFloat(form.price),
        preparedAt: toISO(form.preparedAt),
        bestBefore: toISO(form.bestBefore),
        pickupStart: toISO(form.pickupStart),
        pickupEnd: toISO(form.pickupEnd),
        pickupAddress: form.pickupAddress.trim(),
        pickupInstructions: form.pickupInstructions.trim() || null,
        lat: 12.9716 + (Math.random() - 0.5) * 0.05,
        lng: 77.5946 + (Math.random() - 0.5) * 0.05,
        dietaryTags: form.dietaryTags,
        allergens: form.allergens,
      });
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setSubmitError(err.message || 'Failed to create listing');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="card py-12">
          <CheckCircle size={48} className="text-green-primary mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-green-deep mb-2">Listing created!</h1>
          <p className="text-warm-gray mb-6">Your food offer is now visible to people looking for food.</p>
          <div className="flex gap-3 justify-center">
            <Button variant="secondary" onClick={() => { setSubmitted(false); setForm({ title: '', description: '', category: '', quantity: '', isFree: true, price: '', preparedAt: '', bestBefore: '', pickupStart: '', pickupEnd: '', pickupAddress: '', pickupInstructions: '', dietaryTags: [], allergens: [] }); }}>Create Another</Button>
            <Button onClick={() => navigate('/dashboard')}>Go to Dashboard</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-warm-gray hover:text-green-primary transition-colors mb-6">
        <ArrowLeft size={16} /> Back
      </button>
      <h1 className="text-3xl font-bold text-green-deep mb-2">Share food</h1>
      <p className="text-warm-gray mb-8">Create a listing so people in your community can find and claim this food.</p>

      <form onSubmit={handleSubmit} className="space-y-8">
        <section className="card space-y-4">
          <h2 className="text-lg font-bold text-green-deep">Food details</h2>
          <Input label="Title" value={form.title} onChange={e => updateField('title', e.target.value)} error={errors.title} placeholder="e.g. Vegetable Biryani — 8 portions" />
          <Textarea label="Description" value={form.description} onChange={e => updateField('description', e.target.value)} error={errors.description} placeholder="Describe the food, how it was prepared, and packaging details…" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select label="Category" options={categoryOptions} value={form.category} onChange={e => updateField('category', e.target.value)} error={errors.category} />
            <Input label="Quantity" value={form.quantity} onChange={e => updateField('quantity', e.target.value)} error={errors.quantity} placeholder="e.g. 8 portions, 2 kg" />
          </div>
        </section>

        <section className="card space-y-4">
          <h2 className="text-lg font-bold text-green-deep">Pricing</h2>
          <div className="flex gap-4">
            <button type="button" onClick={() => updateField('isFree', true)} className={`flex-1 p-4 rounded-xl border-2 text-center transition-all ${form.isFree ? 'border-green-primary bg-green-pale/30' : 'border-green-pale hover:border-green-muted'}`}>
              <p className="font-semibold text-green-deep">Free</p>
              <p className="text-sm text-warm-gray">Donate at no cost</p>
            </button>
            <button type="button" onClick={() => updateField('isFree', false)} className={`flex-1 p-4 rounded-xl border-2 text-center transition-all ${!form.isFree ? 'border-terracotta bg-terracotta/5' : 'border-green-pale hover:border-green-muted'}`}>
              <p className="font-semibold text-green-deep">Low price</p>
              <p className="text-sm text-warm-gray">Sell at a reduced price</p>
            </button>
          </div>
          {!form.isFree && (
            <Input label="Price (₹)" type="number" min="1" value={form.price} onChange={e => updateField('price', e.target.value)} error={errors.price} placeholder="e.g. 50" hint="Set a fair, reduced price." />
          )}
        </section>

        <section className="card space-y-4">
          <h2 className="text-lg font-bold text-green-deep">Timing</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Prepared at" type="datetime-local" value={form.preparedAt} onChange={e => updateField('preparedAt', e.target.value)} hint="When was the food prepared?" />
            <Input label="Best before" type="datetime-local" value={form.bestBefore} onChange={e => updateField('bestBefore', e.target.value)} error={errors.bestBefore} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Pickup window starts" type="datetime-local" value={form.pickupStart} onChange={e => updateField('pickupStart', e.target.value)} error={errors.pickupStart} />
            <Input label="Pickup window ends" type="datetime-local" value={form.pickupEnd} onChange={e => updateField('pickupEnd', e.target.value)} error={errors.pickupEnd} />
          </div>
        </section>

        <section className="card space-y-4">
          <h2 className="text-lg font-bold text-green-deep">Pickup location</h2>
          <Input label="Pickup address" value={form.pickupAddress} onChange={e => updateField('pickupAddress', e.target.value)} error={errors.pickupAddress} placeholder="Full address for pickup" />
          <Textarea label="Pickup instructions" value={form.pickupInstructions} onChange={e => updateField('pickupInstructions', e.target.value)} placeholder="e.g. Come to the back entrance, ask for the manager…" rows={3} hint="Help the person picking up find you easily." />
        </section>

        <section className="card space-y-4">
          <h2 className="text-lg font-bold text-green-deep">Dietary & Allergen info</h2>
          <TagSelector label="Dietary tags" options={DIETARY_TAGS} selected={form.dietaryTags} onChange={tags => updateField('dietaryTags', tags)} />
          <TagSelector label="Allergens present" options={ALLERGENS} selected={form.allergens} onChange={tags => updateField('allergens', tags)} />
          <p className="text-xs text-warm-gray-light italic">Please disclose all known allergens accurately. This helps keep people safe.</p>
        </section>

        {submitError && (
          <div className="p-4 rounded-xl bg-danger/10 text-danger text-sm" role="alert">{submitError}</div>
        )}

        <div className="flex gap-3">
          <Button variant="secondary" type="button" onClick={() => navigate(-1)}>Cancel</Button>
          <Button type="submit" isLoading={submitting} className="flex-1">Publish Listing</Button>
        </div>
      </form>
    </div>
  );
}
