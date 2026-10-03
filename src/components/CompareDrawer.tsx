import React from 'react';
import { Property } from '../types';
import { X, Scale, Calendar, Check, Minus } from 'lucide-react';

interface CompareDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  compareList: Property[];
  onRemoveFromCompare: (id: string) => void;
  onClearCompare: () => void;
  onBookViewing: (property: Property) => void;
  onViewDetails: (property: Property) => void;
}

export const CompareDrawer: React.FC<CompareDrawerProps> = ({
  isOpen,
  onClose,
  compareList,
  onRemoveFromCompare,
  onClearCompare,
  onBookViewing,
  onViewDetails,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="relative bg-white rounded-2xl max-w-5xl w-full shadow-2xl border border-neutral-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-5 px-6 border-b border-neutral-200 flex items-center justify-between bg-neutral-50 shrink-0">
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-amber-800" />
            <h3 className="font-serif text-2xl font-medium text-neutral-900">
              Side-by-Side Residence Comparison
            </h3>
          </div>

          <div className="flex items-center gap-3">
            {compareList.length > 0 && (
              <button
                onClick={onClearCompare}
                className="text-xs text-neutral-500 hover:text-neutral-800 underline cursor-pointer"
              >
                Clear all
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-md hover:bg-neutral-200 text-neutral-600 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1 p-6">
          {compareList.length === 0 ? (
            <div className="text-center py-16">
              <Scale className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
              <p className="text-sm font-medium text-neutral-800">No residences selected for comparison</p>
              <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto mb-4">
                Click the compare icon on any property card to benchmark specs, square footage, and carrying charges.
              </p>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-neutral-900 text-white text-xs font-medium rounded-md hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                Browse Residences
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr>
                    <th className="p-3 w-40 text-neutral-400 font-normal uppercase text-[10px] tracking-wider border-b border-neutral-200">
                      Specification
                    </th>
                    {compareList.map((p) => (
                      <th
                        key={p.id}
                        className="p-3 w-64 border-b border-neutral-200 align-top bg-neutral-50/50"
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <img
                            src={p.heroImage}
                            alt={p.title}
                            className="w-full h-28 object-cover rounded-lg border border-neutral-200"
                            referrerPolicy="no-referrer"
                          />
                          <button
                            onClick={() => onRemoveFromCompare(p.id)}
                            className="text-neutral-400 hover:text-neutral-700 p-1 cursor-pointer"
                            title="Remove from compare"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <h4 className="font-serif font-semibold text-neutral-900 text-sm line-clamp-1">
                          {p.title}
                        </h4>
                        <div className="font-serif text-lg font-bold text-neutral-900 tabular-nums my-1">
                          {p.priceFormatted}
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => {
                              onClose();
                              onViewDetails(p);
                            }}
                            className="py-1 px-2 text-[11px] font-medium border border-neutral-300 rounded bg-white hover:bg-neutral-100"
                          >
                            Specs
                          </button>
                          <button
                            onClick={() => {
                              onClose();
                              onBookViewing(p);
                            }}
                            className="py-1 px-2.5 text-[11px] font-medium bg-neutral-900 hover:bg-neutral-800 text-white rounded flex items-center gap-1 shadow-xs"
                          >
                            <Calendar className="w-3 h-3 text-amber-300" />
                            <span>Book</span>
                          </button>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  <tr>
                    <td className="p-3 font-semibold text-neutral-600">District</td>
                    {compareList.map((p) => (
                      <td key={p.id} className="p-3 font-medium text-neutral-900">
                        {p.district}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-neutral-600">Floor Level</td>
                    {compareList.map((p) => (
                      <td key={p.id} className="p-3 text-neutral-800">
                        {p.floor}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-neutral-600">Bedrooms / Baths</td>
                    {compareList.map((p) => (
                      <td key={p.id} className="p-3 font-medium text-neutral-900 tabular-nums">
                        {p.beds} Beds · {p.baths} Baths
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-neutral-600">Interior Sq Ft</td>
                    {compareList.map((p) => (
                      <td key={p.id} className="p-3 font-medium text-neutral-900 tabular-nums">
                        {p.sqft.toLocaleString()} sq ft
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-neutral-600">Price / Sq Ft</td>
                    {compareList.map((p) => (
                      <td key={p.id} className="p-3 font-mono text-neutral-800 tabular-nums">
                        ${Math.round(p.price / p.sqft).toLocaleString()} / sq ft
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-neutral-600">Monthly HOA</td>
                    {compareList.map((p) => (
                      <td key={p.id} className="p-3 font-medium text-neutral-800 tabular-nums">
                        ${p.hoaFee.toLocaleString()} / mo
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-neutral-600">Annual Tax</td>
                    {compareList.map((p) => (
                      <td key={p.id} className="p-3 font-medium text-neutral-800 tabular-nums">
                        ${p.propertyTaxEstimate.toLocaleString()} / yr
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-neutral-600">Walk Score</td>
                    {compareList.map((p) => (
                      <td key={p.id} className="p-3 text-emerald-800 font-semibold tabular-nums">
                        {p.walkScore.walk} (Transit {p.walkScore.transit})
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-neutral-600">Status</td>
                    {compareList.map((p) => (
                      <td key={p.id} className="p-3">
                        <span className={p.status === 'Available' ? 'text-emerald-700 font-semibold' : 'text-neutral-700'}>
                          {p.status}
                        </span>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
