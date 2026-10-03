import React, { useState } from 'react';
import { Property } from '../types';
import { Bookmark, Scale, Calendar, ChevronLeft, ChevronRight, MapPin, Check } from 'lucide-react';

interface PropertyCardProps {
  property: Property;
  onViewDetails: (property: Property) => void;
  onBookViewing: (property: Property) => void;
  isSaved: boolean;
  onToggleSave: (id: string) => void;
  isCompared: boolean;
  onToggleCompare: (property: Property) => void;
  onPinOnMap: (property: Property) => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  onViewDetails,
  onBookViewing,
  isSaved,
  onToggleSave,
  isCompared,
  onToggleCompare,
  onPinOnMap,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % property.gallery.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + property.gallery.length) % property.gallery.length);
  };

  return (
    <article className="group bg-white rounded-xl overflow-hidden border border-neutral-200/90 hover:border-neutral-400 hover:shadow-xl transition-all duration-300 flex flex-col">
      {/* Property Imagery with Interactive Carousel */}
      <div
        className="relative h-64 sm:h-72 overflow-hidden cursor-pointer bg-neutral-100"
        onClick={() => onViewDetails(property)}
      >
        <img
          src={property.gallery[currentImageIndex]?.url || property.heroImage}
          alt={`${property.title} - ${property.gallery[currentImageIndex]?.title || 'View'}`}
          className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out"
          referrerPolicy="no-referrer"
        />

        {/* Measured dark overlay for contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

        {/* Top Badges / Actions */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
          {/* Subtle status label */}
          <span className="text-xs font-medium text-white/95 drop-shadow-sm tracking-wide">
            {property.district} · {property.floor}
          </span>

          {/* Save & Compare Quick Affordances */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleCompare(property);
              }}
              title={isCompared ? 'Remove from comparison' : 'Compare flat'}
              className={`p-2 rounded-md backdrop-blur-md transition-colors cursor-pointer ${
                isCompared
                  ? 'bg-amber-400 text-neutral-950 shadow-md'
                  : 'bg-black/40 hover:bg-black/60 text-white'
              }`}
            >
              <Scale className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleSave(property.id);
              }}
              title={isSaved ? 'Remove from saved' : 'Save residence'}
              className={`p-2 rounded-md backdrop-blur-md transition-colors cursor-pointer ${
                isSaved
                  ? 'bg-red-500 text-white shadow-md'
                  : 'bg-black/40 hover:bg-black/60 text-white'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

        {/* Carousel Prev/Next Buttons (revealed on hover) */}
        {property.gallery.length > 1 && (
          <>
            <button
              onClick={prevImage}
              aria-label="Previous photo"
              className="absolute left-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-10"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextImage}
              aria-label="Next photo"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-10"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}

        {/* Photo Index indicator dots */}
        <div className="absolute bottom-3 right-3 z-10 flex items-center gap-1 bg-black/50 px-2 py-0.5 rounded-full text-[10px] text-white backdrop-blur-xs">
          <span>{currentImageIndex + 1}</span>
          <span className="opacity-60">/</span>
          <span>{property.gallery.length}</span>
        </div>

        {/* Price tag on photo */}
        <div className="absolute bottom-3 left-3 z-10">
          <div className="font-serif text-2xl font-bold text-white drop-shadow-md tabular-nums tracking-tight">
            {property.priceFormatted}
          </div>
        </div>
      </div>

      {/* Card Content & Zero-Pill Typography */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Card Header & Title */}
          <h3
            onClick={() => onViewDetails(property)}
            className="font-serif text-xl font-medium text-neutral-900 group-hover:text-amber-950 transition-colors cursor-pointer line-clamp-1 mb-1"
          >
            {property.title}
          </h3>

          <p className="text-xs text-neutral-500 mb-3 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
            <span className="truncate">{property.address}</span>
          </p>

          {/* Clean Unboxed Metadata (Zero-Pill Compliance) */}
          <div className="flex items-center gap-2 text-xs text-neutral-600 mb-4 pb-3 border-b border-neutral-100 font-medium">
            <span>{property.beds} Bedrooms</span>
            <span aria-hidden="true" className="text-neutral-300">·</span>
            <span>{property.baths} Bathrooms</span>
            <span aria-hidden="true" className="text-neutral-300">·</span>
            <span className="tabular-nums">{property.sqft.toLocaleString()} sq ft</span>
            <span aria-hidden="true" className="text-neutral-300">·</span>
            <span className={property.status === 'Available' ? 'text-emerald-700' : 'text-neutral-700'}>
              {property.status}
            </span>
          </div>

          {/* Concise architectural snippet */}
          <p className="text-xs text-neutral-600 line-clamp-2 leading-relaxed mb-4">
            {property.tagline}
          </p>

          {/* Subtle Key Highlights */}
          <div className="text-[11px] text-neutral-500 space-y-1 mb-5">
            {property.highlights.slice(0, 2).map((highlight, idx) => (
              <div key={idx} className="flex items-center gap-1.5 truncate">
                <span className="w-1 h-1 rounded-full bg-amber-600 shrink-0" />
                <span className="truncate">{highlight}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Controls */}
        <div className="pt-3 border-t border-neutral-100 flex items-center justify-between gap-2">
          <button
            onClick={() => onPinOnMap(property)}
            className="py-2 px-3 text-xs font-medium text-neutral-700 hover:text-neutral-950 hover:bg-neutral-100 rounded-md transition-colors cursor-pointer flex items-center gap-1"
          >
            <MapPin className="w-3.5 h-3.5 text-amber-700" />
            <span>Locate on Map</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onViewDetails(property)}
              className="py-2 px-3 text-xs font-medium text-neutral-800 hover:bg-neutral-100 border border-neutral-300 rounded-md transition-colors cursor-pointer whitespace-nowrap"
            >
              Specifications
            </button>

            <button
              onClick={() => onBookViewing(property)}
              className="py-2 px-3 text-xs font-medium text-white bg-neutral-900 hover:bg-neutral-800 rounded-md transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap shadow-sm"
            >
              <Calendar className="w-3.5 h-3.5 text-amber-300" />
              <span>Book Viewing</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};
