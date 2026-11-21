import { useState, useEffect, useCallback } from 'react';
import { Package, ChevronLeft, ChevronRight } from 'lucide-react';
import { apiBrowseOffers } from '../utils/api';
import FoodCard from '../components/food/FoodCard';
import FoodFilters from '../components/food/FoodFilters';
import EmptyState from '../components/common/EmptyState';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function Browse() {
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    priceType: 'all',
    dietaryTags: [],
    donorType: 'all',
  });
  const [page, setPage] = useState(0);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchOffers = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const result = await apiBrowseOffers({
        search: filters.search || undefined,
        category: filters.category || undefined,
        donorType: filters.donorType,
        priceType: filters.priceType,
        page,
        size: 12,
      });
      setData(result);
    } catch (err) {
      setError(err.message || 'Failed to load listings');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [filters.search, filters.category, filters.donorType, filters.priceType, page]);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchOffers();
    }, filters.search ? 400 : 0);
    return () => clearTimeout(timer);
  }, [fetchOffers]);

  // Reset page when any filter criteria changes
  useEffect(() => {
    setPage(0);
  }, [filters.search, filters.category, filters.donorType, filters.priceType]);

  const listings = data?.content || [];
  const totalElements = data?.totalElements || 0;
  const totalPages = data?.totalPages || 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-green-deep mb-2">Find food near you</h1>
        <p className="text-warm-gray">Browse available food from donors in your community</p>
      </div>
      <FoodFilters filters={filters} onFilterChange={setFilters} />
      <div className="mt-6 mb-4">
        <p className="text-sm text-warm-gray">
          {loading ? 'Loading…' : `${totalElements} ${totalElements === 1 ? 'listing' : 'listings'} available`}
        </p>
      </div>
      {error && (
        <div className="p-4 rounded-xl bg-danger/10 text-danger text-sm mb-6" role="alert">{error}</div>
      )}
      {loading ? (
        <div className="py-16"><LoadingSpinner /></div>
      ) : listings.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map(listing => (
              <FoodCard key={listing.id} listing={listing} />
            ))}
          </div>
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-10">
              <button
                onClick={() => setPage(p => Math.max(0, p - 1))}
                disabled={page === 0}
                className="flex items-center gap-1 px-4 py-2 rounded-xl border-2 border-green-pale text-warm-gray hover:border-green-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={16} /> Previous
              </button>
              <span className="text-sm text-warm-gray">Page {page + 1} of {totalPages}</span>
              <button
                onClick={() => setPage(p => p + 1)}
                disabled={page >= totalPages - 1}
                className="flex items-center gap-1 px-4 py-2 rounded-xl border-2 border-green-pale text-warm-gray hover:border-green-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Next <ChevronRight size={16} />
              </button>
            </div>
          )}
        </>
      ) : (
        <EmptyState icon={Package} title="No listings found" description="Try adjusting your filters or check back soon for new food offers." />
      )}
    </div>
  );
}
