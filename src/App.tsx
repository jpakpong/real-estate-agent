import React, { useState, useEffect } from 'react';
import { Property, FilterState, Booking } from './types';
import { PROPERTIES } from './data/properties';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { InteractiveMap } from './components/InteractiveMap';
import { PropertyGrid } from './components/PropertyGrid';
import { PropertyDetailModal } from './components/PropertyDetailModal';
import { BookingModal } from './components/BookingModal';
import { MyBookingsDrawer } from './components/MyBookingsDrawer';
import { CompareDrawer } from './components/CompareDrawer';
import { NeighborhoodGuide } from './components/NeighborhoodGuide';
import { MortgageCalculator } from './components/MortgageCalculator';
import { AdvisorySection } from './components/AdvisorySection';
import { Footer } from './components/Footer';

export default function App() {
  const [properties] = useState<Property[]>(PROPERTIES);
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    district: 'all',
    minPrice: 0,
    maxPrice: 5000000,
    bedrooms: 'all',
    sortBy: 'featured',
  });

  const [activeNav, setActiveNav] = useState('home');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(PROPERTIES[0]);
  const [detailProperty, setDetailProperty] = useState<Property | null>(null);
  const [bookingProperty, setBookingProperty] = useState<Property | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isMyBookingsOpen, setIsMyBookingsOpen] = useState(false);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [compareList, setCompareList] = useState<Property[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Local storage for Bookings
  const [bookings, setBookings] = useState<Booking[]>(() => {
    try {
      const stored = localStorage.getItem('aurelia_bookings');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Local storage for Saved properties
  const [savedProperties, setSavedProperties] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('aurelia_saved');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('aurelia_bookings', JSON.stringify(bookings));
    } catch (e) {
      console.error(e);
    }
  }, [bookings]);

  useEffect(() => {
    try {
      localStorage.setItem('aurelia_saved', JSON.stringify(savedProperties));
    } catch (e) {
      console.error(e);
    }
  }, [savedProperties]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  const handleOpenBooking = (property?: Property) => {
    setBookingProperty(property || selectedProperty || properties[0]);
    setIsBookingOpen(true);
  };

  const handleConfirmBooking = (newBooking: Booking) => {
    setBookings((prev) => [newBooking, ...prev]);
    showToast(`Viewing appointment reserved: ${newBooking.id}`);
  };

  const handleCancelBooking = (bookingId: string) => {
    setBookings((prev) => prev.filter((b) => b.id !== bookingId));
    showToast('Viewing appointment cancelled.');
  };

  const handleToggleSave = (id: string) => {
    if (savedProperties.includes(id)) {
      setSavedProperties((prev) => prev.filter((item) => item !== id));
      showToast('Removed from saved residences.');
    } else {
      setSavedProperties((prev) => [...prev, id]);
      showToast('Saved to your private collection.');
    }
  };

  const handleToggleCompare = (property: Property) => {
    if (compareList.some((p) => p.id === property.id)) {
      setCompareList((prev) => prev.filter((p) => p.id !== property.id));
      showToast(`Removed ${property.title.split(' at ')[0]} from comparison.`);
    } else {
      if (compareList.length >= 3) {
        showToast('Maximum 3 residences can be compared simultaneously.');
        return;
      }
      setCompareList((prev) => [...prev, property]);
      showToast(`Added ${property.title.split(' at ')[0]} to comparison.`);
    }
  };

  const handlePinOnMap = (property: Property) => {
    setSelectedProperty(property);
    const mapEl = document.getElementById('interactive-map-section');
    if (mapEl) {
      mapEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectDistrictFromGuide = (districtName: string) => {
    setFilters((prev) => ({ ...prev, district: districtName }));
    const el = document.getElementById('residences-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleExploreMap = () => {
    const mapEl = document.getElementById('interactive-map-section');
    if (mapEl) {
      mapEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Filtered properties count for Hero
  const totalMatches = properties.filter((prop) => {
    if (filters.district !== 'all' && prop.district !== filters.district) return false;
    if (filters.bedrooms !== 'all') {
      const beds = Number(filters.bedrooms);
      if (beds === 4 && prop.beds < 4) return false;
      if (beds < 4 && prop.beds !== beds) return false;
    }
    if (prop.price > filters.maxPrice) return false;
    return true;
  }).length;

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-neutral-900 flex flex-col font-sans selection:bg-amber-100 selection:text-amber-950">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-neutral-900 text-white text-xs font-medium px-4 py-2.5 rounded-lg shadow-xl border border-neutral-700 animate-fade-in flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Bar Navigation (Strict 3-zone contract) */}
      <Navbar
        onOpenBooking={() => handleOpenBooking()}
        onOpenMyBookings={() => setIsMyBookingsOpen(true)}
        onOpenCompare={() => setIsCompareOpen(true)}
        bookings={bookings}
        savedProperties={savedProperties}
        compareList={compareList}
        activeNav={activeNav}
        setActiveNav={setActiveNav}
      />

      <main className="flex-1">
        {/* 1. Hero Section with Dominant Focal Carrier & Adjacent Proof */}
        <HeroSection
          filters={filters}
          setFilters={setFilters}
          totalMatches={totalMatches}
          onExploreMap={handleExploreMap}
          onBookViewing={() => handleOpenBooking()}
        />

        {/* 2. Interactive City Center Map */}
        <InteractiveMap
          properties={properties}
          selectedProperty={selectedProperty}
          onSelectProperty={(prop) => setSelectedProperty(prop)}
          onViewDetails={(prop) => setDetailProperty(prop)}
          onBookViewing={(prop) => handleOpenBooking(prop)}
        />

        {/* 3. Curated Residences Grid & Filter Bar */}
        <PropertyGrid
          properties={properties}
          filters={filters}
          setFilters={setFilters}
          onViewDetails={(prop) => setDetailProperty(prop)}
          onBookViewing={(prop) => handleOpenBooking(prop)}
          savedProperties={savedProperties}
          onToggleSave={handleToggleSave}
          compareList={compareList}
          onToggleCompare={handleToggleCompare}
          onPinOnMap={handlePinOnMap}
        />

        {/* 4. Metropolitan District Topography Guide */}
        <NeighborhoodGuide onSelectDistrict={handleSelectDistrictFromGuide} />

        {/* 5. Carrying Cost & Mortgage Outlay Calculator */}
        <MortgageCalculator onBookViewing={() => handleOpenBooking()} />

        {/* 6. Private Client Practice & Advisory */}
        <AdvisorySection onBookViewing={() => handleOpenBooking()} />
      </main>

      {/* Quiet Footer */}
      <Footer />

      {/* Modals & Slide-overs */}
      <PropertyDetailModal
        property={detailProperty}
        onClose={() => setDetailProperty(null)}
        onBookViewing={(prop) => {
          setDetailProperty(null);
          handleOpenBooking(prop);
        }}
        isSaved={detailProperty ? savedProperties.includes(detailProperty.id) : false}
        onToggleSave={handleToggleSave}
        onPinOnMap={handlePinOnMap}
      />

      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        property={bookingProperty}
        allProperties={properties}
        onConfirmBooking={handleConfirmBooking}
      />

      <MyBookingsDrawer
        isOpen={isMyBookingsOpen}
        onClose={() => setIsMyBookingsOpen(false)}
        bookings={bookings}
        onCancelBooking={handleCancelBooking}
        onBookNew={() => {
          setIsMyBookingsOpen(false);
          handleOpenBooking();
        }}
      />

      <CompareDrawer
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        compareList={compareList}
        onRemoveFromCompare={(id) =>
          setCompareList((prev) => prev.filter((p) => p.id !== id))
        }
        onClearCompare={() => setCompareList([])}
        onBookViewing={(prop) => {
          setIsCompareOpen(false);
          handleOpenBooking(prop);
        }}
        onViewDetails={(prop) => {
          setIsCompareOpen(false);
          setDetailProperty(prop);
        }}
      />
    </div>
  );
}
