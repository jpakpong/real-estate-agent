import React from 'react';
import { CalendarCheck, Scale, Bookmark } from 'lucide-react';
import { Booking, Property } from '../types';

interface NavbarProps {
  onOpenBooking: (property?: Property) => void;
  onOpenMyBookings: () => void;
  onOpenCompare: () => void;
  bookings: Booking[];
  savedProperties: string[];
  compareList: Property[];
  activeNav: string;
  setActiveNav: (nav: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenBooking,
  onOpenMyBookings,
  onOpenCompare,
  bookings,
  savedProperties,
  compareList,
  activeNav,
  setActiveNav,
}) => {
  const scrollTo = (id: string, navKey: string) => {
    setActiveNav(navKey);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF9F6]/90 backdrop-blur-md border-b border-neutral-200/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setActiveNav('home');
          }}
          className="text-2xl font-serif tracking-tight text-neutral-900 font-semibold hover:text-amber-950 transition-colors whitespace-nowrap"
        >
          Aurelia Metropolitan
        </a>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-600">
          <button
            onClick={() => scrollTo('residences-section', 'residences')}
            className={`transition-colors whitespace-nowrap cursor-pointer hover:text-neutral-950 ${
              activeNav === 'residences' ? 'text-neutral-950 font-semibold' : ''
            }`}
          >
            Residences
          </button>
          <button
            onClick={() => scrollTo('interactive-map-section', 'map')}
            className={`transition-colors whitespace-nowrap cursor-pointer hover:text-neutral-950 ${
              activeNav === 'map' ? 'text-neutral-950 font-semibold' : ''
            }`}
          >
            City Map
          </button>
          <button
            onClick={() => scrollTo('districts-section', 'districts')}
            className={`transition-colors whitespace-nowrap cursor-pointer hover:text-neutral-950 ${
              activeNav === 'districts' ? 'text-neutral-950 font-semibold' : ''
            }`}
          >
            Neighborhoods
          </button>
          <button
            onClick={() => scrollTo('calculator-section', 'calculator')}
            className={`transition-colors whitespace-nowrap cursor-pointer hover:text-neutral-950 ${
              activeNav === 'calculator' ? 'text-neutral-950 font-semibold' : ''
            }`}
          >
            Mortgage Outlay
          </button>
          <button
            onClick={() => scrollTo('agency-section', 'about')}
            className={`transition-colors whitespace-nowrap cursor-pointer hover:text-neutral-950 ${
              activeNav === 'about' ? 'text-neutral-950 font-semibold' : ''
            }`}
          >
            Private Office
          </button>
        </nav>

        {/* Zone 3: Primary actions */}
        <div className="flex items-center gap-3 shrink-0">
          {compareList.length > 0 && (
            <button
              onClick={onOpenCompare}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-neutral-700 hover:text-neutral-900 bg-neutral-100 hover:bg-neutral-200/80 rounded-md transition-colors cursor-pointer"
              title="Compare selected flats"
            >
              <Scale className="w-3.5 h-3.5 text-neutral-600" />
              <span className="hidden sm:inline">Compare</span>
              <span className="text-xs bg-neutral-800 text-white rounded-full px-1.5 py-0.2">
                {compareList.length}
              </span>
            </button>
          )}

          {bookings.length > 0 && (
            <button
              onClick={onOpenMyBookings}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200/70 rounded-md transition-colors cursor-pointer"
              title="View my booked viewings"
            >
              <CalendarCheck className="w-3.5 h-3.5 text-amber-800" />
              <span className="hidden sm:inline">Viewings</span>
              <span className="text-xs font-bold text-amber-900">({bookings.length})</span>
            </button>
          )}

          <button
            onClick={() => onOpenBooking()}
            className="px-4 py-2 text-xs font-medium text-neutral-50 bg-neutral-900 hover:bg-neutral-800 rounded-md transition-colors cursor-pointer whitespace-nowrap shadow-sm hover:shadow"
          >
            Book Private Viewing
          </button>
        </div>
      </div>
    </header>
  );
};
