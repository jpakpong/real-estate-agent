import React from 'react';
import { DISTRICT_INFO } from '../data/properties';
import { MapPin, Compass, ArrowRight, Check } from 'lucide-react';
import buildingFacadeImg from '../assets/images/flat_building_facade_1791027976472.jpg';
import skylineTerraceImg from '../assets/images/flat_skyline_terrace_1791027940195.jpg';

interface NeighborhoodGuideProps {
  onSelectDistrict: (district: string) => void;
}

export const NeighborhoodGuide: React.FC<NeighborhoodGuideProps> = ({ onSelectDistrict }) => {
  return (
    <section id="districts-section" className="py-20 bg-neutral-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-amber-300 mb-1">
              Metropolitan Topography
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-medium text-white">
              Prime City Center Districts
            </h2>
            <p className="text-sm text-neutral-400 mt-1 max-w-xl">
              From high-altitude financial towers to tranquil waterside marinas, discover each micro-neighborhood's residential cadence.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {DISTRICT_INFO.map((dist) => (
            <div
              key={dist.name}
              className="bg-neutral-800/70 rounded-xl p-6 border border-neutral-700/80 hover:border-amber-400/60 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-amber-300/80 mb-3">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-amber-400" />
                    <span>Downtown Quarter</span>
                  </span>
                  <span className="font-mono text-white/90 tabular-nums">{dist.avgSqftPrice}</span>
                </div>

                <h3 className="font-serif text-2xl font-medium text-white mb-2 group-hover:text-amber-200 transition-colors">
                  {dist.name}
                </h3>
                <p className="text-xs text-amber-100/70 font-medium mb-3">{dist.subtitle}</p>
                <p className="text-xs text-neutral-300 leading-relaxed mb-6 font-normal">
                  {dist.description}
                </p>

                {/* Highlights */}
                <div className="space-y-1.5 mb-6 text-xs text-neutral-400">
                  {dist.highlights.map((h, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="w-1 h-1 rounded-full bg-amber-400 shrink-0" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-700/80 flex items-center justify-between">
                <span className="text-[11px] text-neutral-400">
                  Walk Score <strong className="text-white font-semibold tabular-nums">{dist.walkScore}</strong>
                </span>

                <button
                  onClick={() => onSelectDistrict(dist.name)}
                  className="text-xs font-semibold text-amber-300 hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <span>View Flats</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
