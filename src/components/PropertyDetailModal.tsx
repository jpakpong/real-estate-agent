import React, { useState } from 'react';
import { Property } from '../types';
import {
  X,
  Calendar,
  Share2,
  Bookmark,
  MapPin,
  Check,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Compass,
  Train,
  Sparkles,
  Phone,
  Mail,
  ShieldCheck,
  FileText,
  Building2,
} from 'lucide-react';

interface PropertyDetailModalProps {
  property: Property | null;
  onClose: () => void;
  onBookViewing: (property: Property) => void;
  isSaved: boolean;
  onToggleSave: (id: string) => void;
  onPinOnMap: (property: Property) => void;
}

export const PropertyDetailModal: React.FC<PropertyDetailModalProps> = ({
  property,
  onClose,
  onBookViewing,
  isSaved,
  onToggleSave,
  onPinOnMap,
}) => {
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [activeTab, setActiveTab] = useState<'overview' | 'floorplan' | 'neighborhood' | 'financials'>('overview');
  const [copySuccess, setCopySuccess] = useState(false);

  if (!property) return null;

  const nextPhoto = () => {
    setActivePhotoIdx((prev) => (prev + 1) % property.gallery.length);
  };

  const prevPhoto = () => {
    setActivePhotoIdx((prev) => (prev - 1 + property.gallery.length) % property.gallery.length);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 lg:p-8">
      <div className="relative bg-white rounded-2xl max-w-5xl w-full shadow-2xl border border-neutral-300 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Modal Top Bar */}
        <div className="p-4 px-6 border-b border-neutral-200 flex items-center justify-between bg-neutral-50 shrink-0">
          <div className="flex items-center gap-2 text-xs text-neutral-500">
            <span className="font-semibold text-amber-950">{property.district}</span>
            <span>·</span>
            <span>{property.floor}</span>
            <span>·</span>
            <span className={property.status === 'Available' ? 'text-emerald-700 font-medium' : 'text-neutral-700'}>
              {property.status}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleSave(property.id)}
              className={`p-2 rounded-md border text-xs flex items-center gap-1.5 transition-colors cursor-pointer ${
                isSaved
                  ? 'bg-red-50 text-red-600 border-red-200'
                  : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-100'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
              <span className="hidden sm:inline">{isSaved ? 'Saved' : 'Save'}</span>
            </button>

            <button
              onClick={handleShare}
              className="p-2 rounded-md border border-neutral-200 bg-white hover:bg-neutral-100 text-neutral-700 text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{copySuccess ? 'Copied Link' : 'Share'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-md bg-neutral-200 hover:bg-neutral-300 text-neutral-800 transition-colors cursor-pointer ml-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto flex-1 p-6 sm:p-8">
          {/* Main Photo Gallery Theater */}
          <div className="relative rounded-xl overflow-hidden bg-neutral-950 aspect-video max-h-[460px] mb-4">
            <img
              src={property.gallery[activePhotoIdx]?.url || property.heroImage}
              alt={property.gallery[activePhotoIdx]?.title || property.title}
              className="w-full h-full object-cover transition-opacity duration-300"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

            {/* Nav Arrows */}
            {property.gallery.length > 1 && (
              <>
                <button
                  onClick={prevPhoto}
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-xs transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextPhoto}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-xs transition-colors cursor-pointer"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}

            {/* Bottom Caption & Counter */}
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white pointer-events-none">
              <span className="text-sm font-medium drop-shadow-md">
                {property.gallery[activePhotoIdx]?.title}
              </span>
              <span className="text-xs bg-black/60 px-2.5 py-1 rounded-full backdrop-blur-xs">
                {activePhotoIdx + 1} of {property.gallery.length} Photos
              </span>
            </div>
          </div>

          {/* Thumbnail Strip */}
          <div className="flex gap-2 overflow-x-auto pb-4 mb-8 scrollbar-thin">
            {property.gallery.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActivePhotoIdx(idx)}
                className={`relative w-20 h-14 sm:w-24 sm:h-16 rounded-md overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                  activePhotoIdx === idx ? 'border-amber-700 ring-2 ring-amber-400/40' : 'border-transparent opacity-70 hover:opacity-100'
                }`}
              >
                <img
                  src={img.url}
                  alt={img.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </button>
            ))}
          </div>

          {/* Title, Address & Price Hero Block */}
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-6 border-b border-neutral-200 mb-6">
            <div>
              <h2 className="font-serif text-3xl sm:text-4xl font-medium text-neutral-900 leading-tight">
                {property.title}
              </h2>
              <p className="text-sm text-neutral-600 mt-1 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-amber-800 shrink-0" />
                <span>{property.address}</span>
                <button
                  onClick={() => {
                    onClose();
                    onPinOnMap(property);
                  }}
                  className="text-amber-900 underline font-medium ml-2 cursor-pointer hover:text-amber-950"
                >
                  Locate on Map
                </button>
              </p>
            </div>

            <div className="md:text-right shrink-0">
              <div className="font-serif text-3xl sm:text-4xl font-bold text-neutral-900 tabular-nums">
                {property.priceFormatted}
              </div>
              <div className="text-xs text-neutral-500 mt-1">
                ${Math.round(property.price / property.sqft).toLocaleString()} / sq ft
              </div>
            </div>
          </div>

          {/* Key Metric Line (Unboxed zero-pill layout) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-neutral-50 rounded-xl border border-neutral-200 mb-8">
            <div>
              <div className="text-[11px] text-neutral-500 uppercase tracking-wider">Bedrooms</div>
              <div className="text-lg font-bold text-neutral-900 tabular-nums">{property.beds} Primary Suites</div>
            </div>
            <div>
              <div className="text-[11px] text-neutral-500 uppercase tracking-wider">Bathrooms</div>
              <div className="text-lg font-bold text-neutral-900 tabular-nums">{property.baths} Marble Baths</div>
            </div>
            <div>
              <div className="text-[11px] text-neutral-500 uppercase tracking-wider">Total Area</div>
              <div className="text-lg font-bold text-neutral-900 tabular-nums">{property.sqft.toLocaleString()} sq ft</div>
            </div>
            <div>
              <div className="text-[11px] text-neutral-500 uppercase tracking-wider">Estimated Monthly</div>
              <div className="text-lg font-bold text-neutral-900 tabular-nums">${property.hoaFee.toLocaleString()} HOA</div>
            </div>
          </div>

          {/* Navigation Tabs for Deep Details */}
          <div className="flex border-b border-neutral-200 mb-6 gap-2 sm:gap-6 text-xs sm:text-sm font-medium">
            <button
              onClick={() => setActiveTab('overview')}
              className={`pb-3 border-b-2 transition-colors cursor-pointer ${
                activeTab === 'overview'
                  ? 'border-neutral-950 text-neutral-950 font-bold'
                  : 'border-transparent text-neutral-500 hover:text-neutral-900'
              }`}
            >
              Architectural Overview
            </button>
            <button
              onClick={() => setActiveTab('floorplan')}
              className={`pb-3 border-b-2 transition-colors cursor-pointer ${
                activeTab === 'floorplan'
                  ? 'border-neutral-950 text-neutral-950 font-bold'
                  : 'border-transparent text-neutral-500 hover:text-neutral-900'
              }`}
            >
              Floor Plan & Dimensions
            </button>
            <button
              onClick={() => setActiveTab('neighborhood')}
              className={`pb-3 border-b-2 transition-colors cursor-pointer ${
                activeTab === 'neighborhood'
                  ? 'border-neutral-950 text-neutral-950 font-bold'
                  : 'border-transparent text-neutral-500 hover:text-neutral-900'
              }`}
            >
              Walk Score & Transit
            </button>
            <button
              onClick={() => setActiveTab('financials')}
              className={`pb-3 border-b-2 transition-colors cursor-pointer ${
                activeTab === 'financials'
                  ? 'border-neutral-950 text-neutral-950 font-bold'
                  : 'border-transparent text-neutral-500 hover:text-neutral-900'
              }`}
            >
              Taxes & Ownership
            </button>
          </div>

          {/* Tab 1: Overview */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <div>
                <h4 className="font-serif text-lg font-medium text-neutral-900 mb-2">
                  The Residence
                </h4>
                <p className="text-sm text-neutral-700 leading-relaxed font-normal">
                  {property.description}
                </p>
                <p className="text-sm text-neutral-600 leading-relaxed mt-3 italic">
                  {property.architecturalNotes}
                </p>
              </div>

              {/* Highlights List */}
              <div>
                <h4 className="font-serif text-lg font-medium text-neutral-900 mb-3">
                  Residence Architectural Highlights
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {property.highlights.map((h, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-neutral-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-700 mt-1.5 shrink-0" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Amenities Grid */}
              <div>
                <h4 className="font-serif text-lg font-medium text-neutral-900 mb-3">
                  Building Services & Amenities
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {property.amenities.map((amenity, i) => (
                    <div
                      key={i}
                      className="p-3 bg-neutral-50 rounded-lg border border-neutral-200 text-xs font-medium text-neutral-800 flex items-center gap-2"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Floor Plan */}
          {activeTab === 'floorplan' && (
            <div>
              <div className="bg-neutral-50 p-5 rounded-xl border border-neutral-200 mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-neutral-200 mb-4 gap-2">
                  <div>
                    <h4 className="font-serif text-lg font-medium text-neutral-900">
                      {property.floorPlan.name}
                    </h4>
                    <p className="text-xs text-neutral-500">{property.floorPlan.dimensions}</p>
                  </div>
                  <div className="text-xs font-semibold text-amber-900 bg-amber-100/70 px-3 py-1 rounded">
                    Architectural Layout Scale 1:50
                  </div>
                </div>

                {/* Room by Room dimension table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="border-b border-neutral-200 text-neutral-500 uppercase text-[10px] tracking-wider">
                        <th className="py-2">Chamber / Room</th>
                        <th className="py-2 text-right">Imperial Dimensions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200">
                      {property.floorPlan.rooms.map((r, i) => (
                        <tr key={i} className="hover:bg-white/60">
                          <td className="py-2.5 font-medium text-neutral-800">{r.room}</td>
                          <td className="py-2.5 text-right font-mono text-neutral-700 tabular-nums">
                            {r.size}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Walk Score & Transit */}
          {activeTab === 'neighborhood' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-200 text-center">
                  <div className="font-serif text-3xl font-bold text-emerald-900 tabular-nums">
                    {property.walkScore.walk} / 100
                  </div>
                  <div className="text-xs font-semibold text-emerald-950 mt-1">Walker's Paradise</div>
                  <div className="text-[11px] text-emerald-700 mt-0.5">Daily errands do not require a car</div>
                </div>

                <div className="p-4 bg-sky-50/50 rounded-xl border border-sky-200 text-center">
                  <div className="font-serif text-3xl font-bold text-sky-900 tabular-nums">
                    {property.walkScore.transit} / 100
                  </div>
                  <div className="text-xs font-semibold text-sky-950 mt-1">Rider's Paradise</div>
                  <div className="text-[11px] text-sky-700 mt-0.5">World-class public transit connections</div>
                </div>

                <div className="p-4 bg-amber-50/50 rounded-xl border border-amber-200 text-center">
                  <div className="font-serif text-3xl font-bold text-amber-900 tabular-nums">
                    {property.walkScore.bike} / 100
                  </div>
                  <div className="text-xs font-semibold text-amber-950 mt-1">Biker's Haven</div>
                  <div className="text-[11px] text-amber-700 mt-0.5">Flat terrain and protected lanes</div>
                </div>
              </div>

              <div>
                <h4 className="font-serif text-base font-medium text-neutral-900 mb-3">
                  Immediate Walking Hotspots
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {property.nearbyHotspots.map((h, i) => (
                    <div key={i} className="p-3 bg-neutral-50 rounded-lg border border-neutral-200 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-semibold text-neutral-900">{h.name}</div>
                        <div className="text-[11px] text-neutral-500">{h.category}</div>
                      </div>
                      <span className="text-neutral-700 font-medium">{h.distance}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: Financials */}
          {activeTab === 'financials' && (
            <div className="space-y-4">
              <div className="bg-neutral-50 p-5 rounded-xl border border-neutral-200">
                <h4 className="font-serif text-lg font-medium text-neutral-900 mb-4">
                  Ownership & Carrying Cost Estimates
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-3 bg-white rounded border border-neutral-200">
                    <span className="text-neutral-500 block">Monthly Common Charges (HOA)</span>
                    <span className="text-base font-bold text-neutral-900 tabular-nums">
                      ${property.hoaFee.toLocaleString()} / mo
                    </span>
                    <span className="text-[10px] text-neutral-400 block mt-0.5">
                      Covers 24/7 staff, gym, spa & building insurance
                    </span>
                  </div>

                  <div className="p-3 bg-white rounded border border-neutral-200">
                    <span className="text-neutral-500 block">Estimated Annual Property Tax</span>
                    <span className="text-base font-bold text-neutral-900 tabular-nums">
                      ${property.propertyTaxEstimate.toLocaleString()} / yr
                    </span>
                    <span className="text-[10px] text-neutral-400 block mt-0.5">
                      ~${Math.round(property.propertyTaxEstimate / 12).toLocaleString()} monthly equivalent
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Assigned Private Agent Card */}
          <div className="mt-8 pt-6 border-t border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-amber-50/40 p-4 rounded-xl border border-amber-200/60">
            <div className="flex items-center gap-3">
              <img
                src={property.agent.avatar}
                alt={property.agent.name}
                className="w-12 h-12 rounded-full object-cover border border-amber-300"
                referrerPolicy="no-referrer"
              />
              <div>
                <h5 className="font-serif font-semibold text-neutral-900 text-sm">
                  {property.agent.name}
                </h5>
                <p className="text-xs text-neutral-600">{property.agent.role}</p>
                <p className="text-[11px] text-neutral-500 mt-0.5">
                  Speaks {property.agent.languages.join(', ')}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={`tel:${property.agent.phone}`}
                className="p-2.5 bg-white hover:bg-neutral-100 text-neutral-800 rounded-md border border-neutral-200 text-xs font-medium transition-colors flex items-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5 text-amber-800" />
                <span className="hidden sm:inline">Call</span>
              </a>
              <button
                onClick={() => {
                  onClose();
                  onBookViewing(property);
                }}
                className="px-4 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-md text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Calendar className="w-3.5 h-3.5 text-amber-300" />
                <span>Book Private Viewing</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
