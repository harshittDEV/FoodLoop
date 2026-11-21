import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Package, Clock, CheckCircle, AlertCircle, ArrowRight, ChevronRight, XCircle, Check, Truck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import {
  apiGetDonorDashboard,
  apiGetRecipientDashboard,
  apiAcceptClaim,
  apiRejectClaim,
  apiMarkClaimPickedUp,
  apiCancelClaim,
} from '../utils/api';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import StatusBadge from '../components/common/StatusBadge';
import EmptyState from '../components/common/EmptyState';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { isDonorRole, isRecipientRole, ROLE_LABELS } from '../utils/constants';
import { formatDateTime, timeUntil } from '../utils/helpers';

function VerificationBanner({ user, onResend }) {
  const [status, setStatus] = useState('');
  if (user.verified) return null;

  const handleResend = async () => {
    setStatus('sending');
    const result = await onResend(user.email);
    setStatus(result.success ? 'sent' : 'error');
  };

  return (
    <div className="mb-6 p-4 rounded-xl bg-warning/10 border border-warning/30 flex flex-col sm:flex-row items-start sm:items-center gap-3">
      <AlertCircle size={20} className="text-yellow-700 flex-shrink-0" />
      <div className="flex-1">
        <p className="font-semibold text-green-deep">Verification pending</p>
        <p className="text-sm text-warm-gray">Please check your inbox and click the verification link to activate your account.</p>
        {status === 'sent' && <p className="text-xs text-green-primary mt-1">Verification email resent!</p>}
        {status === 'error' && <p className="text-xs text-danger mt-1">Could not resend. Try again later.</p>}
      </div>
      <Button size="sm" onClick={handleResend} disabled={status === 'sending'}>
        {status === 'sending' ? 'Sending…' : 'Resend Email'}
      </Button>
    </div>
  );
}

function ClaimActions({ claim, onAction }) {
  const [loading, setLoading] = useState('');

  const handle = async (action, fn) => {
    setLoading(action);
    try {
      await fn(claim.id);
      onAction();
    } catch (err) {
      alert(err.message || 'Action failed');
    } finally {
      setLoading('');
    }
  };

  if (claim.status === 'pending') {
    return (
      <div className="flex gap-2 mt-2">
        <button
          onClick={() => handle('accept', apiAcceptClaim)}
          disabled={!!loading}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-green-primary text-cream text-xs font-medium hover:bg-green-deep transition-colors disabled:opacity-50"
        >
          {loading === 'accept' ? '…' : <><Check size={12} /> Accept</>}
        </button>
        <button
          onClick={() => handle('reject', apiRejectClaim)}
          disabled={!!loading}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-danger/10 text-danger text-xs font-medium hover:bg-danger/20 transition-colors disabled:opacity-50"
        >
          {loading === 'reject' ? '…' : <><XCircle size={12} /> Reject</>}
        </button>
      </div>
    );
  }

  if (claim.status === 'accepted') {
    return (
      <button
        onClick={() => handle('pickup', apiMarkClaimPickedUp)}
        disabled={!!loading}
        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-terracotta text-cream text-xs font-medium hover:bg-terracotta/80 transition-colors disabled:opacity-50 mt-2"
      >
        {loading === 'pickup' ? '…' : <><Truck size={12} /> Mark Picked Up</>}
      </button>
    );
  }

  return null;
}

function RecipientClaimActions({ claim, onAction }) {
  const [loading, setLoading] = useState(false);

  const handleCancel = async () => {
    setLoading(true);
    try {
      await apiCancelClaim(claim.id);
      onAction();
    } catch (err) {
      alert(err.message || 'Failed to cancel');
    } finally {
      setLoading(false);
    }
  };

  if (claim.status === 'pending' || claim.status === 'accepted') {
    return (
      <button
        onClick={handleCancel}
        disabled={loading}
        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-danger/10 text-danger text-xs font-medium hover:bg-danger/20 transition-colors disabled:opacity-50 mt-2"
      >
        {loading ? '…' : <><XCircle size={12} /> Cancel Claim</>}
      </button>
    );
  }
  return null;
}

function DonorDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboard = useCallback(async () => {
    try {
      const result = await apiGetDonorDashboard();
      setData(result);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="p-4 rounded-xl bg-danger/10 text-danger text-sm">{error}</div>;
  if (!data) return null;

  const offers = data.offers || [];
  const claims = data.incomingClaims || [];

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="card text-center"><p className="text-2xl font-bold text-green-primary">{data.totalOffers}</p><p className="text-sm text-warm-gray">Total listings</p></div>
        <div className="card text-center"><p className="text-2xl font-bold text-green-primary">{data.activeOffers}</p><p className="text-sm text-warm-gray">Active now</p></div>
        <div className="card text-center"><p className="text-2xl font-bold text-terracotta">{data.reservedOffers}</p><p className="text-sm text-warm-gray">Reserved</p></div>
        <div className="card text-center"><p className="text-2xl font-bold text-green-muted">{data.pickedUpOffers}</p><p className="text-sm text-warm-gray">Picked up</p></div>
      </div>

      {claims.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-green-deep mb-4">Incoming requests</h2>
          <div className="space-y-3">
            {claims.map(claim => (
              <div key={claim.id} className="card">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-green-deep truncate">{claim.offerTitle}</h3>
                      <StatusBadge status={claim.status} />
                    </div>
                    <p className="text-sm text-warm-gray">Requested by <span className="font-medium">{claim.claimerName}</span></p>
                    {claim.notes && <p className="text-sm text-warm-gray mt-1 italic">"{claim.notes}"</p>}
                    <p className="text-xs text-warm-gray-light mt-1">{formatDateTime(claim.createdAt)}</p>
                  </div>
                </div>
                <ClaimActions claim={claim} onAction={fetchDashboard} />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-green-deep">Your listings</h2>
        <Link to="/create" className="btn-primary text-sm flex items-center gap-2"><Plus size={16} /> New Listing</Link>
      </div>
      {offers.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No listings yet"
          description="Start sharing surplus food with your community."
          action={<Link to="/create" className="btn-primary inline-flex items-center gap-2"><Plus size={16} /> Create your first listing</Link>}
        />
      ) : (
        <div className="space-y-4">
          {offers.map(listing => (
            <Link key={listing.id} to={`/food/${listing.id}`} className="card flex items-center gap-4 group">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-green-deep truncate group-hover:text-green-primary transition-colors">{listing.title}</h3>
                  <StatusBadge status={listing.status} />
                </div>
                <div className="flex items-center gap-4 text-sm text-warm-gray">
                  <span>{listing.quantity}</span>
                  <span>{listing.isFree ? 'Free' : `₹${listing.price}`}</span>
                  <span className="flex items-center gap-1"><Clock size={12} /> {timeUntil(listing.bestBefore)}</span>
                </div>
              </div>
              <ChevronRight size={20} className="text-warm-gray-light" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function RecipientDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboard = useCallback(async () => {
    try {
      const result = await apiGetRecipientDashboard();
      setData(result);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="p-4 rounded-xl bg-danger/10 text-danger text-sm">{error}</div>;
  if (!data) return null;

  const claims = data.claims || [];

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        <div className="card text-center"><p className="text-2xl font-bold text-green-primary">{data.totalClaims}</p><p className="text-sm text-warm-gray">Total claims</p></div>
        <div className="card text-center"><p className="text-2xl font-bold text-terracotta">{data.pendingClaims}</p><p className="text-sm text-warm-gray">Pending</p></div>
        <div className="card text-center"><p className="text-2xl font-bold text-green-muted">{data.pickedUpClaims}</p><p className="text-sm text-warm-gray">Picked up</p></div>
      </div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-green-deep">Your claims</h2>
        <Link to="/browse" className="text-green-primary font-semibold text-sm flex items-center gap-1 hover:text-green-deep">Browse food <ArrowRight size={14} /></Link>
      </div>
      {claims.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No claims yet"
          description="Browse available food listings and claim what you need."
          action={<Link to="/browse" className="btn-primary inline-flex items-center gap-2">Find Food <ArrowRight size={16} /></Link>}
        />
      ) : (
        <div className="space-y-4">
          {claims.map(claim => (
            <div key={claim.id} className="card">
              <Link to={`/food/${claim.offerId}`} className="flex items-center gap-4 group">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-green-deep truncate group-hover:text-green-primary transition-colors">{claim.offerTitle}</h3>
                    <StatusBadge status={claim.status} />
                  </div>
                  <div className="flex items-center gap-4 text-sm text-warm-gray">
                    <span>From: {claim.donorName}</span>
                    <span>{claim.offerIsFree ? 'Free' : `₹${claim.offerPrice}`}</span>
                  </div>
                  {claim.pickupAddress && <p className="text-sm text-warm-gray mt-1">Pickup: {claim.pickupAddress}</p>}
                  <div className="text-sm text-warm-gray mt-1 flex items-center gap-1"><Clock size={12} /> Claimed {formatDateTime(claim.createdAt)}</div>
                </div>
                <ChevronRight size={20} className="text-warm-gray-light" />
              </Link>
              <RecipientClaimActions claim={claim} onAction={fetchDashboard} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, isAuthenticated, resendVerification } = useAuth();

  if (!isAuthenticated || !user) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-green-deep mb-4">Sign in required</h1>
        <p className="text-warm-gray mb-6">Please sign in to access your dashboard.</p>
        <Button onClick={() => navigate('/signin')}>Sign In</Button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-green-deep mb-1">Welcome back, {user.name.split(' ')[0]}</h1>
        <p className="text-warm-gray flex items-center gap-2">
          <Badge variant="green">{ROLE_LABELS[user.role]}</Badge>
          {user.verified && <span className="flex items-center gap-1 text-sm text-green-primary"><CheckCircle size={14} /> Verified</span>}
        </p>
      </div>
      <VerificationBanner user={user} onResend={resendVerification} />
      {isDonorRole(user.role) ? <DonorDashboard /> : isRecipientRole(user.role) ? <RecipientDashboard /> : null}
    </div>
  );
}
