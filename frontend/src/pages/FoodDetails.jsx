import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, MapPin, Users, AlertTriangle, Calendar, Tag, Info, CheckCircle } from 'lucide-react';
import { apiGetOffer, apiCreateClaim } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import Badge from '../components/common/Badge';
import StatusBadge from '../components/common/StatusBadge';
import Button from '../components/common/Button';
import Textarea from '../components/common/Textarea';
import Modal from '../components/common/Modal';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { formatDateTime, timeUntil } from '../utils/helpers';
import { ROLE_LABELS, CLAIM_STATUS, isRecipientRole } from '../utils/constants';

export default function FoodDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [claimNotes, setClaimNotes] = useState('');
  const [claimed, setClaimed] = useState(false);
  const [claimLoading, setClaimLoading] = useState(false);
  const [claimError, setClaimError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    apiGetOffer(id)
      .then(data => setListing(data))
      .catch(err => setError(err.message || 'Failed to load listing'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="max-w-3xl mx-auto px-4 py-16"><LoadingSpinner /></div>;

  if (error || !listing) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-green-deep mb-4">{error || 'Listing not found'}</h1>
        <p className="text-warm-gray mb-6">This food listing may have been removed or doesn't exist.</p>
        <Link to="/browse" className="btn-primary inline-flex items-center gap-2"><ArrowLeft size={16} /> Back to listings</Link>
      </div>
    );
  }

  const canClaim = isAuthenticated && user && isRecipientRole(user.role)
    && listing.status === CLAIM_STATUS.AVAILABLE && listing.donorId !== user.id;

  const handleClaim = async () => {
    if (!user) return;
    setClaimLoading(true);
    setClaimError('');
    try {
      await apiCreateClaim({ offerId: listing.id, notes: claimNotes });
      setClaimed(true);
      setShowClaimModal(false);
      const updated = await apiGetOffer(id);
      setListing(updated);
    } catch (err) {
      setClaimError(err.message || 'Failed to claim food');
    } finally {
      setClaimLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <Link to="/browse" className="inline-flex items-center gap-2 text-warm-gray hover:text-green-primary transition-colors mb-6">
        <ArrowLeft size={16} /> Back to listings
      </Link>

      {claimed && (
        <div className="mb-6 p-4 rounded-xl bg-green-pale border border-green-muted flex items-start gap-3" role="alert">
          <CheckCircle size={20} className="text-green-primary mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-semibold text-green-deep">Food claimed successfully!</p>
            <p className="text-sm text-warm-gray mt-1">The donor has been notified. Check your dashboard for pickup details.</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="gray">{listing.category}</Badge>
                  <StatusBadge status={listing.status} />
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-green-deep">{listing.title}</h1>
              </div>
              {listing.isFree ? (
                <span className="text-2xl font-bold text-green-primary whitespace-nowrap">Free</span>
              ) : (
                <span className="text-2xl font-bold text-terracotta whitespace-nowrap">₹{listing.price}</span>
              )}
            </div>
            <p className="text-warm-gray leading-relaxed mb-6">{listing.description}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-3 rounded-xl bg-cream">
                <Tag size={18} className="text-green-muted mt-0.5" />
                <div><p className="text-xs text-warm-gray">Quantity</p><p className="font-medium text-green-deep">{listing.quantity}</p></div>
              </div>
              {listing.preparedAt && (
                <div className="flex items-start gap-3 p-3 rounded-xl bg-cream">
                  <Calendar size={18} className="text-green-muted mt-0.5" />
                  <div><p className="text-xs text-warm-gray">Prepared</p><p className="font-medium text-green-deep">{formatDateTime(listing.preparedAt)}</p></div>
                </div>
              )}
              <div className="flex items-start gap-3 p-3 rounded-xl bg-cream">
                <Clock size={18} className="text-green-muted mt-0.5" />
                <div><p className="text-xs text-warm-gray">Best before</p><p className="font-medium text-green-deep">{formatDateTime(listing.bestBefore)}</p><p className="text-xs text-terracotta font-medium">{timeUntil(listing.bestBefore)}</p></div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-xl bg-cream">
                <Users size={18} className="text-green-muted mt-0.5" />
                <div><p className="text-xs text-warm-gray">Donor</p><p className="font-medium text-green-deep">{listing.donorName}</p><p className="text-xs text-warm-gray">{ROLE_LABELS[listing.donorType]}</p></div>
              </div>
            </div>
          </div>
          <div className="card">
            <h2 className="font-bold text-green-deep mb-4 flex items-center gap-2"><Info size={18} /> Dietary & Allergen Information</h2>
            {listing.dietaryTags && listing.dietaryTags.length > 0 && (
              <div className="mb-4">
                <p className="text-sm text-warm-gray mb-2">Dietary tags</p>
                <div className="flex flex-wrap gap-2">{listing.dietaryTags.map(tag => <Badge key={tag} variant="green">{tag}</Badge>)}</div>
              </div>
            )}
            {listing.allergens && listing.allergens.length > 0 ? (
              <div>
                <p className="text-sm text-warm-gray mb-2 flex items-center gap-1"><AlertTriangle size={14} className="text-warning" /> Contains allergens</p>
                <div className="flex flex-wrap gap-2">{listing.allergens.map(a => <Badge key={a} variant="warning">{a}</Badge>)}</div>
              </div>
            ) : (
              <p className="text-sm text-warm-gray">No allergens listed by the donor.</p>
            )}
            <p className="text-xs text-warm-gray-light mt-4 italic">Allergen info is provided by the donor. If you have severe allergies, please confirm directly.</p>
          </div>
        </div>
        <div className="space-y-6">
          <div className="card !bg-green-pale/30">
            <h2 className="font-bold text-green-deep mb-4">Pickup details</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin size={18} className="text-green-primary mt-0.5 flex-shrink-0" />
                <div><p className="text-sm text-warm-gray">Address</p><p className="font-medium text-green-deep">{listing.pickupAddress}</p></div>
              </div>
              <div className="flex items-start gap-3">
                <Clock size={18} className="text-green-primary mt-0.5 flex-shrink-0" />
                <div><p className="text-sm text-warm-gray">Pickup window</p><p className="font-medium text-green-deep">{formatDateTime(listing.pickupStart)}</p><p className="text-sm text-warm-gray">to {formatDateTime(listing.pickupEnd)}</p></div>
              </div>
              {listing.pickupInstructions && (
                <div className="p-3 rounded-xl bg-white"><p className="text-sm text-warm-gray mb-1">Instructions</p><p className="text-sm text-green-deep font-medium">{listing.pickupInstructions}</p></div>
              )}
            </div>
            {listing.lat && listing.lng && (
              <div className="mt-4 h-36 rounded-xl bg-green-muted/20 border-2 border-dashed border-green-muted/40 flex items-center justify-center">
                <div className="text-center">
                  <MapPin size={24} className="text-green-muted mx-auto mb-1" />
                  <p className="text-xs text-warm-gray">Map preview</p>
                  <p className="text-xs text-warm-gray-light">{Number(listing.lat).toFixed(4)}, {Number(listing.lng).toFixed(4)}</p>
                </div>
              </div>
            )}
          </div>
          <div className="card">
            {claimed ? (
              <div className="text-center">
                <CheckCircle size={24} className="text-green-primary mx-auto mb-2" />
                <p className="font-semibold text-green-deep">You've claimed this food</p>
                <Link to="/dashboard" className="text-sm text-green-primary hover:underline mt-2 inline-block">View in dashboard →</Link>
              </div>
            ) : canClaim ? (
              <Button onClick={() => setShowClaimModal(true)} className="w-full">Claim This Food</Button>
            ) : !isAuthenticated ? (
              <div className="text-center">
                <p className="text-sm text-warm-gray mb-3">Sign in to claim this food</p>
                <Link to="/signin" className="btn-primary inline-block w-full text-center">Sign In</Link>
              </div>
            ) : (
              <p className="text-sm text-warm-gray text-center">
                {listing.status !== CLAIM_STATUS.AVAILABLE ? 'This listing is no longer available.' : 'Only food seekers and NGOs can claim food.'}
              </p>
            )}
          </div>
        </div>
      </div>

      <Modal isOpen={showClaimModal} onClose={() => setShowClaimModal(false)} title="Claim food">
        <div className="space-y-4">
          <p className="text-warm-gray">You're claiming <strong>{listing.title}</strong> from {listing.donorName}.</p>
          <Textarea label="Note to donor (optional)" value={claimNotes} onChange={e => setClaimNotes(e.target.value)} placeholder="e.g. I can pick up at 5 PM. Thank you!" rows={3} />
          {!listing.isFree && (
            <div className="p-3 rounded-xl bg-terracotta/10">
              <p className="text-sm text-terracotta font-medium">This listing is offered at ₹{listing.price}. Payment is arranged directly with the donor at pickup.</p>
            </div>
          )}
          {claimError && (
            <div className="p-3 rounded-xl bg-danger/10 text-danger text-sm" role="alert">{claimError}</div>
          )}
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setShowClaimModal(false)}>Cancel</Button>
            <Button onClick={handleClaim} isLoading={claimLoading} className="flex-1">Confirm Claim</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
