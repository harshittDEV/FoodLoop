import { useState } from 'react';
import { Mail, MessageSquare, MapPin, CheckCircle, AlertCircle } from 'lucide-react';
import Input from '../components/common/Input';
import Textarea from '../components/common/Textarea';
import Select from '../components/common/Select';
import Button from '../components/common/Button';
import { apiSendContactMessage } from '../utils/api';
import { validateEmail } from '../utils/helpers';

const topicOptions = [
  { value: '', label: 'Select a topic' },
  { value: 'General inquiry', label: 'General inquiry' },
  { value: 'Food safety concern', label: 'Food safety concern' },
  { value: 'Report an issue', label: 'Report an issue' },
  { value: 'NGO or business partnership', label: 'NGO or business partnership' },
  { value: 'Feedback or suggestion', label: 'Feedback or suggestion' },
  { value: 'Technical issue', label: 'Technical issue' },
];

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [form, setForm] = useState({ name: '', email: '', topic: '', message: '' });
  const [errors, setErrors] = useState({});

  const updateField = (field, value) => {
    setForm(f => ({ ...f, [field]: value }));
    if (errors[field]) setErrors(e => ({ ...e, [field]: '' }));
    if (submitError) setSubmitError('');
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (!form.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(form.email)) {
      newErrors.email = 'Enter a valid email address';
    }
    if (!form.topic) newErrors.topic = 'Please select a topic';
    if (!form.message.trim()) newErrors.message = 'Message is required';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      await apiSendContactMessage(form);
      setSubmitted(true);
    } catch (err) {
      setSubmitError(err.message || 'Failed to deliver message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-green-deep mb-4">Get in touch</h1>
        <p className="text-lg text-warm-gray max-w-xl mx-auto">
          Have a question, concern, or want to partner with us? We'd love to hear from you.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="space-y-6">
          {[
            { icon: Mail, title: 'Email', info: 'harshitsinghh1128@gmail.com', sub: 'Direct inquiries & support' },
            { icon: MessageSquare, title: 'Community', info: 'FoodLoop Network', sub: 'Connecting donors & recipients' },
            { icon: MapPin, title: 'Location', info: 'Bengaluru, India', sub: 'Serving communities nationwide' },
          ].map(({ icon: Icon, title, info, sub }) => (
            <div key={title} className="card flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-green-pale flex items-center justify-center flex-shrink-0">
                <Icon size={20} className="text-green-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-green-deep">{title}</h3>
                <p className="text-sm text-warm-gray">{info}</p>
                <p className="text-xs text-warm-gray-light">{sub}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="md:col-span-2">
          {submitted ? (
            <div className="card text-center py-12">
              <CheckCircle size={48} className="text-green-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-green-deep mb-2">Message delivered!</h2>
              <p className="text-warm-gray mb-2">
                Thank you, <strong>{form.name}</strong>. Your message regarding <em>{form.topic}</em> has been sent to our team at <strong>harshitsinghh1128@gmail.com</strong>.
              </p>
              <p className="text-sm text-warm-gray mb-6">
                We'll review your query and reply directly to your email (<strong>{form.email}</strong>).
              </p>
              <Button
                variant="secondary"
                onClick={() => {
                  setSubmitted(false);
                  setForm({ name: '', email: '', topic: '', message: '' });
                }}
              >
                Send another message
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="card space-y-4">
              <h2 className="text-lg font-bold text-green-deep">Send us a message</h2>
              <p className="text-sm text-warm-gray">
                Submissions are sent directly to the FoodLoop management team.
              </p>

              {submitError && (
                <div className="p-4 rounded-xl bg-danger/10 border border-danger/20 text-danger text-sm flex items-start gap-2" role="alert">
                  <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Message could not be sent</p>
                    <p className="text-xs text-danger/90 mt-0.5">{submitError}</p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Your name"
                  value={form.name}
                  onChange={e => updateField('name', e.target.value)}
                  error={errors.name}
                  placeholder="e.g. Priya Sharma"
                  disabled={loading}
                />
                <Input
                  label="Email address"
                  type="email"
                  value={form.email}
                  onChange={e => updateField('email', e.target.value)}
                  error={errors.email}
                  placeholder="you@example.com"
                  disabled={loading}
                />
              </div>

              <Select
                label="Topic"
                options={topicOptions}
                value={form.topic}
                onChange={e => updateField('topic', e.target.value)}
                error={errors.topic}
                disabled={loading}
              />

              <Textarea
                label="Message"
                value={form.message}
                onChange={e => updateField('message', e.target.value)}
                error={errors.message}
                rows={5}
                placeholder="Tell us what's on your mind…"
                disabled={loading}
              />

              <Button type="submit" isLoading={loading} className="w-full">
                {loading ? 'Sending Message…' : 'Send Message'}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
