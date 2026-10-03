import React from 'react';
import { Search, MapPin, BedDouble, DollarSign, ArrowRight, ShieldCheck, Award, Building2 } from 'lucide-react';
import heroPenthouseImg from '../assets/images/hero_city_penthouse_1791027923794.jpg';
import { FilterState } from '../types';

interface HeroSectionProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  totalMatches: number;
  onExploreMap: () => void;
  onBookViewing: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  filters,
  setFilters,
  totalMatches,
  onExploreMap,
  onBookViewing,
}) => {
  const handleScrollToResidences = () => {
    const el = document.getElementById('residences-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative overflow-hidden bg-neutral-950 text-neutral-100">
      {/* Background Image Container with Measured Contrast Scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroPenthouseImg}
          alt="Prime City Center Penthouse Living Room overlooking downtown skyline"
          className="w-full h-full object-cover object-center opacity-45 scale-[1.02] transform transition-transform duration-1000"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/60 to-neutral-950/30" />
        <div className="absolute inset-0 bg-radial from-transparent via-neutral-950/40 to-neutral-950/90" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 sm:pt-28 sm:pb-32">
        <div className="max-w-3xl">
          {/* Natural Editorial Kicker */}
          <div className="inline-flex items-center gap-2 mb-4 text-xs font-medium text-amber-200/90 tracking-wider uppercase">
            <Building2 className="w-3.5 h-3.5 text-amber-300" />
            <span>Prime City Center Residential Agency</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-medium tracking-tight text-white leading-[1.1] mb-6 text-balance">
            Exceptional flats in the beating heart of the city.
          </h1>

          <p className="text-base sm:text-lg text-neutral-300 leading-relaxed max-w-2xl mb-10 font-normal">
            We curate and represent prime residential apartments, private terraces, and penthouse sanctuaries exclusively situated within the central metropolitan district.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-4 mb-16">
            <button
              onClick={handleScrollToResidences}
              className="px-6 py-3.5 text-sm font-semibold text-neutral-950 bg-amber-100 hover:bg-amber-200 rounded-md transition-all duration-200 flex items-center gap-2 cursor-pointer shadow-lg shadow-black/30"
            >
              <span>Explore Available Residences</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onExploreMap}
              className="px-6 py-3.5 text-sm font-medium text-neutral-100 bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-700/80 rounded-md transition-all duration-200 flex items-center gap-2 cursor-pointer backdrop-blur-sm"
            >
              <MapPin className="w-4 h-4 text-amber-400" />
              <span>Interactive City Center Map</span>
            </button>
          </div>
        </div>

        {/* Quick Search & Filter Panel */}
        <div className="bg-white/95 backdrop-blur-md rounded-xl p-5 shadow-2xl border border-neutral-200/60 text-neutral-900">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            {/* District Selector */}
            <div>
              <label className="block text-xs font-semibold text-neutral-600 mb-1.5 uppercase tracking-wider">
                City District
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
                <select
                  value={filters.district}
                  onChange={(e) => setFilters((prev) => ({ ...prev, district: e.target.value }))}
                  className="w-full pl-9 pr-8 py-2.5 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 rounded-md text-xs sm:text-sm text-neutral-900 font-medium focus:ring-2 focus:ring-amber-500/20 focus:border-amber-700 transition-colors cursor-pointer"
                >
                  <option value="all">All City Center Districts</option>
                  <option value="Financial Core">Financial Core</option>
                  <option value="Arts & Culture Quarter">Arts & Culture Quarter</option>
                  <option value="Civic & Central Gardens">Civic & Central Gardens</option>
                  <option value="Harbor Waterfront">Harbor Waterfront</option>
                  <option value="Historic Promenade">Historic Promenade</option>
                </select>
              </div>
            </div>

            {/* Bedroom Filter */}
            <div>
              <label className="block text-xs font-semibold text-neutral-600 mb-1.5 uppercase tracking-wider">
                Bedrooms
              </label>
              <div className="relative">
                <BedDouble className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
                <select
                  value={filters.bedrooms}
                  onChange={(e) => setFilters((prev) => ({ ...prev, bedrooms: e.target.value }))}
                  className="w-full pl-9 pr-8 py-2.5 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 rounded-md text-xs sm:text-sm text-neutral-900 font-medium focus:ring-2 focus:ring-amber-500/20 focus:border-amber-700 transition-colors cursor-pointer"
                >
                  <option value="all">Any Bedrooms (1 - 4+)</option>
                  <option value="1">1 Bedroom Flats</option>
                  <option value="2">2 Bedroom Flats</option>
                  <option value="3">3 Bedroom Flats</option>
                  <option value="4">4+ Bedroom Penthouses</option>
                </select>
              </div>
            </div>

            {/* Price Filter */}
            <div>
              <label className="block text-xs font-semibold text-neutral-600 mb-1.5 uppercase tracking-wider">
                Max Price
              </label>
              <div className="relative">
                <DollarSign className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
                <select
                  value={filters.maxPrice}
                  onChange={(e) => setFilters((prev) => ({ ...prev, maxPrice: Number(e.target.value) }))}
                  className="w-full pl-9 pr-8 py-2.5 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 rounded-md text-xs sm:text-sm text-neutral-900 font-medium focus:ring-2 focus:ring-amber-500/20 focus:border-amber-700 transition-colors cursor-pointer"
                >
                  <option value={5000000}>Up to $5,000,000</option>
                  <option value={3500000}>Up to $3,500,000</option>
                  <option value={2500000}>Up to $2,500,000</option>
                  <option value={1800000}>Up to $1,800,000</option>
                  <option value={1200000}>Up to $1,200,000</option>
                </select>
              </div>
            </div>

            {/* Search Button / Trigger */}
            <div className="flex gap-2">
              <button
                onClick={handleScrollToResidences}
                className="w-full py-2.5 px-4 bg-neutral-900 hover:bg-neutral-800 text-white font-medium text-xs sm:text-sm rounded-md transition-colors flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap shadow-sm"
              >
                <Search className="w-4 h-4" />
                <span>Show {totalMatches} Flats</span>
              </button>
            </div>
          </div>
        </div>

        {/* Claim-to-Proof Adjacency (Quantitative Precision) */}
        <div className="mt-14 pt-8 border-t border-neutral-800/80 grid grid-cols-2 sm:grid-cols-4 gap-6 text-neutral-300">
          <div>
            <div className="font-serif text-2xl sm:text-3xl text-white font-medium tabular-nums">$840M+</div>
            <div className="text-xs text-neutral-400 mt-1">Prime City Center Transacted</div>
          </div>
          <div>
            <div className="font-serif text-2xl sm:text-3xl text-white font-medium tabular-nums">18 Days</div>
            <div className="text-xs text-neutral-400 mt-1">Average Contract Finalization</div>
          </div>
          <div>
            <div className="font-serif text-2xl sm:text-3xl text-white font-medium tabular-nums">100%</div>
            <div className="text-xs text-neutral-400 mt-1">Downtown Residential Focus</div>
          </div>
          <div>
            <div className="font-serif text-2xl sm:text-3xl text-white font-medium tabular-nums">98.4%</div>
            <div className="text-xs text-neutral-400 mt-1">Buyer Satisfaction Score</div>
          </div>
        </div>
      </div>
    </div>
  );
};
