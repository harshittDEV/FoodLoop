import { useState } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { FOOD_CATEGORIES, DIETARY_TAGS } from '../../utils/constants';

export default function FoodFilters({ filters, onFilterChange }) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const updateFilter = (key, value) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFilterChange({
      search: '',
      category: '',
      priceType: 'all',
      dietaryTags: [],
      donorType: 'all',
    });
  };

  const hasActiveFilters = filters.search || filters.category || filters.priceType !== 'all' ||
    filters.dietaryTags.length > 0 || filters.donorType !== 'all';

  return (
    <div className="space-y-4">
      {/* Search bar */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-warm-gray-light" />
          <input
            type="search"
            placeholder="Search food listings…"
            value={filters.search}
            onChange={(e) => updateFilter('search', e.target.value)}
            className="input-field pl-11"
            aria-label="Search food listings"
          />
        </div>
        <button
          onClick={() => setShowAdvanced(v => !v)}
          className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 font-medium transition-colors ${
            showAdvanced ? 'bg-green-primary text-cream border-green-primary' : 'border-green-pale text-warm-gray hover:border-green-muted'
          }`}
          aria-expanded={showAdvanced}
          aria-label="Toggle filters"
        >
          <SlidersHorizontal size={18} />
          <span className="hidden sm:inline">Filters</span>
        </button>
      </div>

      {/* Advanced filters */}
      {showAdvanced && (
        <div className="card !p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-green-deep">Filter options</h3>
            {hasActiveFilters && (
              <button onClick={clearFilters} className="text-sm text-terracotta hover:text-terracotta-light flex items-center gap-1">
                <X size={14} /> Clear all
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Category */}
            <div>
              <label htmlFor="filter-category" className="block text-sm font-medium text-green-deep mb-1">Category</label>
              <select
                id="filter-category"
                value={filters.category}
                onChange={(e) => updateFilter('category', e.target.value)}
                className="input-field text-sm"
              >
                <option value="">All categories</option>
                {FOOD_CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Price type */}
            <div>
              <label htmlFor="filter-price" className="block text-sm font-medium text-green-deep mb-1">Price</label>
              <select
                id="filter-price"
                value={filters.priceType}
                onChange={(e) => updateFilter('priceType', e.target.value)}
                className="input-field text-sm"
              >
                <option value="all">All</option>
                <option value="free">Free only</option>
                <option value="paid">Low price</option>
              </select>
            </div>

            {/* Donor type */}
            <div>
              <label htmlFor="filter-donor" className="block text-sm font-medium text-green-deep mb-1">Donor type</label>
              <select
                id="filter-donor"
                value={filters.donorType}
                onChange={(e) => updateFilter('donorType', e.target.value)}
                className="input-field text-sm"
              >
                <option value="all">All donors</option>
                <option value="individual_donor">Individuals</option>
                <option value="restaurant_donor">Restaurants</option>
              </select>
            </div>
          </div>

          {/* Dietary tags */}
          <div>
            <p className="text-sm font-medium text-green-deep mb-2">Dietary preferences</p>
            <div className="flex flex-wrap gap-2">
              {DIETARY_TAGS.map(tag => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => {
                    const tags = filters.dietaryTags.includes(tag)
                      ? filters.dietaryTags.filter(t => t !== tag)
                      : [...filters.dietaryTags, tag];
                    updateFilter('dietaryTags', tags);
                  }}
                  className={`px-3 py-1 rounded-full text-sm font-medium border transition-all ${
                    filters.dietaryTags.includes(tag)
                      ? 'bg-green-primary text-cream border-green-primary'
                      : 'bg-white text-warm-gray border-green-pale hover:border-green-muted'
                  }`}
                  aria-pressed={filters.dietaryTags.includes(tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
