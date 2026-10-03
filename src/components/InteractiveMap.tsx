import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Property } from '../types';
import { MapPin, Navigation, Eye, Calendar, Sparkles, Layers, Compass, Train, Coffee } from 'lucide-react';

interface InteractiveMapProps {
  properties: Property[];
  selectedProperty: Property | null;
  onSelectProperty: (property: Property) => void;
  onViewDetails: (property: Property) => void;
  onBookViewing: (property: Property) => void;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  properties,
  selectedProperty,
  onSelectProperty,
  onViewDetails,
  onBookViewing,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [id: string]: L.Marker }>({});
  const [mapStyle, setMapStyle] = useState<'voyager' | 'positron' | 'osm'>('voyager');
  const [activeDistrictFilter, setActiveDistrictFilter] = useState<string>('all');
  const [showTransitLayer, setShowTransitLayer] = useState<boolean>(true);

  // Filter properties based on district
  const filteredProperties = properties.filter((p) => {
    if (activeDistrictFilter === 'all') return true;
    return p.district === activeDistrictFilter;
  });

  // Transit markers around city center
  const transitPoints = [
    { name: 'Meridian Metro Central Hub', coords: [40.7138, -74.0065] as [number, number], lines: 'Lines 1, 2, 3, A, C' },
    { name: 'St. George Arts Station', coords: [40.7180, -74.0018] as [number, number], lines: 'Lines N, Q, R, W' },
    { name: 'Grand Central Civic Concourse', coords: [40.7165, -74.0105] as [number, number], lines: 'Lines 4, 5, 6, J, Z' },
    { name: 'Harbor Marina Ferry Terminal', coords: [40.7090, -74.0145] as [number, number], lines: 'Express Water Ferries' },
  ];

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Center of prime downtown city center
      const center: [number, number] = [40.7145, -74.008];
      const map = L.map(mapContainerRef.current, {
        center,
        zoom: 15,
        zoomControl: false,
        attributionControl: false,
        scrollWheelZoom: true,
      });

      // Add custom zoom control in bottom right
      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // Attribution in bottom right quietly
      L.control.attribution({ position: 'bottomleft', prefix: '© OpenStreetMap · Aurelia Cartography' }).addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Remove existing tile layer and apply selected style
    map.eachLayer((layer) => {
      if (layer instanceof L.TileLayer) {
        map.removeLayer(layer);
      }
    });

    let tileUrl = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
    if (mapStyle === 'positron') {
      tileUrl = 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';
    } else if (mapStyle === 'osm') {
      tileUrl = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
    }

    L.tileLayer(tileUrl, {
      maxZoom: 19,
      subdomains: 'abcd',
    }).addTo(map);

    return () => {
      // Cleanup on unmount handled on component disposal
    };
  }, [mapStyle]);

  // Update Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear old property markers
    Object.values(markersRef.current).forEach((marker) => marker.remove());
    markersRef.current = {};

    // Clear transit markers
    map.eachLayer((layer) => {
      if ((layer as any).isTransitMarker) {
        map.removeLayer(layer);
      }
    });

    // Add Transit Markers if enabled
    if (showTransitLayer) {
      transitPoints.forEach((point) => {
        const transitIcon = L.divIcon({
          className: 'custom-map-pin',
          html: `
            <div class="flex items-center gap-1.5 bg-neutral-900/90 text-white text-[10px] font-medium px-2 py-1 rounded-md shadow-md border border-neutral-700 backdrop-blur-xs whitespace-nowrap">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="text-amber-400">
                <rect width="16" height="16" x="4" y="3" rx="2"/><path d="M4 11h16"/><path d="M12 3v8"/><path d="m8 19-2 3"/><path d="m18 22-2-3"/><circle cx="8" cy="15" r="1"/><circle cx="16" cy="15" r="1"/>
              </svg>
              <span>${point.name.split(' ')[0]} Metro</span>
            </div>
          `,
          iconSize: [110, 24],
          iconAnchor: [55, 12],
        });

        const transitMarker = L.marker(point.coords, { icon: transitIcon }).addTo(map);
        (transitMarker as any).isTransitMarker = true;
      });
    }

    // Add Property Markers
    filteredProperties.forEach((property) => {
      const isSelected = selectedProperty?.id === property.id;

      const markerHtml = `
        <div class="group cursor-pointer transform transition-all duration-200 ${isSelected ? 'scale-110 z-50' : 'hover:scale-105'}">
          <div class="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg shadow-xl border ${
            isSelected
              ? 'bg-neutral-950 text-amber-300 border-amber-400 ring-2 ring-amber-400/40'
              : 'bg-white text-neutral-900 border-neutral-300/80 hover:border-neutral-900'
          }">
            <span class="w-2 h-2 rounded-full ${isSelected ? 'bg-amber-400 animate-pulse' : 'bg-amber-600'}"></span>
            <div class="flex flex-col text-left">
              <span class="text-[11px] font-bold tracking-tight whitespace-nowrap">${property.priceFormatted}</span>
              <span class="text-[9px] ${isSelected ? 'text-neutral-300' : 'text-neutral-500'} font-medium -mt-0.5">${property.beds} Bed · ${property.sqft} sqft</span>
            </div>
          </div>
          <div class="w-2 h-2 rotate-45 mx-auto -mt-1 ${isSelected ? 'bg-neutral-950 border-r border-b border-amber-400' : 'bg-white border-r border-b border-neutral-300'}"></div>
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'custom-map-pin',
        html: markerHtml,
        iconSize: [100, 40],
        iconAnchor: [50, 40],
      });

      const marker = L.marker(property.coordinates, { icon: customIcon }).addTo(map);

      marker.on('click', () => {
        onSelectProperty(property);
        map.flyTo(property.coordinates, 16, { duration: 0.8 });
      });

      markersRef.current[property.id] = marker;
    });

    // Auto-fit bounds if we have properties
    if (filteredProperties.length > 0 && !selectedProperty) {
      const group = L.featureGroup(Object.values(markersRef.current));
      map.fitBounds(group.getBounds().pad(0.18), { maxZoom: 16 });
    }
  }, [filteredProperties, selectedProperty, showTransitLayer]);

  // When selectedProperty changes from outside (e.g. clicking card), pan to it
  useEffect(() => {
    if (selectedProperty && mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(selectedProperty.coordinates, 16, { duration: 0.8 });
    }
  }, [selectedProperty]);

  const handleRecenter = () => {
    if (mapInstanceRef.current && filteredProperties.length > 0) {
      const group = L.featureGroup(Object.values(markersRef.current));
      mapInstanceRef.current.fitBounds(group.getBounds().pad(0.2));
    }
  };

  return (
    <div id="interactive-map-section" className="py-20 bg-neutral-100 border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-amber-900 mb-1">
              Cartographic Intelligence
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-medium text-neutral-900">
              Interactive City Center Map
            </h2>
            <p className="text-sm text-neutral-600 mt-1 max-w-xl">
              Explore residential flats by micro-district, walking accessibility to transit hubs, Michelin dining, and cultural quarters.
            </p>
          </div>

          {/* District Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-neutral-200/80 rounded-lg shrink-0">
            <button
              onClick={() => setActiveDistrictFilter('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                activeDistrictFilter === 'all'
                  ? 'bg-white text-neutral-900 shadow-sm'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              All City Center ({properties.length})
            </button>
            <button
              onClick={() => setActiveDistrictFilter('Financial Core')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                activeDistrictFilter === 'Financial Core'
                  ? 'bg-white text-neutral-900 shadow-sm'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Financial Core
            </button>
            <button
              onClick={() => setActiveDistrictFilter('Arts & Culture Quarter')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                activeDistrictFilter === 'Arts & Culture Quarter'
                  ? 'bg-white text-neutral-900 shadow-sm'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Arts Quarter
            </button>
            <button
              onClick={() => setActiveDistrictFilter('Harbor Waterfront')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                activeDistrictFilter === 'Harbor Waterfront'
                  ? 'bg-white text-neutral-900 shadow-sm'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Waterfront
            </button>
          </div>
        </div>

        {/* Map Container & Interactive Sidebar Layout */}
        <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white p-3 sm:p-4 rounded-2xl shadow-xl border border-neutral-200/80">
          {/* Main Map Viewport */}
          <div className="lg:col-span-8 xl:col-span-8 relative h-[500px] sm:h-[580px] rounded-xl overflow-hidden border border-neutral-200">
            <div ref={mapContainerRef} className="w-full h-full z-0" />

            {/* Map Top Control Bar */}
            <div className="absolute top-4 left-4 z-10 flex flex-wrap items-center gap-2">
              <div className="bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-md shadow-md border border-neutral-200 text-xs font-medium text-neutral-800 flex items-center gap-2">
                <Compass className="w-3.5 h-3.5 text-amber-700" />
                <span>Downtown Metropolitan Grid</span>
              </div>

              <button
                onClick={() => setShowTransitLayer(!showTransitLayer)}
                className={`px-3 py-1.5 rounded-md shadow-md text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer border ${
                  showTransitLayer
                    ? 'bg-neutral-900 text-white border-neutral-900'
                    : 'bg-white/95 text-neutral-700 border-neutral-200 hover:bg-neutral-100'
                }`}
              >
                <Train className="w-3.5 h-3.5 text-amber-400" />
                <span>Metro Stations</span>
              </button>
            </div>

            {/* Style Switcher & Recenter in top right */}
            <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
              <div className="bg-white/95 backdrop-blur-md p-1 rounded-md shadow-md border border-neutral-200 flex items-center gap-1 text-xs">
                <button
                  onClick={() => setMapStyle('voyager')}
                  className={`px-2 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                    mapStyle === 'voyager' ? 'bg-neutral-900 text-white' : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  Architectural
                </button>
                <button
                  onClick={() => setMapStyle('positron')}
                  className={`px-2 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                    mapStyle === 'positron' ? 'bg-neutral-900 text-white' : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  Monochrome
                </button>
              </div>

              <button
                onClick={handleRecenter}
                title="Recenter Map"
                className="bg-white/95 hover:bg-neutral-100 text-neutral-800 p-2 rounded-md shadow-md border border-neutral-200 transition-colors cursor-pointer"
              >
                <Navigation className="w-4 h-4 text-neutral-700" />
              </button>
            </div>

            {/* Instruction footnote on map */}
            <div className="absolute bottom-4 left-4 z-10 hidden sm:block bg-neutral-900/85 text-white/90 text-[11px] px-3 py-1 rounded-md backdrop-blur-sm">
              Click any price pin to preview flat specifications
            </div>
          </div>

          {/* Right Inspector Panel */}
          <div className="lg:col-span-4 xl:col-span-4 flex flex-col h-[500px] sm:h-[580px] overflow-hidden">
            {selectedProperty ? (
              <div className="h-full flex flex-col justify-between bg-neutral-50 rounded-xl p-5 border border-neutral-200">
                {/* Header of selected flat */}
                <div>
                  <div className="flex items-center justify-between text-xs text-neutral-500 mb-2">
                    <span className="font-medium text-amber-900">{selectedProperty.district}</span>
                    <span>{selectedProperty.floor}</span>
                  </div>

                  <h3 className="font-serif text-2xl font-medium text-neutral-900 leading-snug mb-1">
                    {selectedProperty.title}
                  </h3>
                  <p className="text-xs text-neutral-600 mb-3 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                    <span className="truncate">{selectedProperty.address}</span>
                  </p>

                  {/* Thumbnail Image with hover effect */}
                  <div
                    onClick={() => onViewDetails(selectedProperty)}
                    className="relative h-44 rounded-lg overflow-hidden mb-4 group cursor-pointer border border-neutral-200"
                  >
                    <img
                      src={selectedProperty.heroImage}
                      alt={selectedProperty.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-2.5 left-3 text-white">
                      <div className="text-lg font-serif font-bold text-white tabular-nums">
                        {selectedProperty.priceFormatted}
                      </div>
                    </div>
                    <div className="absolute top-2.5 right-2.5 bg-neutral-950/80 text-white text-[10px] px-2 py-0.5 rounded backdrop-blur-xs flex items-center gap-1">
                      <Eye className="w-3 h-3 text-amber-400" />
                      <span>Quick View</span>
                    </div>
                  </div>

                  {/* Key Specs unboxed with typographic separators */}
                  <div className="flex items-center justify-between py-2 border-y border-neutral-200 text-xs text-neutral-700">
                    <div>
                      <span className="font-semibold text-neutral-950">{selectedProperty.beds}</span> Beds
                    </div>
                    <span className="text-neutral-300">·</span>
                    <div>
                      <span className="font-semibold text-neutral-950">{selectedProperty.baths}</span> Baths
                    </div>
                    <span className="text-neutral-300">·</span>
                    <div>
                      <span className="font-semibold text-neutral-950 tabular-nums">{selectedProperty.sqft}</span> sq ft
                    </div>
                    <span className="text-neutral-300">·</span>
                    <div>
                      <span className="font-semibold text-emerald-800">{selectedProperty.status}</span>
                    </div>
                  </div>

                  {/* Walk Scores */}
                  <div className="mt-3 bg-white p-2.5 rounded-lg border border-neutral-200/80">
                    <div className="text-[11px] font-semibold text-neutral-600 mb-1">Accessibility Scores</div>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="bg-neutral-50 p-1.5 rounded">
                        <div className="text-xs font-bold text-neutral-900 tabular-nums">{selectedProperty.walkScore.walk}</div>
                        <div className="text-[9px] text-neutral-500">Walk Paradise</div>
                      </div>
                      <div className="bg-neutral-50 p-1.5 rounded">
                        <div className="text-xs font-bold text-neutral-900 tabular-nums">{selectedProperty.walkScore.transit}</div>
                        <div className="text-[9px] text-neutral-500">Transit Score</div>
                      </div>
                      <div className="bg-neutral-50 p-1.5 rounded">
                        <div className="text-xs font-bold text-neutral-900 tabular-nums">{selectedProperty.walkScore.bike}</div>
                        <div className="text-[9px] text-neutral-500">Bike Friendly</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Action CTAs */}
                <div className="grid grid-cols-2 gap-2 pt-3 border-t border-neutral-200">
                  <button
                    onClick={() => onViewDetails(selectedProperty)}
                    className="py-2.5 px-3 bg-white hover:bg-neutral-100 border border-neutral-300 text-neutral-900 text-xs font-medium rounded-md transition-colors cursor-pointer text-center"
                  >
                    Residence Specs
                  </button>
                  <button
                    onClick={() => onBookViewing(selectedProperty)}
                    className="py-2.5 px-3 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-medium rounded-md transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <Calendar className="w-3.5 h-3.5 text-amber-300" />
                    <span>Book Viewing</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-neutral-50 rounded-xl border border-dashed border-neutral-300">
                <MapPin className="w-10 h-10 text-neutral-400 mb-3" />
                <h4 className="font-serif text-lg font-medium text-neutral-800 mb-1">
                  Select a Residence on Map
                </h4>
                <p className="text-xs text-neutral-500 max-w-xs mb-4">
                  Click any pin across the city center to inspect architectural layouts, pricing, and book private walk-throughs.
                </p>
                <div className="text-xs text-amber-900 font-medium bg-amber-50 px-3 py-1 rounded border border-amber-200">
                  {filteredProperties.length} residences in current view
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
