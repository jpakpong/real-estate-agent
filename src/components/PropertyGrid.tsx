import React, { useState } from 'react';
import { Property, FilterState } from '../types';
import { PropertyCard } from './PropertyCard';
import { LayoutGrid, List, SlidersHorizontal, RotateCcw } from 'lucide-react';

interface PropertyGridProps {
  properties: Property[];
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  onViewDetails: (property: Property) => void;
  onBookViewing: (property: Property) => void;
  savedProperties: string[];
  onToggleSave: (id: string) => void;
  compareList: Property[];
  onToggleCompare: (property: Property) => void;
  onPinOnMap: (property: Property) => void;
}

export const PropertyGrid: React.FC<PropertyGridProps> = ({
  properties,
  filters,
  setFilters,
  onViewDetails,
  onBookViewing,
  savedProperties,
  onToggleSave,
  compareList,
  onToggleCompare,
  onPinOnMap,
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Filter logic
  const filtered = properties
    .filter((prop) => {
      if (filters.district !== 'all' && prop.district !== filters.district) {
        return false;
      }
      if (filters.bedrooms !== 'all') {
        const beds = Number(filters.bedrooms);
        if (beds === 4 && prop.beds < 4) return false;
        if (beds < 4 && prop.beds !== beds) return false;
      }
      if (prop.price > filters.maxPrice) {
        return false;
      }
      if (filters.searchQuery.trim() !== '') {
        const q = filters.searchQuery.toLowerCase();
        const matchTitle = prop.title.toLowerCase().includes(q);
        const matchAddr = prop.address.toLowerCase().includes(q);
        const matchDist = prop.district.toLowerCase().includes(q);
        if (!matchTitle && !matchAddr && !matchDist) return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (filters.sortBy === 'price-asc') return a.price - b.price;
      if (filters.sortBy === 'price-desc') return b.price - a.price;
      if (filters.sortBy === 'sqft-desc') return b.sqft - a.sqft;
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });

  const resetFilters = () => {
    setFilters({
      searchQuery: '',
      district: 'all',
      minPrice: 0,
      maxPrice: 5000000,
      bedrooms: 'all',
      sortBy: 'featured',
    });
  };

  return (
    <section id="residences-section" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Title & Editorial Subtext */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-6 border-b border-neutral-200 gap-4">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-amber-900 mb-1">
            Curated Portfolio
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-medium text-neutral-900">
            Available Residences
          </h2>
          <p className="text-sm text-neutral-600 mt-1 max-w-xl">
            Each flat has been vetted for prime location, architectural integrity, and long-term capital preservation.
          </p>
        </div>

        {/* View mode toggle & sorting */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-neutral-600">
            <span>Sort:</span>
            <select
              value={filters.sortBy}
              onChange={(e) => setFilters((prev) => ({ ...prev, sortBy: e.target.value as any }))}
              className="bg-white border border-neutral-300 rounded-md px-2.5 py-1.5 text-xs font-medium text-neutral-800 focus:ring-1 focus:ring-neutral-800 cursor-pointer"
            >
              <option value="featured">Featured Collection</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="sqft-desc">Largest Interior (Sq Ft)</option>
            </select>
          </div>

          <div className="hidden sm:flex items-center bg-neutral-200/80 p-0.5 rounded-md">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded text-xs transition-colors cursor-pointer ${
                viewMode === 'grid' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-600 hover:text-neutral-900'
              }`}
              title="Grid view"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded text-xs transition-colors cursor-pointer ${
                viewMode === 'list' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-600 hover:text-neutral-900'
              }`}
              title="List view"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Quick Search */}
      <div className="mb-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* District Filter Bar */}
        <div className="flex flex-wrap items-center gap-1.5">
          {['all', 'Financial Core', 'Arts & Culture Quarter', 'Civic & Central Gardens', 'Harbor Waterfront', 'Historic Promenade'].map((dist) => (
            <button
              key={dist}
              onClick={() => setFilters((prev) => ({ ...prev, district: dist }))}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                filters.district === dist
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
              }`}
            >
              {dist === 'all' ? 'All Districts' : dist}
            </button>
          ))}
        </div>

        {/* Counter & Clear Filters if any */}
        <div className="flex items-center gap-3 text-xs text-neutral-500 justify-end">
          <span className="tabular-nums font-medium text-neutral-800">
            {filtered.length} of {properties.length} Residences
          </span>
          {(filters.district !== 'all' || filters.bedrooms !== 'all' || filters.maxPrice < 5000000 || filters.searchQuery) && (
            <button
              onClick={resetFilters}
              className="inline-flex items-center gap-1 text-amber-800 hover:text-amber-950 font-medium underline underline-offset-2 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Properties Display Grid */}
      {filtered.length > 0 ? (
        <div
          className={`grid gap-8 ${
            viewMode === 'grid'
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
              : 'grid-cols-1 max-w-4xl mx-auto'
          }`}
        >
          {filtered.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              onViewDetails={onViewDetails}
              onBookViewing={onBookViewing}
              isSaved={savedProperties.includes(property.id)}
              onToggleSave={onToggleSave}
              isCompared={compareList.some((p) => p.id === property.id)}
              onToggleCompare={onToggleCompare}
              onPinOnMap={onPinOnMap}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 px-4 bg-white rounded-xl border border-dashed border-neutral-300">
          <SlidersHorizontal className="w-10 h-10 text-neutral-400 mx-auto mb-3" />
          <h3 className="font-serif text-xl font-medium text-neutral-800 mb-1">
            No residences match your current criteria
          </h3>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto mb-5">
            Try adjusting your bedroom count, district selection, or maximum budget to reveal available city center flats.
          </p>
          <button
            onClick={resetFilters}
            className="px-4 py-2 text-xs font-semibold text-neutral-900 bg-neutral-100 hover:bg-neutral-200 rounded-md transition-colors cursor-pointer"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </section>
  );
};
